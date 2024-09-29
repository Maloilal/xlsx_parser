import { FileData } from "@/lib/models";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";

import { Bar, BarChart, XAxis, YAxis, Legend } from "recharts";

const colors = [
  "#4E79A7 ",
  "#F28E2B",
  "#E15759 ",
  "#76B7B2 ",
  "#59A14F ",
  "#EDC949",
  "#AF7AA1 ",
  "#FF9DA7 ",
  "#9C755F ",
  "#BAB0AC ",
];

interface SanitizedRow {
  product: string;
  fullfilmentCenter: string;
  quantity: number;
  value: number;
}

interface ChartRow {
  [key: string]: number | string;
  fullfilmentCenter: string;
}

interface DataChartProps {
  rawData: FileData | null;
}

export const DataChart = (props: DataChartProps) => {
  const { rawData } = props;

  console.log("rawData", rawData);

  if (!rawData) {
    return;
  }

  const sanitizedData: SanitizedRow[] = rawData.rows.slice(1).map((row) => {
    return {
      product: row[0],
      fullfilmentCenter: row[2],
      quantity: parseInt(row[3]),
      value: parseInt(row[4]),
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
  const totalQty = sanitizedData.reduce(
    (acc, row) => acc + (row.quantity || 0),
    0
  );
  const totalValue = sanitizedData.reduce(
    (acc, row) => acc + (row.value || 0),
    0
  );

  const averagePrice = totalQty > 0 ? totalValue / totalQty : 0;
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <ChartContainer
        config={chartConfig}
        className="min-h-[200px] min-w-[1500px] max-h-[700px]"
      >
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
          <ChartTooltip cursor={false} />
          <Legend />
        </BarChart>
      </ChartContainer>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Badge style={{ height: "50px", marginLeft: "20px" }}>
          Общий объём запасов: {totalValue}
        </Badge>
        <Badge style={{ height: "50px", marginLeft: "20px" }}>
          Средняя цена товара: {averagePrice.toFixed(2)}
        </Badge>
        <Badge style={{ height: "50px", marginLeft: "20px" }}>
          Общее количество единиц товаров на складе:{totalQty}
        </Badge>
      </div>
    </div>
  );
};
