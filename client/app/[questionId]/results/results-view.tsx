import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import WordCloud from "@/components/ui/word-cloud";
import { DataTable } from "./data-table";
import { columns, Result } from "./columns";

export default function ResultsView({ data }) {
  const [showCloud, setShowCloud] = useState(false);
  const [cloudWidth, setCloudWidth] = useState(window.innerWidth * 0.8); // 80% of the screen width
  const [couldHeight, setCloudHeight] = useState(window.innerHeight * 0.4); // 500px

  // Adjust the width on window resize
  useEffect(() => {
    const handleResize = () => {
      setCloudWidth(window.innerWidth * 0.8);
      setCloudHeight(window.innerHeight * 0.4);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <Button onClick={() => setShowCloud(!showCloud)}>Toggle cloud</Button>
      <br />
      {showCloud && (
        <WordCloud width={cloudWidth} height={couldHeight} data={data} />
      )}
      {!showCloud && <DataTable data={data} columns={columns} />}
    </>
  );
}
