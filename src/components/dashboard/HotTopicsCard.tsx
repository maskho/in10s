import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import CustomWordCloud from "../CustomWordCloud";
import { prisma } from "@/lib/db";

const HotTopicsCard = async () => {
  const topics = await prisma.topicCount.findMany({});
  const formattedTopics = topics.map((topic) => ({
    text: topic.topic,
    value: topic.count,
  }));

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Topik Populer</CardTitle>
        <CardDescription>
          Klik pada topik untuk mengerjakan kuis tersedia
        </CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <CustomWordCloud topics={formattedTopics} />
      </CardContent>
    </Card>
  );
};

export default HotTopicsCard;
