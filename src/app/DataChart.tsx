import { DataTable } from "./page";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";

import { Bar, BarChart, XAxis, YAxis, Legend, Tooltip } from "recharts";

const colors = [
  "#ee55ee",
  "#55ee55",
  "#eeee55",
  "#5555ee",
  "#55eeee",
  "#555555",
  "#555555",
  "#555555",
  "#555555",
  "#555555",
  "#555555",
  "#555555",
  "#555555",
];

interface SanitizedRow {
  product: string;
  fullfilmentCenter: string;
  quantity: number;
}

interface ChartRow {
  [key: string]: number | string;
  fullfilmentCenter: string;
}

interface DataChartProps {
  rawData: DataTable | null;
}

export const DataChart = (props: DataChartProps) => {
  const { rawData } = props;

  if (!rawData) {
    return <span>No data</span>;
  }

  const sanitizedData: SanitizedRow[] = rawData.rows.slice(1).map((row) => {
    return {
      product: row[0],
      fullfilmentCenter: row[2],
      quantity: parseInt(row[3]),
    };
  });

  const uniqueProducts = new Set<string>();
  sanitizedData.forEach((d) => uniqueProducts.add(d.product));
  const uniqueProductsArray = Array.from(uniqueProducts);

  const chartConfig = uniqueProductsArray.reduce((acc, p, index) => {
    acc[p] = {
      label: p,
      color: colors[index],
    };

    return acc;
  }, {} as ChartConfig);

  const chartData = sanitizedData.reduce((acc, item) => {
    const existingCenter = acc.find(
      (d) => d.fullfilmentCenter === item.fullfilmentCenter
    );
    if (existingCenter) {
      if (existingCenter[item.product]) {
        (existingCenter[item.product] as number) += item.quantity;
      } else {
        existingCenter[item.product] = item.quantity;
      }
    } else {
      acc.push({
        fullfilmentCenter: item.fullfilmentCenter,
        [item.product]: item.quantity,
      });
    }
    return acc;
  }, [] as ChartRow[]);
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <BarChart accessibilityLayer data={chartData}>
        {Array.from(uniqueProducts).map((p) => (
          <Bar key={p} dataKey={p} fill={`var(--color-${p})`} radius={4} />
        ))}
        <XAxis
          dataKey="fullfilmentCenter"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value}
        />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ChartContainer>
  );
};
