"use client";

import { useState } from "react";
import { columns, Result } from "./columns";
import ToggleButton from "./toggle-button";
import { Button } from "@/components/ui/button";
import WordCloud from "@/components/ui/word-cloud";
import { DataTable } from "./data-table";

export default function ResultsView({ data }: { data: Result[] }) {
  const [showCloud, setShowCloud] = useState(false);

  return (
    <>
      <Button onClick={() => setShowCloud(!showCloud)}>Toggle cloud</Button>
      <br />
      {showCloud && <WordCloud width={700} height={500} data={data} />}
      {!showCloud && <DataTable data={data} columns={columns} />}
    </>
  );
}
