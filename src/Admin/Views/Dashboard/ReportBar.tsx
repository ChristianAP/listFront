import { Box, Center, Flex, Skeleton, Text } from "@chakra-ui/react";
import React from "react";
import { useQuery } from "react-query";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  Brush,
  Tooltip,
} from "recharts";
import { getReportDocumentsEmits } from "../../../Service/Reports";
import { ButtonRefetch } from "../../UI/Components/ButtonRefetch";

export const ReportBar = () => {
  const { isLoading, isError, data, error, isFetching, refetch } = useQuery(
    "report_documents",
    getReportDocumentsEmits,
    { refetchOnWindowFocus: false }
  );

  if (isLoading || isFetching) return <SkeletonReportBar />;

  return (
    <Box width="auto" m={1}>
      <Box>
        <Center
          bg={"#3e49f9"}
          paddingY={"3"}
          marginX={"20%"}
          borderRadius="10px">
          <Text fontSize="xl" fontWeight="800" color="white">
            Documentos a través del tiempo
          </Text>
        </Center>
        <ButtonRefetch refetch={refetch} />
      </Box>
      <Box >
        <Center>
          <BarChart
            width={680}
            height={400}
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <Tooltip />
            <Brush dataKey="DCT_NAME" height={30} stroke="#8884d8" />
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="DCT_NAME" />
            <YAxis />
            <Legend />
            <Bar dataKey="VAL" barSize={50} fill="#8884d8" />
          </BarChart>
        </Center>
      </Box>
    </Box>
  );
};

export const SkeletonReportBar = () => {
  return (
    <Box padding="6" boxShadow="lg" bg="white">
      <Flex style={{ alignItems: "self-end" }}>
        <Skeleton
          startColor="pink.500"
          endColor="orange.500"
          height="250px"
          width="40px"
          margin={2}
        />
        <Skeleton
          startColor="pink.500"
          endColor="orange.500"
          height="190px"
          width="40px"
          margin={2}
        />
        <Skeleton
          startColor="pink.500"
          endColor="orange.500"
          height="120px"
          width="40px"
          margin={2}
        />
        <Skeleton
          startColor="pink.500"
          endColor="orange.500"
          height="50px"
          width="40px"
          margin={2}
        />
        <Skeleton
          startColor="pink.500"
          endColor="orange.500"
          height="200px"
          width="40px"
          margin={2}
        />
        <Skeleton
          startColor="pink.500"
          endColor="orange.500"
          height="180px"
          width="40px"
          margin={2}
        />
      </Flex>
    </Box>
  );
};
