import { Box, Button, Flex, Text, useColorModeValue } from "@chakra-ui/react";
import { BiStore } from "react-icons/bi";
import { Link } from "react-router-dom";
import React from "react";

export const DivAddCarrito = ({ type }: { type?: any }) => {
  const boxCarritoVacioBG = useColorModeValue("gray.200", "gray.500");
  const buttonarritoVacioBG = useColorModeValue("blue.600", "gray.300");

  const typeMessage =
    type === "carrito"
      ? "No hay productos añadidos al carrito"
      : "No hay productos comprados";

  return (
    <>
      <Flex justifyContent="center">
        <Box
          textAlign="center"
          borderRadius="lg"
          p="5"
          m="5"
          bg={boxCarritoVacioBG}>
          <Text fontWeight="bold" textTransform="uppercase">
            {typeMessage}
          </Text>
          <Text textTransform="uppercase">
            Ingrese a nuestra tienda para comprar
          </Text>
          <Link to="">
            <Button
              mt="5"
              leftIcon={<BiStore />}
              bg="blue.700"
              color="white"
              variant="solid"
              _hover={{ bg: buttonarritoVacioBG }}>
              Agregar a Carrito
            </Button>
          </Link>
        </Box>
      </Flex>{" "}
    </>
  );
};
