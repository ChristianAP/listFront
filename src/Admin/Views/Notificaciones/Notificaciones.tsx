import {
  Box,
  Button,
  Center,
  Flex,
  Icon,
  Stack,
  Text,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { BsShop } from "react-icons/bs";
import { useQuery, useQueryClient } from "react-query";
import {
  getAlertsHistory,
} from "../../../Service/AlertsService";
import { TransactionRow, WarehuseRow } from "./TransaccionRow";
import "./notificaciones.css";
import { GrRefresh } from "react-icons/gr";
import { FaWarehouse } from "react-icons/fa";
import { GiTicket } from "react-icons/gi";

export const NotificacionesView = () => {
  useEffect(() => {
    //@ts-ignore
    document.getElementById('title_view').textContent = 'Notificaciones';
  }, []);
  const textColor = useColorModeValue("gray.700", "white");

  return (
    <Box bg={"white"} height={"full"}>
      <Flex padding={"10px"} direction={{ base: 'column', sm: "column", md: "column", lg: "column", xl: "row" }}>
        <SalesAlert />
        <AlmacenAlert />
        <TicketsAlert />
      </Flex>
    </Box>
  );
};

export const TicketsAlert = () => {
  const textColor = useColorModeValue("gray.700", "white");
  const queryClient = useQueryClient();
  const ticketAlerts: any = queryClient.getQueryData("ticket-alert");

  return (
    <Box my="24px" ms={{ lg: "24px" }} >
      <Center>
        <Flex>
          <Text
            textAlign={"center"}
            color={textColor}
            fontSize={{ sm: "lg", md: "xl", lg: "lg" }}
            fontWeight="bold"
          >
            Historico de Alertas de Tickets
          </Text>
          <Tooltip label='Actualizar'>
            <Button size="xs" onClick={() => { }}>
              <Icon as={GrRefresh} />
            </Button>
          </Tooltip>
        </Flex>
      </Center>
      <Box
        overflowY={"scroll"}
        height={"xl"}
        padding={"10px"}
        className="box_ticket_alert"
      >
        {console.log(ticketAlerts)}
        <Flex direction="column" w="100%">
          {ticketAlerts ? (
            ticketAlerts.map((row: any, idx: any) => (
              <TransactionRow
                name={row.TEA_CLIENT}
                logo={GiTicket}
                date={row.TEA_DATE}
                price={row.TEA_TITLE}
                title={row.TEA_DESCRIPTION}
                color={row.TEA_COLOR}
                type={row.TEA_TYPE}
                key={idx}
              />
            ))
          ) : (
            <></>
          )}
        </Flex>
      </Box>
    </Box>
  );
};

export const AlmacenAlert = () => {
  const textColor = useColorModeValue("gray.700", "white");
  const queryClient = useQueryClient();
  const warehouse: any = queryClient.getQueryData("warehouse-alert");

  if (warehouse < 0) return <></>;

  return (
    <Box my="24px" ms={{ lg: "24px" }}>
      <Center>
        <Text
          textAlign={"center"}
          color={textColor}
          fontSize={{ sm: "lg", md: "xl", lg: "lg" }}
          fontWeight="bold"
        >
          Historico de Alertas de Almacén
        </Text>
      </Center>
      <Box
        overflowY={"scroll"}
        height={"xl"}
        padding={"10px"}
        className="box_almacen_alert"
      >
        {warehouse && !warehouse.message ? (
          warehouse.map((row: any, idx: any) => (
            <WarehuseRow
              name={row.MESSAGE}
              logo={FaWarehouse}
              color={row.COLOR}
              type={row.TYPEA}
              key={idx}
            />
          ))
        ) : (
          <></>
        )}
      </Box>
    </Box>
  );
};

export const SalesAlert = () => {
  const textColor = useColorModeValue("gray.700", "white");

  const {
    isLoading: sales_loading,
    isError: sales_iserror,
    isFetching: sales_fetching,
    data: sales_data,
    error: sales_error,
    refetch: sales_refetch,
  } = useQuery("sales-alert-history", getAlertsHistory, {
    refetchOnWindowFocus: false,
  });

  if (sales_loading || sales_fetching) return <></>;

  return (
    <Box my="24px" ms={{ lg: "24px" }} >
      <Center>
        <Flex>
          <Text
            textAlign={"center"}
            color={textColor}
            fontSize={{ sm: "lg", md: "xl", lg: "lg" }}
            fontWeight="bold"
          >
            Histórico de Alertas de Ventas
          </Text>
          <Tooltip label='Actualizar'>

            <Button size="xs" onClick={() => sales_refetch()}>
              <Icon as={GrRefresh} />
            </Button>
          </Tooltip>
        </Flex>
      </Center>
      <Box
        overflowY={"scroll"}
        height={"xl"}
        padding={"10px"}
        className="box_sales_alert"
      >
        <Flex direction="column" w="100%">
          {sales_data.map((item: any, idx: any) => (
            <TransactionRow
              name={item.TEA_CLIENT}
              logo={BsShop}
              date={item.TEA_DATE + " " + item.TEA_HOUR}
              price={item.TEA_TOTAL}
              color={item.TEA_COLOR}
              type={item.TEA_TYPE}
              title={item.TEA_TITLE}
              key={idx}
            />
          ))}
        </Flex>
      </Box>
    </Box>
  );
};
