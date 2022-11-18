import { Box, Center, SkeletonCircle, Text } from "@chakra-ui/react";
import React from "react";
import { useQuery } from "react-query";
import { PieChart, Pie, Tooltip, Cell, Legend } from "recharts";
import { getReportDocumentsEmitsVsPay } from "../../../Service/Reports";
import { ButtonRefetch } from "../../UI/Components/ButtonRefetch";

const COLORS = ["#0088FE", "#FF8042"];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
}: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function ReportPie() {
  const { isLoading, data, isFetching, refetch } = useQuery(
    "report_pie_documents",
    getReportDocumentsEmitsVsPay,
    { refetchOnWindowFocus: false }
  );

  if (isLoading || isFetching) return <SkeletonCircle width="100px" />;
  return (
    <Box width="full" m={1}>
      <Box w="auto">
        <Center
          bg={"#3e49f9"}
          padding={"3"}
          marginX={"20%"}
          borderRadius="10px">
          <Text fontSize="xl" fontWeight="800" color="white">
            Documentos emitidos vs pagados
          </Text>
        </Center>
        <Box>
          <ButtonRefetch refetch={refetch} />{" "}
        </Box>
      </Box>
      <Box>
        <Center>
          <PieChart width={400} height={400}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry: any, index: any) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </Center>
      </Box>
    </Box>
  );
}
