"use client";

import React, { useState, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import * as XLSX from "xlsx";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataChart } from "./DataChart";

export class DataTable {
  public rows: string[][] = [];
}

export default function Home() {
  const [file, setFile] = useState<DataTable | null>(null);

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
      // Обработка XLSX файла
      reader.onload = (evt) => {
        const binaryStr = evt.target?.result;
        const workbook = XLSX.read(binaryStr, { type: "binary" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        const table = new DataTable();
        table.rows = jsonData.map((row: any) =>
          row.map((cell: any) => String(cell))
        ); // Приводим к строкам
        setFile(table);
        console.log(table);
      };
      reader.readAsBinaryString(selectedFile);
    } else if (selectedFile.type === "text/csv") {
      // Обработка CSV файла
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
        const table = new DataTable();
        rows.forEach((row, index) => {
          table.rows[index] = row.split(";").map((cell) => String(cell)); // Приводим к строкам
        });
        setFile(table);
        console.log(table);
      };
    } else {
      alert("Please upload a valid CSV or XLSX file.");
    }
  };
  const handleCellChange = (
    event: ChangeEvent<HTMLInputElement>,
    cellIndex: number,
    rowIndex: number
  ) => {
    if (!file) {
      return;
    }
    const uploadFile = new DataTable();

    uploadFile.rows = file.rows.map((row) => [...row]);

    uploadFile.rows[rowIndex][cellIndex] = event.target.value;

    console.log(uploadFile);

    setFile(uploadFile);
  };

  /////////////////////////////

  /////////////////////////////

  return (
    <>
      <Card style={{ maxWidth: "500px", margin: "auto" }}>
        <CardContent className="p-6 space-y-4">
          <div className="border-2 border-dashed border-gray-200 rounded-lg flex flex-col gap-1 p-6 items-center">
            <span className="text-sm font-medium text-gray-500">
              Drag and drop a file or click to browse
            </span>
            <span className="text-xs text-gray-500">
              PDF, image, video, or audio
            </span>
          </div>
          <div className="space-y-2 text-sm">
            <Label htmlFor="file" className="text-sm font-medium">
              File
            </Label>
            <Input
              onChange={(event) => handleUploadFile(event)}
              id="file"
              type="file"
              placeholder="File"
              accept=".csv*"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button size="lg">Upload</Button>
        </CardFooter>
      </Card>
      <Table style={{ maxWidth: "1000px", margin: "auto" }}>
        <TableCaption>A list of your recent invoices.</TableCaption>
        {file && file.rows.length > 0 && (
          <>
            <TableHeader>
              <TableRow>
                {file.rows[0].map((cell, cellIndex) => (
                  <TableHead key={cellIndex}>
                    <input
                      type="text"
                      value={cell}
                      onChange={(event) =>
                        handleCellChange(event, cellIndex, 0)
                      }
                    ></input>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {file.rows.slice(1).map((row, index) => (
                <TableRow key={index}>
                  {row.map((cell, cellIndex) => (
                    <TableCell key={cellIndex}>
                      <input
                        type="text"
                        value={cell}
                        onChange={(event) =>
                          handleCellChange(event, cellIndex, index + 1)
                        }
                      ></input>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </>
        )}
      </Table>
      <DataChart rawData={file} />
    </>
  );
}
