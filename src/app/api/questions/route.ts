import { strict_output } from "@/lib/gpt";
import { getAuthSession } from "@/lib/nextauth";
import { quizCreationSchema } from "@/schemas/form/quiz";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

// POST /api/questions
export async function POST(req: Request) {
  try {
    const session = await getAuthSession();
    console.log("/api/questions session", session);
    // TODO: Protect this route
    // if (!session?.user) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }
    const body = await req.json();
    const { amount, topic, type } = quizCreationSchema.parse(body);
    let questions;
    if (type === "mcq") {
      questions = await strict_output(
        "Anda adalah pembuat soal terbaik di topik " +
          topic +
          " dan dapat membuat " +
          amount +
          " soal pilihan ganda. Simpan soal dan jawaban anda dalam format JSON array.",
        new Array(amount).fill(
          `Buat soal pilihan ganda dengan jawaban singkat terkait ${topic}. Sertakan pilihan lainnya.`
        ),
        {
          question: "soal",
          answer: "jawaban dengan panjang maksimal 100 karakter",
          option1: "pilihan 1",
          option2: "pilihan 2",
          option3: "pilihan 3",
        }
      );
    } else if (type === "open_ended") {
      questions = await strict_output(
        "Anda adalah pembuat soal terbaik di topik " +
          topic +
          " dan dapat membuat " +
          amount +
          " soal dengan jawaban singkat. Simpan soal anda dalam format JSON array.",
        new Array(amount).fill(
          `Buat soal dengan jawaban singkat terkait ${topic}`
        ),
        {
          question: "soal",
          answer: "jawaban dengan panjang maksimal 100 karakter",
        }
      );
    } else {
      throw new Error("Invalid question type");
    }

    return NextResponse.json({ questions }, { status: 200 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    throw error;
  }
}
