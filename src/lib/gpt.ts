import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface OutputFormat {
  [key: string]: string | string[] | OutputFormat;
}

interface StrictOutputOptions {
  system_prompt: string;
  user_prompt: string | string[];
  output_format: OutputFormat;
  default_category?: string;
  output_value_only?: boolean;
  model?: string;
  temperature?: number;
  num_tries?: number;
  verbose?: boolean;
}

export async function strict_output(options: StrictOutputOptions) {
  const {
    system_prompt,
    user_prompt,
    output_format,
    default_category = "",
    output_value_only = false,
    model = "gpt-3.5-turbo",
    temperature = 1,
    num_tries = 3,
    verbose = false,
  } = options;

  // if the user input is in a list, we also process the output as a list of json
  const list_input: boolean = Array.isArray(user_prompt);
  // if the output format contains dynamic elements of < or >, then add to the prompt to handle dynamic elements
  const dynamic_elements: boolean = /<.*?>/.test(JSON.stringify(output_format));
  // if the output format contains list elements of [ or ], then we add to the prompt to handle lists
  const list_output: boolean = /\[.*?\]/.test(JSON.stringify(output_format));

  // start off with no error message
  let error_msg: string = "";

  for (let i = 0; i < num_tries; i++) {
    const output_format_prompt = generateOutputPrompt({
      output_format,
      list_output,
      list_input,
      dynamic_elements,
    });

    // Use OpenAI to get a response
    const res = await getGPTResponse(
      temperature,
      model,
      system_prompt + output_format_prompt + error_msg,
      user_prompt.toString()
    );

    if (verbose) {
      console.log(
        "System prompt:",
        system_prompt + output_format_prompt + error_msg
      );
      console.log("\nUser prompt:", user_prompt);
      console.log("\nGPT response:", res);
    }

    // try-catch block to ensure output format is adhered to
    try {
      const output = validateJSONArray(res, list_input);

      // check for each element in the output_list, the format is correctly adhered to
      for (let index = 0; index < output.length; index++) {
        for (const key in output_format) {
          // unable to ensure accuracy of dynamic output header, so skip it
          if (/<.*?>/.test(key)) continue;

          // if output field missing, raise an error
          if (!(key in output[index])) {
            throw new Error(`${key} not in json output`);
          }

          // check that one of the choices given for the list of words is an unknown
          if (Array.isArray(output_format[key])) {
            const choices = output_format[key] as string[];
            // ensure output is not a list
            if (Array.isArray(output[index][key])) {
              output[index][key] = output[index][key][0];
            }
            // output the default category (if any) if GPT is unable to identify the category
            if (!choices.includes(output[index][key]) && default_category) {
              output[index][key] = default_category;
            }
            // if the output is a description format, get only the label
            if (output[index][key].includes(":")) {
              output[index][key] = output[index][key].split(":")[0];
            }
          }
        }

        // if we just want the values for the outputs
        if (output_value_only) {
          output[index] = Object.values(output[index]);
          // just output without the list if there is only one element
          if (output[index].length === 1) {
            output[index] = output[index][0];
          }
        }
      }

      return list_input ? output : output[0];
    } catch (e) {
      error_msg = `\n\nResult: ${res}\n\nError message: ${e}`;
      console.log("An exception occurred:", e);
      console.log("Current invalid json format ", res);
    }
  }

  return [];
}

function generateOutputPrompt({
  output_format,
  list_output,
  list_input,
  dynamic_elements,
}: {
  output_format: OutputFormat;
  list_output: boolean;
  list_input: boolean;
  dynamic_elements: boolean;
}): string {
  let output_format_prompt: string = `\nYou are to output ${
    list_output && "an array of objects in"
  } the following in json format: ${JSON.stringify(
    output_format
  )}. \nDo not put quotation marks or escape character \\ in the output fields.`;

  if (list_output) {
    output_format_prompt += `\nIf output field is a list, classify output into the best element of the list.`;
  }

  // if output_format contains dynamic elements, process it accordingly
  if (dynamic_elements) {
    output_format_prompt += `\nAny text enclosed by < and > indicates you must generate content to replace it. Example input: Go to <location>, Example output: Go to the garden\nAny output key containing < and > indicates you must generate the key name to replace it. Example input: {'<location>': 'description of location'}, Example output: {school: a place for education}`;
  }

  // if input is in a list format, ask it to generate json in a list
  if (list_input) {
    output_format_prompt += `\nGenerate an array of json, one json for each input element.`;
  }

  return output_format_prompt;
}

async function getGPTResponse(
  temperature: number,
  model: string,
  systemContent: string,
  userContent: string
) {
  const response = await openai.chat.completions.create({
    temperature,
    model,
    messages: [
      { role: "system", content: systemContent },
      { role: "user", content: userContent },
    ],
  });

  const res: string =
    response.choices[0].message?.content?.replace(/'/g, '"') ?? "";

  // ensure that we don't replace away apostrophes in text
  return res.replace(/(\w)"(\w)/g, "$1'$2");
}

function validateJSONArray(res: string, list_input: boolean) {
  try {
    let output = JSON.parse(res);

    if (list_input) {
      if (!Array.isArray(output)) {
        throw new Error("Output format not in an array of json");
      }
    } else {
      output = [output];
    }
    return output;
  } catch (e) {
    throw new Error(`Result: ${res}\n\nError message: ${e}`);
  }
}
