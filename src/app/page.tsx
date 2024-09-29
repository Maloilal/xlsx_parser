"use client";

import React, { useState, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import * as XLSX from "xlsx";

import { DataChart } from "../components/DataChart";
import { DataTable } from "@/components/DataTable";

export class FileData {
  public rows: string[][] = [];
}

export default function Home() {
  const [file, setFile] = useState<FileData | null>(null);

  const handleUploadFile = (event: ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();
    if (!event.target.files || !event.target.files.length) {
      return;
    }

    const selectedFile = event.target.files[0];

    if (
      selectedFile.type ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      reader.onload = (evt) => {
        const binaryStr = evt.target?.result;
        const workbook = XLSX.read(binaryStr, { type: "binary" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        const table = new FileData();
        table.rows = jsonData.map((row: unknown) =>
          (row as unknown[]).map((cell: unknown) => String(cell))
        );
        setFile(table);
        console.log(table);
      };
      reader.readAsBinaryString(selectedFile);
    } else if (selectedFile.type === "text/csv") {
      reader.readAsText(selectedFile, "UTF-8");
      reader.onload = function (evt) {
        if (
          !evt.target ||
          !evt.target.result ||
          evt.target.result instanceof ArrayBuffer
        ) {
          return;
        }
        const rows = evt.target.result.split("\r\n");
        const table = new FileData();
        rows.forEach((row, index) => {
          table.rows[index] = row.split(";").map((cell) => String(cell));
        });
        setFile(table);
        console.log(table);
      };
    } else {
      alert("Please upload a valid CSV or XLSX file.");
    }
  };

  return (
    <>
      {!file ? (
        <Card style={{ maxWidth: "500px", margin: "auto" }}>
          <CardContent className="p-6 space-y-4">
            <div className="border-2 border-dashed border-gray-200 rounded-lg flex flex-col gap-1 p-6 items-center">
              <span className="text-xs text-gray-500">
                Выберете CSV или XLSX файл
              </span>
            </div>
            <div className="space-y-2 text-sm">
              <Label htmlFor="file" className="text-sm font-medium">
                Файл
              </Label>
              <Input
                onChange={(event) => handleUploadFile(event)}
                id="file"
                type="file"
                placeholder="File"
                accept=".csv*,.xlsx*"
              />
            </div>
          </CardContent>
        </Card>
      ) : (
        <Button
          onClick={() => {
            setFile(null);
          }}
        >
          Выбрать новый файл
        </Button>
      )}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <DataTable rawData={file} onDataChange={setFile} />
        <DataChart rawData={file} />
      </div>
    </>
  );
}
