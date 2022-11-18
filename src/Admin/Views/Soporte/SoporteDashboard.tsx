import React, { useState, useCallback, useEffect } from "react";
import { ReportCicular, ReportWeek } from "../../../Model/Tickets";
import {
  Center,
  Flex,
  Box,
  Text,
  SkeletonCircle,
  Skeleton,
  Spacer
} from "@chakra-ui/react";
import {
  LineChart,
  Line,
  Cell,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Brush,
  PieChart,
  Pie,
  ResponsiveContainer,
  Bar,
  ComposedChart,
} from "recharts";
import {
  GetReportTicketCircular,
  GetReportTicketUser,
  GetReportTicketWeek,
} from "../../../Service/Tickets";
import { MyContain } from "../../UI/Components/MyContain";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
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
      x={ x }
      y={ y }
      fill="white"
      textAnchor={ x > cx ? "start" : "end" }
      dominantBaseline="central">
      { `${(percent * 100).toFixed(0)}%` }
    </text>
  );
};

export const SoporteDashboard = () => {
  const [dataweek, setChartWeek] = useState<ReportWeek[]>([]);
  const [datachart, setChart] = useState<ReportCicular[]>([]);
  const [dataVertical, setVertical] = useState<ReportCicular[]>([]);

  async function getDataCircular() {
    await setChart(await GetReportTicketCircular());
    await setChartWeek(await GetReportTicketWeek());
    await setVertical(await GetReportTicketUser());
  }

  console.log(dataweek);

  useEffect(() => {
    //@ts-ignore
    document.getElementById('title_view').textContent = 'Informe de Soporte';
    getDataCircular();
  }, []);

  return (
    <>
      <MyContain>

        <Box h="100%">
          <Center border="1px solid black" borderRadius="5px">
            <Text fontSize="xl" fontWeight="800" color="#011627">
              Tickets de soporte a través del tiempo
            </Text>
          </Center>
          { dataweek.length > 0 ? (
            <Center>
              <div style={ { width: "100%", height: 400 } }>
                { dataweek.length != 0 ? (
                  <ResponsiveContainer>
                    <LineChart
                      data={ dataweek }
                      syncId="anyId"
                      margin={ {
                        top: 10,
                        right: 30,
                        left: 0,
                        bottom: 0,
                      } }>
                      <YAxis />
                      <XAxis dataKey="NOMBRE" />
                      <CartesianGrid strokeDasharray="3 3" />
                      <Tooltip key="NOMBRE" />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="NUEVO"
                        stroke="#FFBB28"
                        fill="#8884d8"
                      />
                      <Line
                        type="monotone"
                        dataKey="ABIERTO"
                        stroke="#0088FE"
                        fill="#8884d8"
                      />
                      <Line
                        type="monotone"
                        dataKey="CERRADO"
                        stroke="#00C49F"
                        fill="#8884d8"
                      />
                      <Line
                        type="monotone"
                        dataKey="PENDIENTE"
                        stroke="#FF8042"
                        fill="#8884d8"
                      />
                      <Brush />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <Skeleton height="150px" mt={ 5 } />
                ) }
              </div>
            </Center>
          ) : (
            <>
              <MyContain>
                <Text
                  align="center"
                  //@ts-ignore
                  size="xl">
                  No hay data de tickets
                </Text>
              </MyContain>
            </>
          ) }
        </Box>
      </MyContain>

      <br />
      <br />
      <Flex>
        <MyContain>

          <Box flex="1" w={ 550 }>
            <Center
              border="1px solid black"
              borderRadius="5px"
              marginLeft={ 10 }
              marginRight={ 10 }>
              <Text fontSize="xl" fontWeight="800" color="#011627">
                Acumulado de Tickets
              </Text>
            </Center>
            <Center color="white">
              { datachart.length > 0 ? (
                <PieChart width={ 400 } height={ 400 }>
                  <Pie
                    data={ datachart }
                    cx={ 200 }
                    cy={ 200 }
                    labelLine={ false }
                    label={ renderCustomizedLabel }
                    outerRadius={ 120 }
                    fill="#8884d8"
                    dataKey="value">
                    { datachart.map((entry, index) => (
                      <Cell
                        key={ `cell-${index}` }
                        fill={ COLORS[index % COLORS.length] }
                      />
                    )) }
                  </Pie>
                  <Tooltip />
                </PieChart>
              ) : (
                <>
                  <SkeletonCircle size="80" marginTop={ 20 } />
                </>
              ) }
            </Center>
          </Box>
        </MyContain>
        <Spacer />

        <MyContain>

          <Box flex="1" height="400px" w={ 550 }>
            <Center
              border="1px solid black"
              borderRadius="5px"
              marginLeft={ 10 }
              marginRight={ 10 }>
              <Text fontSize="xl" fontWeight="800" color="#011627">
                Tickets por usuario
              </Text>
            </Center>
            <Center>
              { dataVertical.length != 0 ? (
                <ComposedChart
                  layout="vertical"
                  width={ 500 }
                  height={ 400 }
                  data={ dataVertical }
                  margin={ {
                    top: 20,
                    right: 20,
                    bottom: 20,
                    left: 40,
                  } }>
                  <CartesianGrid stroke="#f5f5f5" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" />
                  <Tooltip />
                  <Bar dataKey="value" barSize={ 20 } fill="#413ea0" />
                </ComposedChart>
              ) : (
                <>
                  <SkeletonCircle size="80" marginTop={ 20 } />
                </>
              ) }
            </Center>
          </Box>
        </MyContain>

      </Flex>
    </>
  );
};
