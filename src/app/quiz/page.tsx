import QuizCreation from "@/components/QuizCreation";
import { getAuthSession } from "@/lib/nextauth";
import { redirect } from "next/navigation";
import React from "react";

export const metadata = {
  title: "Quiz | in10s.id",
};

const QuizPage = async () => {
  const session = await getAuthSession();
  if (!session?.user) return redirect("/");
  return <QuizCreation />;
};

export default QuizPage;
