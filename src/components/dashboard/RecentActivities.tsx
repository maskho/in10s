import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

type Props = {};

const RecentActivities = (props: Props) => {
  return (
    <Card className="col-span-4 lg:col-span-3">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Aktivitas Terbaru</CardTitle>
        <CardDescription>
          Lihat aktivitas terbaru yang terjadi di platform ini!
        </CardDescription>
      </CardHeader>
      <CardContent className="max-h-[580px] overflow-scroll">
        testetst
      </CardContent>
    </Card>
  );
};

export default RecentActivities;
