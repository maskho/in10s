"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { quizCreationSchema } from "@/schemas/form/quiz";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { BookOpen, CopyCheck } from "lucide-react";
import { Separator } from "./ui/separator";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import LoadingQuestions from "./LoadingQuestions";
import { useToast } from "@/hooks/use-toast";

type Props = {
  topicParam: string;
};
type Input = z.infer<typeof quizCreationSchema>;

const QuizCreation = ({ topicParam }: Props) => {
  const router = useRouter();
  const [showLoader, setShowLoader] = React.useState(false);
  const [finishedLoading, setFinishedLoading] = React.useState(false);
  const { toast } = useToast();

  const { mutate: getQuestions, isPending } = useMutation({
    mutationFn: async ({ amount, topic, type }: Input) => {
      const response = await axios.post("/api/game", {
        amount,
        topic,
        type,
      });
      return response.data;
    },
  });

  const form = useForm<Input>({
    resolver: zodResolver(quizCreationSchema),
    defaultValues: {
      amount: 1,
      topic: topicParam,
      type: "mcq",
    },
  });

  function onSubmit(input: Input) {
    setShowLoader(true);
    getQuestions(input, {
      onError: (error) => {
        setShowLoader(false);
        if (error instanceof AxiosError) {
          if (error.response?.status === 500) {
            toast({
              title: "Error",
              description:
                "Terjadi kesalahan pada server. Silahkan coba lagi untuk beberapa saat",
              variant: "destructive",
            });
          }
        }
      },

      onSuccess: ({ gameId }: { gameId: string }) => {
        setFinishedLoading(true);
        setTimeout(() => {
          if (form.getValues("type") === "open_ended") {
            router.push(`/play/open-ended/${gameId}`);
          } else {
            router.push(`/play/mcq/${gameId}`);
          }
        }, 2000);
      },
    });
  }
  form.watch();

  if (showLoader) return <LoadingQuestions finished={finishedLoading} />;

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <Card>
        <CardHeader>
          <CardTitle className="font-bold text-2xl">Buat Kuis</CardTitle>
          <CardDescription>Pilih topik</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Topikk</FormLabel>
                    <FormControl>
                      <Input placeholder="Topik" {...field} />
                    </FormControl>
                    <FormDescription>
                      Masukkan topik kuis yang ingin kamu buat
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jumlah Soal</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Masukkan jumlah soal"
                        type="number"
                        {...field}
                        min={1}
                        max={25}
                        onChange={(e) => {
                          form.setValue("amount", parseInt(e.target.value));
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      Masukkan jumlah soal yang ingin kamu buat
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-between">
                <Button
                  type="button"
                  className="w-1/2 rounded-none rounded-l-lg"
                  variant={
                    form.getValues("type") === "mcq" ? "default" : "secondary"
                  }
                  onClick={() => form.setValue("type", "mcq")}
                >
                  <CopyCheck className="w-4 h-4 mr-2" /> Pilihan Ganda
                </Button>
                <Separator orientation="vertical" />
                <Button
                  type="button"
                  className="w-1/2 rounded-none rounded-r-lg"
                  variant={
                    form.getValues("type") === "open_ended"
                      ? "default"
                      : "secondary"
                  }
                  onClick={() => form.setValue("type", "open_ended")}
                >
                  <BookOpen className="w-4 h-4 mr-2" /> Isian Singkat
                </Button>
              </div>
              <Button disabled={isPending} type="submit">
                Submit
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizCreation;
