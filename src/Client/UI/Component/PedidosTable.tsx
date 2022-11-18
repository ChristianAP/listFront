import React from "react";
import {
  Box,
  Divider,
  Flex,
  Text,
  useColorModeValue,
  Wrap,
  WrapItem,
  Center,
  Badge,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { PedidoList } from "./PedidoModal";
import "./PedidosTable.css";

//@ts-ignore
import solicitado from "./assets/solicitado.gif";
import pedidoregistrado_final from "./assets/pedidoregistrado_final.png";
import { MessageVoucherRejected } from "./Voucher/MessageVoucherRejected";

export const PedidosComp = ({ orders, refetch }: any) => {
  const itemOrderBG = useColorModeValue("white", "gray.800");

  function convertDateFormat(string: string) {
    var info = string.split("-");
    return info[2] + "/" + info[1] + "/" + info[0];
  }
  return (
    <Box borderRadius="lg" paddingY="2" margin={{ base: "2", sm: "5" }}>
      <Flex direction="column-reverse">
        {
          //@ts-ignore
          orders.map((val, idx) => (
            <Box m="1" p={3} bg={itemOrderBG} borderRadius="md" key={idx}>
              <Box>
                <Wrap align="center">
                  <WrapItem w={"55%"}>
                    <Center>
                      <WhatIsTheStatus
                        estado={val.ORD_STATUS}
                        approval={val.ORD_APPROVAL}
                      />
                    </Center>
                  </WrapItem>
                  <WrapItem>
                    <Center>
                      <Box>
                        <Text fontSize="sm">
                          Pedido efectuado el:{" "}
                          {convertDateFormat(val.ORD_DATE_ORDER)}
                        </Text>
                        <Text fontSize="sm">N° de pedido: {val.ORD_ID}</Text>
                      </Box>
                    </Center>
                    <Divider
                      orientation="vertical"
                      mb="5"
                      mr="4"
                      ml="4"
                      h={"10"}
                      bg="red"
                    />
                  </WrapItem>

                  <WrapItem>
                    <Center>
                      <PedidoList
                        ORD_ID={val.ORD_ID}
                        ORD_VOUCHER={val.ORD_VOUCHER}
                      >
                        <Text
                          fontSize="sm"
                          fontWeight={"bold"}
                          color="gray"
                          className="detallePedido"
                        >
                          {"Detalles del pedido >"}
                        </Text>
                      </PedidoList>
                    </Center>
                  </WrapItem>
                </Wrap>
                <Divider opacity="1" mb="5" bg="yellow.300" />
                {val.ORD_APPROVAL === "2" ? (
                  <MessageVoucherRejected
                    voucher={val.ORD_VOUCHER}
                    id_order={val.ORD_ID}
                    refetch={refetch}
                  />
                ) : (
                  <Estado estado={val.ORD_STATUS} id={val.ORD_ID || 0} />
                )}
              </Box>
            </Box>
          ))
        }
      </Flex>
    </Box>
  );
};

const WhatIsTheStatus = ({ estado, approval }: any) => {
  let theStatusIs = "";
  let theColorStatusIs = "";
  switch (estado) {
    case "1":
      approval == 2
        ? ((theStatusIs = "Voucher Rechazado"), (theColorStatusIs = "red"))
        : ((theStatusIs = "Pedido Registrado"), (theColorStatusIs = "GrayText"));
      break;
    case "2":
      theColorStatusIs = "GrayText";
      theStatusIs = "Pedido Confirmado";
      break;
    case "3":
      theColorStatusIs = "GrayText";
      theStatusIs = "Pedido en Proceso";
      break;
    case "4":
      theColorStatusIs = "GrayText";
      theStatusIs = "Pedido en Proceso";
      break;
    default:
      theColorStatusIs = "yellow";
      theStatusIs = "Presentar Comprobante de pago";
      break;
  }

  if (Number(estado) > 0) {
    return (
      <>
        <Badge variant="outline" colorScheme={theColorStatusIs}>
          <Text
            textColor={theColorStatusIs}
            textTransform="revert"
            fontWeight={"bold"}
            fontSize="lg"
          >
            {theStatusIs}
          </Text>{" "}
        </Badge>
      </>
    );
  } else {
    return (
      <>
        <Badge variant="outline" colorScheme='red'>
          <Text
            textColor='red'
            textTransform="revert"
            fontWeight={"bold"}
            fontSize="lg"
          >
            Porfavor Presentar Comprobante de pago
          </Text>
        </Badge>
      </>
    );
  }
};

interface IEstado {
  estado: string;
  id: number;
}

//TO-DO Linea que divide los estados
const Estado = ({ estado, id }: IEstado) => {
  if (Number(estado) > 0) {
    return (
      <>
        <Flex
          //   bg={"yellow.200"}
          my="5"
          py="2"
          width="100%"
          justifyContent="space-around"
          direction="row"
        >
          {estado == "1" ? (
            <>
              <DivEstatus
                estado={estado}
                textoEstado={"Pedido Registrado"}
                imagen={solicitado}
                status="1"
                classname={"aqui"}
              />
            </>
          ) : (
            <>
              <DivEstatus
                estado={estado}
                textoEstado={"Pedido Registrado"}
                imagen={pedidoregistrado_final}
                status="0"
                classname={estado > "1" ? "paso" : "falta"}
              />
            </>
          )}
          {estado == "2" ? (
            <>
              <DivEstatus
                estado={estado}
                textoEstado={"Pedido Confirmado"}
                imagen="https://img.alicdn.com/tfs/TB1oP4HzSf2gK0jSZFPXXXsopXa-214-214.gif"
                status="1"
                classname={"aqui"}
              />
            </>
          ) : (
            <>
              <DivEstatus
                estado={estado}
                textoEstado={"Pedido Confirmado"}
                imagen="https://img.alicdn.com/tfs/TB1Y_RHzQL0gK0jSZFAXXcA9pXa-214-214.png"
                status="0"
                classname={estado > "2" ? "paso" : "falta"}
              />
            </>
          )}
          {estado == "3" ? (
            <>
              <DivEstatus
                estado={estado}
                textoEstado={"Pedido en Proceso"}
                imagen="https://img.alicdn.com/tfs/TB1290KzHj1gK0jSZFOXXc7GpXa-214-214.png"
                status="1"
                classname={"aqui"}
              />
            </>
          ) : (
            <>
              <DivEstatus
                estado={estado}
                textoEstado={"Pedido en Proceso"}
                imagen="https://img.alicdn.com/tfs/TB1290KzHj1gK0jSZFOXXc7GpXa-214-214.png"
                status="0"
                classname={estado > "3" ? "paso" : "falta"}
              />
            </>
          )}
          {estado == "4" ? (
            <DivEstatus
              estado={estado}
              textoEstado={"Pedido Entregado"}
              imagen="https://img.alicdn.com/tfs/TB1NU8FzQL0gK0jSZFtXXXQCXXa-214-214.gif"
              status="1"
              classname={"aqui"}
            />
          ) : (
            <>
              <DivEstatus
                estado={estado}
                textoEstado={"Pedido Entregado"}
                imagen="https://img.alicdn.com/tfs/TB1APVHzSf2gK0jSZFPXXXsopXa-214-214.png"
                status="0"
                classname={estado > "4" ? "paso" : "falta"}
              />
            </>
          )}
        </Flex>
      </>
    );
  } else {
    return (
      <>
        <Flex
          bg={"yellow.200"}
          my="5"
          py="2"
          width="100%"
          justifyContent="space-around"
          direction="row"
        >
          <Link to={"/pedidos/detalle/" + id}>
            <Box>
              <Text fontSize={{ base: "md", md: "xl" }}>
                Porfavor Presentar Comprobante de pago
              </Text>
            </Box>
          </Link>
        </Flex>
      </>
    );
  }
};

export const DivEstatus = ({
  status,
  textoEstado,
  imagen,
  estado,
  classname,
}: any) => {
  let colorBox;
  let colorText;
  let opacityComponent;

  colorBox = status == 1 ? "rgba(44,82,130,1)" : "white";
  colorText = status == 1 ? "white" : "black";
  opacityComponent = status == 1 ? "1" : "0.5";

  return (
    <>
      <Box textAlign="center" flex="1">
        <Box background={colorBox}>
          <Text
            fontWeight="bold"
            color={colorText}
            opacity={opacityComponent}
            fontSize={{ base: "sm", md: "md" }}
          >
            {textoEstado}
          </Text>
        </Box>
        <Box>
          <Center>
            <img
              className={classname}
              src={imagen}
              alt={textoEstado}
              width={"150"}
              sizes={"150"}
              style={{ opacity: opacityComponent }}
            />
          </Center>
        </Box>
      </Box>
    </>
  );
};
