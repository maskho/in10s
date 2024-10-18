"use client";
import React from "react";
import D3WordCloud from "react-d3-cloud";
import { useTheme } from "next-themes";

const data = [
  { text: "Hello", value: 10 },
  { text: "world", value: 20 },
  { text: "normally", value: 5 },
  { text: "you", value: 400 },
];

const fontSizeMapper = (word: { value: number }) =>
  Math.log2(word.value) * 5 + 16;

const CustomWordCloud = () => {
  const theme = useTheme();
  return (
    <>
      <D3WordCloud
        height={550}
        font={"sans-serif"}
        fontSize={fontSizeMapper}
        rotate={0}
        padding={10}
        fill={theme.theme === "dark" ? "#fff" : "#000"}
        data={data}
      />
    </>
  );
};

export default CustomWordCloud;
