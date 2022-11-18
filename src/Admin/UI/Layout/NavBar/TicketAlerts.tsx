import {
  Box,
  Button,
  CloseButton,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  Text,
  Tooltip,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { BsFillEyeFill } from "react-icons/bs";
import { IoTicketOutline } from "react-icons/io5";
import { useQuery } from "react-query";
import { socketApi } from "../../../../Routes/Admin/Socket";
import { getTicketsOpenAlerts } from "../../../../Service/AlertsService";
import { ViewTicket } from "../../../Views/Soporte/ViewTicket";
import { AlertMessageAtom } from "./Mobilenav";

export const TicketAlert = (props: any) => {
  const toast = useToast();

  const {
    isLoading,
    isError,
    isFetching,
    data,
    error,
    refetch: ticket_refetch,
  } = useQuery("ticket-alert", getTicketsOpenAlerts, {
    refetchOnWindowFocus: false,
  });


  useEffect(() => {
    socketApi.on("newTicket", async (data) => {
      if (data.type != "") {
        ticket_refetch();
        var dataToast = {
          title: "Nuevo ticket creado",
          color: "orange",
          type: "t",
        };
        return toast({
          id: Number(data.id),
          position: "top-left",
          duration: 90000,
          render: ({ onClose }) => (
            <Box
              m={2}
              color="black"
              p={2}
              borderRadius={5}
              borderStart={"4px solid " + dataToast.color}
              bg="yellow.100"
            >
              <Flex>
                <Box>
                  <Text fontSize="sm" fontWeight="bold">
                    {dataToast.title + " #" + data.id}
                  </Text>
                </Box>
                <Spacer />
                <Box>
                  <CloseButton size="sm" onClick={onClose} />
                </Box>
              </Flex>
              <Text fontSize="md">{data.client}</Text>
              <Text fontSize="sm">
                {dataToast.type == "v"
                  ? "Total: s/." + data.total
                  : data.asunto}
              </Text>
              <Flex>
                <Box>
                  <Text fontSize="xs">
                    Fecha: {data.date}{" "}
                    {data.hour ? data.hour : " | " + data.hour}
                  </Text>
                </Box>
                <Spacer />
                <Box>
                  <ViewTicket
                    idTicket={data.id}
                    recent={true}
                    icon={<BsFillEyeFill />
                    }
                  />
                </Box>
              </Flex>
            </Box>
          ),
        });
      }
    });
  }, []);

  //   const changeAlertTemporary = async (idAlert: any) => {
  //     changeStatusAlert(idAlert);
  //     deteined_refetch;
  //   };

  return (
    <>
      <Flex alignItems={"center"} key={"flex_alert_ticket"} hidden={props.hidden}>
        <Menu key="menu">
          <Tooltip hasArrow label="Alertas de Tickets">
            <MenuButton
              key="menu_button_ticket"
              py={2}
              transition="all 0.3s"
              _focus={{ boxShadow: "none" }}
            >
              <Button
                bg="#3e49f9"
                isLoading={isLoading || isFetching}
                isDisabled={isLoading || isFetching}
              >
                {data ? (
                  <IoTicketOutline color="white" />
                ) : (
                  <IoTicketOutline color="green" />
                )}
              </Button>
            </MenuButton>
          </Tooltip>
          <MenuList
            key="menu_list_alert_ticket"
            bg={useColorModeValue("white", "gray.900")}
            borderColor={useColorModeValue("gray.200", "gray.700")}
          >
            <Box
              key="box_alert_ticket"
              className="alertsBox"
              overflowY="scroll"
              h="auto"
              w="300px"
              maxHeight="400px"
            >
              {!isLoading ? data.map((values: any, idx: any) => {
                return (
                  <MenuItem
                    key={"menu_item_alert_ticket_" + idx}
                    bg={values.TEA_COLOR}
                    mb={2}
                  >
                    <Box color="black" key={String(Number(idx) + 1)}>
                      <>
                        <Flex key={"flex_tea_title_" + idx}>
                          <Box key={"box_tea_title_" + idx}>
                            <Text
                              key={"tea_title_" + idx}
                              fontSize="sm"
                              fontWeight="bold"
                            >
                              {values.TEA_TITLE}
                            </Text>
                          </Box>
                        </Flex>
                        <Text fontSize="sm" key={"tea_client_" + idx}>
                          {values.TEA_CLIENT}
                        </Text>

                        {String(values.TEA_DESCRIPTION) == "null" || "" ? (
                          <></>
                        ) : (
                          <Text fontSize="md" key={"tea_description_" + idx}>
                            {values.TEA_DESCRIPTION}
                          </Text>
                        )}
                        <Text fontSize="md" key={"tea_total_" + idx}>
                          {values.TEA_TOTAL}
                        </Text>
                        <Flex>
                          <Box>
                            <Text fontSize="xs" key={"tea_date_" + idx}>
                              {values.TEA_DATE}
                            </Text>
                          </Box>
                        </Flex>
                      </>
                    </Box>
                  </MenuItem>
                );
              }) : isError ? (
                <AlertMessageAtom data={error} />
              ) : (
                <Box>Cargando...</Box>
              )}
            </Box>
          </MenuList>
        </Menu>
      </Flex>
    </>
  );
};
