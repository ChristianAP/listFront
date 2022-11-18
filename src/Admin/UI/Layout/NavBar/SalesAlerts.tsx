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
import { VscBell, VscBellDot } from "react-icons/vsc";
import { useQuery } from "react-query";
import { socketApi } from "../../../../Routes/Admin/Socket";
import {
  changeStatusAlert,
  getAllAlerts,
} from "../../../../Service/AlertsService";
import { AlertMessageAtom } from "./Mobilenav";

export const SalesAlert = (props: any) => {
  const toast = useToast();

  const {
    isLoading,
    isError,
    isFetching,
    data,
    error,
    refetch: sales_refetch,
  } = useQuery("sales-alert", getAllAlerts, { refetchOnWindowFocus: false });

  const changeAlertTemporary = async (idAlert: any) => {
    changeStatusAlert(idAlert);
    sales_refetch;
  };

  useEffect(() => {
    socketApi.on("newSaleOnline", async (data) => {
      var dataToast = {
        title: "Nueva venta realizada",
        color: "#edf2f7",
        type: "v",
      };
      if (data.type != "") {
        sales_refetch();
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
              boxShadow="lg"
              bg={dataToast.color}
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
                    {data.hour || data.hour != ""
                      ? data.hour
                      : " | " + data.hour}
                  </Text>
                </Box>
                <Spacer />
              </Flex>
            </Box>
          ),
        });
      }
    });
  }, []);

  return (
    <>
      <Flex alignItems={"center"} hidden={props.hidden}>
        <Menu>
          <Tooltip hasArrow label="Alertas Recientes">
            <MenuButton
              key="menu_button"
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
                  <VscBellDot color="white" key={"VscBellDot"} />
                ) : (
                  <VscBell color="green" key={"VscBell"} />
                )}
              </Button>
            </MenuButton>
          </Tooltip>
          <MenuList
            key="menu_list"
            bg={useColorModeValue("white", "gray.900")}
            borderColor={useColorModeValue("gray.200", "gray.700")}
          >
            {/* {data.length != 0 ? ( */}
            <Box
              className="alertsBox"
              overflowY="scroll"
              h="auto"
              key="alertsBox"
              maxHeight="400px"
            >
              {isLoading === false ? (
                data.length > 0 && data.map((values: any, idx: any) => {
                  return (
                    <MenuItem
                      key={"menu_item_alerts_" + idx}
                      bg={values.TEA_COLOR}
                      mb={2}
                      onClick={() => changeAlertTemporary(values.TEA_ID)}
                    >
                      <Box
                        color="black"
                        w="270px"
                        key={String(Number(idx) + 1)}
                      >
                        <Box>
                          <Flex key={String(idx)}>
                            <Box>
                              <Text
                                fontSize="sm"
                                fontWeight="bold"
                                key={"title_" + idx}
                              >
                                {values.TEA_TITLE + " #" + values.TEA_INSERT_ID}
                              </Text>
                            </Box>
                          </Flex>
                          <Flex>
                            <Box>
                              <Text fontSize="sm" key={"client_" + idx}>
                                {values.TEA_CLIENT}
                              </Text>
                              {String(values.TEA_DESCRIPTION) == "null" ||
                                "" ? undefined : (
                                <Text fontSize="md" key={"description_" + idx}>
                                  {String(values.TEA_DESCRIPTION).substring(
                                    0,
                                    30
                                  ) + "..."}
                                </Text>
                              )}
                              <Text fontSize="md" key={"total_" + idx}>
                                {values.TEA_TOTAL}
                              </Text>
                              <Flex>
                                <Box>
                                  <Text fontSize="xs" key={"date_" + idx}>
                                    {"Fecha: " + values.TEA_DATE + " "}
                                    {values.TEA_TYPE == "AI"
                                      ? values.TEA_HOUR
                                      : ""}
                                  </Text>
                                </Box>
                              </Flex>
                            </Box>
                            {/* <Box>
                                  {values.TEA_TOTAL ===null ? (
                                  <ViewTicket
                                    idTicket={Number(values.TEA_INSERT_ID)}
                                    icon={
                                      <>
                                        <BsFillEyeFill />
                                      </>
                                    }
                                  />):("")}
                                </Box> */}
                          </Flex>
                        </Box>
                      </Box>
                    </MenuItem>
                  );
                })
              ) : isError ? (
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
