import {
  Box,
  Center,
  Flex,
  Select,
  SimpleGrid,
  Skeleton,
  Stat,
  StatLabel,
  StatNumber,
  Text,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react";
import { ReactNode } from "react";
import { FiServer } from "react-icons/fi";
import React from "react";
import { FaMoneyBillAlt } from "react-icons/fa";
import { GiReceiveMoney } from "react-icons/gi";
import { useQuery } from "react-query";
import { getReportSales } from "../../../Service/Reports";
import { ConsiEditModal } from "../Venta/Consiliacion/ConsiEditModal";
import { ButtonRefetch } from "../../UI/Components/ButtonRefetch";

interface StatsCardProps {
  title: any;
  stat: any;
  defaultstat: any;
  icon: ReactNode;
  loading: boolean;
  color: string;

}
export const StatsCard = (props: StatsCardProps) => {
  return (
    <Stat
      px={{ base: 2, md: 4 }}
      py={"5"}
      shadow={"xl"}

      bg={props.color}
      borderRadius="10px"
      color="white"

    >
      <Box width={"auto"}>
        <Flex justifyContent={"space-between"}>
          <Box pl={{ base: 2, md: 4 }}>
            <StatLabel fontWeight={"medium"} isTruncated>
              {props.title}
            </StatLabel>
            <StatNumber fontSize={"2xl"} fontWeight={"medium"}>
              {props.loading ? <Skeleton height="20px" /> : undefined}
              {!props.loading
                ? props.stat
                  ? "S/. " + props.stat
                  : "S/. " + props.defaultstat
                : undefined}
            </StatNumber>
          </Box>
          <Box
            my={"auto"}
            color={useColorModeValue("gray.800", "gray.200")}
            alignContent={"center"}
          >
            {props.icon}
          </Box>
        </Flex>
      </Box>
    </Stat>
  );
};

export const SelectTitle = (props: any) => {
  return (
    <Select
      variant="unstyled"
      onChange={(e: any) => props.changeSelect(e.target.value)}
      style={{ fontSize: "small" }}
    >
      <option style={{ background: "#2321fd" }} value="">Todo</option>
      {props.data.map((item: any, idx: any) => {
        return (
          <option style={{ background: "#2321fd" }} key={idx} value={item.TOTAL}>
            {item.PAY}
          </option>
        );
      })}
    </Select>
  );
};

export default function ReportStatsCards() {
  const { isLoading, data, isFetching, refetch } = useQuery(
    "report_sales",
    getReportSales,
    { refetchOnWindowFocus: false }
  );

  const [dataSelect, setDataSelect] = React.useState("");

  if (isLoading || isFetching) return <Skeleton height="100px" />;

  return (
    <Box>
      <Box>
        <Center
          bg={"#3e49f9"}
          textAlign={"center"}
          paddingY={"3"}
          marginX={"20%"}
          borderRadius="10px"
        >
          <Text fontSize="xl" fontWeight="800" color="white">
            Reportes Generales
          </Text>
        </Center>
        <ButtonRefetch refetch={refetch} />
      </Box>
      <Box
        maxW="7xl"
        w="auto"
        mx={"auto"}
        px={{ base: 2, sm: 12, md: 17 }}
        my={5}
      >
        <SimpleGrid
          columns={{ base: 1, sm: 1, md: 1, lg: 3 }}
          spacing={{ base: 5, lg: 8 }}
        >
          <StatsCard
            color="#0f1e49"
            title={"Total Vendido"}
            stat={data.contado ? (data.contado).toFixed(2) : 0}
            defaultstat={"0.00"}
            icon={<FaMoneyBillAlt size={"3em"} color="white" />}
            loading={isLoading || isFetching}
          />
          <StatsCard
            color="#0080ff"
            title={"Total a cobrar"}
            stat={data.totalcredito ? (data.totalcredito).toFixed(2) : 0}
            defaultstat={"0.00"}
            icon={<FiServer size={"3em"} color="white" />}
            loading={isLoading || isFetching}
          />
          <StatsCard
            color="#0080ff"
            title={
              <Flex gap={"1"}>
                <Text >Total por cobrar a</Text>
                <SelectTitle background="#00ffff" data={data.credito ? data.credito : 0} changeSelect={setDataSelect} />
              </Flex>
            }
            stat={dataSelect}
            defaultstat={data.totalcredito ? (data.totalcredito).toFixed(2) : 0}
            icon={<GiReceiveMoney size={"3em"} color="white" />}
            loading={isLoading || isFetching}
          />
        </SimpleGrid>
      </Box>
    </Box>
  );
}
