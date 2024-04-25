"use client";
import React, { useMemo, useState } from "react";
import { Text } from "@visx/text";
import { scaleLog } from "@visx/scale";
import Wordcloud from "@visx/wordcloud/lib/Wordcloud";
import { Result } from "@/app/[questionId]/results/columns";
import { useTheme } from "next-themes";

interface WordCloudProps {
  width: number;
  height: number;
  data: Result[];
}

export interface WordData {
  text: string;
  value: number;
}

function getRotationDegree() {
  const rand = Math.random();
  const degree = rand > 0.5 ? 60 : -60;
  return rand * degree;
}

const fixedValueGenerator = () => 0.5;

export default function WordCloud({ width, height, data }: WordCloudProps) {
  const { theme } = useTheme();
  const colors = [
    "#FF7518",

    theme == "dark" ? "#ffffff" : "#000000",
    theme == "dark" ? "#ffffff" : "#000000",
    theme == "dark" ? "#ffffff" : "#000000",
  ];
  const fontScale = useMemo(
    () =>
      scaleLog({
        domain: [
          Math.min(...data.map((w) => w.amount)),
          Math.max(...data.map((w) => w.amount)),
        ],
        range: [10, 100],
      }),
    [data]
  );

  const fontSizeSetter = (datum: WordData) => fontScale(datum.value);

  return (
    <div className="wordcloud">
      <Wordcloud
        words={data.map((d) => ({ text: d.name, value: d.amount }))}
        width={width}
        height={height}
        fontSize={fontSizeSetter}
        font={"Arial"}
        padding={2}
        rotate={getRotationDegree}
        random={fixedValueGenerator}
      >
        {(cloudWords) =>
          cloudWords.map((w, i) => (
            <Text
              key={w.text}
              fill={colors[i % colors.length]}
              textAnchor={"middle"}
              transform={`translate(${w.x}, ${w.y}) rotate(${w.rotate})`}
              fontSize={w.size}
              fontFamily={w.font}
            >
              {w.text}
            </Text>
          ))
        }
      </Wordcloud>
      <style jsx>{`
        .wordcloud {
          display: flex;
          flex-direction: column;
          user-select: none;
        }
        .wordcloud svg {
          margin: 1rem 0;
          cursor: pointer;
        }

        .wordcloud label {
          display: inline-flex;
          align-items: center;
          font-size: 14px;
          margin-right: 8px;
        }
        .wordcloud textarea {
          min-height: 100px;
        }
      `}</style>
    </div>
  );
}
