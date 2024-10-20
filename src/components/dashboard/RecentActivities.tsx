import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/nextauth";
import HistoryLog from "../HistoryLog";

const RecentActivities = async () => {
  const session = await getAuthSession();
  if (!session?.user) {
    return redirect("/");
  }

  const gamesCount = await prisma.game.count({
    where: { userId: session.user.id },
  });

  return (
    <Card className="col-span-4 lg:col-span-3">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Aktivitas Terbaru</CardTitle>
        <CardDescription>
          Kamu telah menyelesaikan {gamesCount} kuis
        </CardDescription>
      </CardHeader>
      <CardContent className="max-h-[580px] overflow-scroll">
        <HistoryLog limit={10} userId={session.user.id} />
      </CardContent>
    </Card>
  );
};

export default RecentActivities;
