import { Button } from "@chakra-ui/button";
import { Box, Spacer, Stack, Text } from "@chakra-ui/layout";
import {
  Table,
  TableCaption,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/table";
import React from "react";

import { MyContain } from "../../../UI/Components/MyContain";

export const ConfiguracionImpresion = () => {
  return (
    <>
      <MyContain>
        <Text align="center">Configuración de impresión</Text>
        <Stack direction={["column","column", "row"]}>
          <Plantilla />
          <Spacer />
          <ModeloImpresion />
        </Stack>
      </MyContain>
    </>
  );
};

const Plantilla = () => {
  return (
    <>
      <Box>
        <Text>Plantilla</Text>
        <Button>Agregar</Button>
        <Table variant="simple" border="1px" borderColor="gray.200" size="sm">
          <Thead>
            <Tr>
              <Th>Modelo</Th>
              <Th>Accion</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>Hoja A4</Td>
              <Td>
                <Button m="1">Corregir</Button>
                <Button>Eliminar</Button>
              </Td>
            </Tr>
            <Tr>
              <Td>Ticket</Td>
              <Td>
                <Button m="1">Corregir</Button>
                <Button>Eliminar</Button>
              </Td>
            </Tr>
          </Tbody>
        </Table>
      </Box>
    </>
  );
};
const ModeloImpresion = () => {
  return (
    <>
      <Box >
        <Text>Impresión</Text>
        <Table variant="simple" size="sm">
          <Thead>
            <Tr>
              <Th>Tipo documento</Th>
              <Th>Modelo</Th>
              <Th>Acción</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>Boleta de venta</Td>
              <Td>A4 </Td>
              <Td>
                <Button size="xs">Corregir</Button>
                <Button size="xs">Imprimir Prueba</Button>
              </Td>
            </Tr>
          </Tbody>
        </Table>
      </Box>
    </>
  );
};
