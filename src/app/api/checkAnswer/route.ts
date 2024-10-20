import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { checkAnswerSchema } from "@/schemas/form/quiz";
import stringComparison from "string-comparison";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { questionId, userAnswer } = checkAnswerSchema.parse(body);
    const question = await prisma.question.findUnique({
      where: { id: questionId },
    });
    if (!question) {
      return NextResponse.json(
        { message: "Question not found" },
        { status: 404 }
      );
    }
    await prisma.question.update({
      where: { id: questionId },
      data: { userAnswer },
    });
    if (question.questionType === "mcq") {
      const isCorrect =
        question.answer.toLowerCase().trim() ===
        userAnswer.toLowerCase().trim();
      await prisma.question.update({
        where: { id: questionId },
        data: { isCorrect },
      });

      return NextResponse.json({ isCorrect });
    } else if (question.questionType === "open_ended") {
      let percentageSimilar = stringComparison.diceCoefficient.similarity(
        question.answer.toLowerCase().trim(),
        userAnswer.toLowerCase().trim()
      );
      percentageSimilar = Math.round(percentageSimilar * 100);
      await prisma.question.update({
        where: { id: questionId },
        data: { percentageCorrect: percentageSimilar },
      });
      return NextResponse.json({ percentageSimilar });
    }
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ message: error.issues }, { status: 400 });
    }
  }
}
