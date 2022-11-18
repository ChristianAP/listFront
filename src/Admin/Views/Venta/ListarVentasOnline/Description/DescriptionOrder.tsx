import { Box, Text, Spacer, Flex, Button, Badge } from "@chakra-ui/react";
import React, { ReactNode } from "react";
import { IoMail } from "react-icons/io5";

export const DescriptionOrder = ({ venta, sendEmail, loadingSend }: any) => {
  return (
    <Box>
      <BoxInfo>
        <Flex>
          <Box p="2">
            <Text>
              <strong> Pedido: </strong># {venta.PEDIDO}
            </Text>
          </Box>
        </Flex>
      </BoxInfo>
      <BoxInfo>
        <Flex>
          <Box p="2">
            <Text>
              <strong>Cliente: </strong> <ClienteName pro={venta} />
            </Text>
          </Box>
          <Spacer />
          <Box p="2">
            <strong> Email: </strong>
            {venta.EMAIL != "" &&
            venta.EMAIL != null &&
            venta.APROBACION != 0 &&
            venta.APROBACION != null ? (
              <Button
                onClick={() => sendEmail("Aceptar")}
                isLoading={loadingSend}
                background="white"
              >
                <Badge
                  ml={2}
                  cursor="pointer"
                  colorScheme="blue"
                  variant="outline"
                  fontSize="15px"
                >
                  <IoMail />
                </Badge>
              </Button>
            ) : (
              <Badge colorScheme="red" variant="outline">
                Sin Email
              </Badge>
            )}
          </Box>
        </Flex>
      </BoxInfo>
      <BoxInfo>
        <Flex>
          <Box p="2">
            <strong> Fecha de pedido: </strong> {venta.ORD_DATE_ORDER2}
          </Box>
          <Spacer />
          <Box p="2">
            <strong> Descuento: </strong> s/. {venta.DESCUENTO}
          </Box>
          <Spacer />
          <Box p="2">
            <strong> IGV: </strong> s/. {Number(venta.IGV).toFixed(2)}
          </Box>
          <Spacer />
          <Box p="2">
            <strong> Total: </strong> s/. {venta.TOTAL}
          </Box>
        </Flex>
      </BoxInfo>
    </Box>
  );
};

const BoxInfo = ({ children }: { children: ReactNode }) => {
  return (
    <Box
      bg="white"
      w="100%"
      pl={2}
      pr={4}
      mt={2}
      color="black"
      border="1px solid gray"
    >
      {children}
    </Box>
  );
};

const ClienteName = ({ pro }: { pro: any }) => {
  return (
    <Text>{pro.CLIENTE.trim().length > 0 ? pro.CLIENTE : pro.TRADENAME}</Text>
  );
};
