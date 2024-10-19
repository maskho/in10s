"use client";
import React from "react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const D3WordCloud = dynamic(() => import("react-d3-cloud"), { ssr: false });

type Props = {
  topics: { text: string; value: number }[];
};

const fontSizeMapper = (word: { value: number }) =>
  Math.log2(word.value) * 5 + 16;

const CustomWordCloud = ({ topics }: Props) => {
  const theme = useTheme();
  const router = useRouter();

  return (
    <>
      <D3WordCloud
        height={550}
        font={"sans-serif"}
        fontSize={fontSizeMapper}
        rotate={0}
        padding={10}
        fill={theme.theme === "dark" ? "#fff" : "#000"}
        data={topics}
        onWordClick={(event, word) => {
          router.push(`/quiz?topic=${word.text}`);
        }}
      />
    </>
  );
};

export default CustomWordCloud;
