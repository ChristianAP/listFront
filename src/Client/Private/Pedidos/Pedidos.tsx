import {
  Box,
  Flex,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useQuery } from "react-query";
import { useSetRecoilState } from "recoil";
import { HeaderClient, NavClient } from "../../../Data/Atoms/Client";
import { getPedidosByIdClient } from "../../../Service/TiendaOnlineService";
import { DivAddCarrito } from "../../Public/Carrito/DivAddCarrito";
import { IsLoading } from "../../UI/Component/isLoading";
import { PedidosComp } from "../../UI/Component/PedidosTable";
import "./Pedidos.css";
export const Pedidos = () => {
  const setNavClient = useSetRecoilState(NavClient);
  const setHeadClient = useSetRecoilState(HeaderClient);
  useEffect(() => {
    setHeadClient(true);
    setNavClient(true);
  }, []);

  return (
    <Flex justifyContent="space-around" padding="0">
      <PedidosContent />
    </Flex>
  );
};

export const PedidosContent = () => {
  const boxColorBG = useColorModeValue("white", "gray.700");

  const { data, isLoading, refetch } = useQuery(
    "orders",
    async () => await getPedidosByIdClient()
  );
  var result;
  if (data) {
    result = data.result;
  }

  return (
    <>
      <Box id="data" m={{ base: "1", md: "5" }} width={"5xl"}>
        <Box margin={{ base: "2", sm: "5" }}>
          <Box
            paddingLeft={{ base: "2", sm: "5" }}
            borderRadius="lg"
            paddingY="2"
            margin={{ base: "2", sm: "5" }}
            background="white">
            <Text fontSize="3xl">Pedidos</Text>
          </Box>

          {isLoading ? (
            <IsLoading />
          ) : data.message ? (
            <Box
              bg={boxColorBG}
              paddingLeft={{ base: "2", sm: "5" }}
              borderRadius="lg"
              paddingY="2"
              margin={{ base: "2", sm: "5" }}>
              <DivAddCarrito />
            </Box>
          ) : (
            <PedidosComp orders={data} refetch={refetch} />
          )}
        </Box>
      </Box>
    </>
  );
};
