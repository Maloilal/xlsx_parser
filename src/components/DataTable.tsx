import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FileData } from "@/lib/models";
import React, { ChangeEvent } from "react";

interface DataTableProps {
  rawData: FileData | null;
  onDataChange: (newData: FileData) => void;
}

export function DataTable(props: DataTableProps) {
  const { rawData, onDataChange } = props;

  const handleCellChange = (
    event: ChangeEvent<HTMLInputElement>,
    cellIndex: number,
    rowIndex: number
  ) => {
    if (!rawData) {
      return;
    }
    rawData.rows[rowIndex][cellIndex] = event.target.value;

    console.log(rawData);

    onDataChange({ ...rawData });
  };

  return (
    <Table
      style={{
        maxWidth: "1000px",
        marginLeft: "30px",
        flexGrow: 0,
        flexShrink: 0,
        width: "auto",
      }}
    >
      {rawData && rawData.rows.length > 0 && (
        <>
          <TableHeader>
            <TableRow>
              {rawData.rows[0].map((cell, cellIndex) => (
                <TableHead key={cellIndex}>
                  <input
                    type="text"
                    value={cell}
                    onChange={(event) => handleCellChange(event, cellIndex, 0)}
                  ></input>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rawData.rows.slice(1).map((row, index) => (
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
  );
}
