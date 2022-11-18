import {
  Box,
  Button,
  Center,
  Flex,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import { GiChest, GiOpenChest } from "react-icons/gi";
import { useQuery } from "react-query";
import { getWarehouse } from "../../../../Service/AlertsService";
import { AlertMessageAtom } from "./Mobilenav";
import InfiniteScroll from "react-infinite-scroll-component";
import { Link } from "react-router-dom";
import { BsEye } from "react-icons/bs";

export const StockAlert = (props: any) => {
  const {
    isLoading,
    isError,
    isFetching,
    data,
    error,
    refetch: warehouse_refetch,
  } = useQuery("warehouse-alert", getWarehouse, {
    refetchOnWindowFocus: false,
  });

  const [state, setState] = React.useState({
    items: Array.from({ length: 20 }),
  });

  const fetchMoreData = () => {
    setTimeout(() => {
      setState({
        items: state.items.concat(Array.from({ length: 20 })),
      });
    }, 1500);
  };

  return (
    <>
      <Flex alignItems={"center"} hidden={props.hidden}>
        <Menu>
          <Tooltip hasArrow label="Alertas de Stock">
            <MenuButton
              key="menu_button_products"
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
                  <GiOpenChest color="white" key="GiOpenChest" />
                ) : (
                  <GiChest color="green" key="GiChest" />
                )}
              </Button>
            </MenuButton>
          </Tooltip>
          <MenuList
            key="menu_list_products"
            bg={useColorModeValue("white", "gray.900")}
            borderColor={useColorModeValue("gray.200", "gray.700")}
          >
            <Box
              key="box_products"
              className="alertsBox"
              overflowY="scroll"
              h="auto"
              w="300px"
              maxHeight="400px"
            >
              {!isLoading ? (
                // <InfiniteScroll
                //   dataLength={20}
                //   next={fetchMoreData}
                //   hasMore={true}
                //   loader={<Center>Loading...</Center>}
                // >
                <>
                  {data.length > 0 && data.map((values: any, idx: any) => {
                    return (
                      <MenuItem
                        key={String(idx)}
                        bg={values.COLOR}
                        mb={2}
                      //   onClick={() => changeAlertTemporary(values.TEA_ID)}
                      >
                        <Box color="black" key={String(Number(idx) + 1)}>
                          <Flex>
                            <Box>
                              <Text fontSize="sm" fontWeight="medium">
                                {values.MESSAGE}
                              </Text>
                            </Box>
                          </Flex>
                        </Box>
                      </MenuItem>
                    );
                  })}
                  <MenuItem
                    as={Link}
                    to="/admin/home/notificaciones"
                    key="notificaciones"
                    style={{ placeContent: "center" }}
                  >
                    Ver mas <Icon as={BsEye} margin={1} />
                  </MenuItem>
                  {/* </InfiniteScroll> */}
                </>
              ) : // data.map((values: any, idx: any) => {
                //   return (
                //     <MenuItem
                //       key={String(idx)}
                //       bg={values.COLOR}
                //       mb={2}
                //       //   onClick={() => changeAlertTemporary(values.TEA_ID)}
                //     >
                //       <Box color="black" key={String(Number(idx) + 1)}>
                //         <Flex>
                //           <Box>
                //             <Text fontSize="sm" fontWeight="medium">
                //               {values.MESSAGE}
                //             </Text>
                //           </Box>
                //         </Flex>
                //       </Box>
                //     </MenuItem>
                //   );
                // })
                isError ? (
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
