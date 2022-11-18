import React from "react";
import { Box, Center, Image, Skeleton, Spacer, Text } from "@chakra-ui/react";
import { MyContain } from "../../UI/Components/MyContain";
import {
  Brush,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useQuery } from "react-query";
import { getHistoryReportSales } from "../../../Service/Reports";
import { ButtonRefetch } from "../../UI/Components/ButtonRefetch";

const dataweek = [
  {
    name: "Page A",
    uv: 4000,
    pv: 2400,
  },
  {
    name: "Page B",
    uv: 3000,
    pv: 1398,
  },
  {
    name: "Page C",
    uv: 2000,
    pv: 9800,
  },
  {
    name: "Page D",
    uv: 2780,
    pv: 3908,
  },
  {
    name: "Page E",
    uv: 1890,
    pv: 4800,
  },
  {
    name: "Page F",
    uv: 2390,
    pv: 3800,
  },
  {
    name: "Page G",
    uv: 3490,
    pv: 4300,
  },
];

export const ReportLine = () => {
  const { isLoading, data, isFetching, refetch } = useQuery(
    "report_history_sales",
    getHistoryReportSales,
    { refetchOnWindowFocus: false }
  );

  if (isLoading || isFetching) return <Skeleton height="100px" />;

  return (
    <>
      <Box h="100%">
        <Center
          bg={"#3e49f9"}
          paddingY={"3"}
          marginX={{base:"5%",sm:"20%"}}
          borderRadius="10px">
          <Text fontSize="xl" fontWeight="800" color="white">
            Ingresos a través del tiempo
          </Text>
        </Center>
        <Box >
          <ButtonRefetch refetch={refetch} />
        </Box>
        {data.length > 0 ? (
          <Center p={2}>
            <div style={{ width: "100%", height: 400 }}>
              {data.length != 0 ? (
                <ResponsiveContainer>
                  <LineChart
                    data={data}
                    syncId="anyId"
                    margin={{
                      top: 10,
                      right: 30,
                      left: 0,
                      bottom: 0,
                    }}
                  >
                    <YAxis />
                    <XAxis dataKey="FECHA" />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip key="FECHA" />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="CONTADO"
                      stroke="#FFBB28"
                      fill="#8884d8"
                      activeDot={{ r: 8 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="CREDITO"
                      stroke="#0088FE"
                      fill="#8884d8"
                    />
                    <Brush />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <Skeleton height="150px" mt={5} />
              )}
            </div>
          </Center>
        ) : (
          <>
            <MyContain>
              <Text
                align="center"
                //@ts-ignore
                size="xl"
              >
                No hay data de tickets
              </Text>
            </MyContain>
          </>
        )}
      </Box>
    </>
  );
};
