import LoginButton from "@/components/LoginButton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAuthSession } from "@/lib/nextauth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getAuthSession();
  if (session?.user) return redirect("/dashboard");

  return (
    <div className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
      <Card className="w-[300px]">
        <CardHeader>
          <CardTitle>Selamat Datang di in10s [baca: intens]</CardTitle>
          <CardDescription>
            in10s adalah aplikasi untuk membantu kamu meningkatkan intensitas
            belajar dengan mengerjakan soal-soal latihan.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginButton text="Login dengan Google" />
        </CardContent>
      </Card>
    </div>
  );
}
