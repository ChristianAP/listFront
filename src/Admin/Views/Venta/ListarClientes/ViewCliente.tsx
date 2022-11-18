import {
  Box,
  Button,
  Divider,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Select,
  Skeleton,
  Spacer,
  Stack,
  Text,
  Tooltip,
  useBoolean,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { BiEdit } from "react-icons/bi";
import { BsFillEyeFill } from "react-icons/bs";
import {
  Clasificacion,
  Cliente,
  Grupo,
  OneClient,
  PersonType,
} from "../../../../Model/Clientes";
import { ListOneCliente } from "../../../../Service/ClienteService";
import { EditCliente } from "./EditCliente";

export const ViewCliente = ({
  title,
  icon,
  dateFlag,
  idCliente,
  clasificacion,
  grupo,
  personType,
  reload,
}: {
  title?: any;
  icon?: React.ReactElement;
  datesCliente?: Cliente[];
  dateFlag?: boolean;
  idCliente?: number;
  clasificacion?: Clasificacion[];
  grupo?: any[];
  personType?: PersonType[];
  reload?: any;
}) => {
  // REACTORES
  const [size, setSize] = React.useState("xl");
  let { isOpen, onOpen, onClose } = useDisclosure();
  const [flag, setFlag] = useBoolean(false);
  const [viewcliente, setViewCliente] = useState<OneClient[]>([]);

  async function getOneClient(id: number | undefined) {
    if (id !== undefined) {
      await setViewCliente(await ListOneCliente(id));
    }
  }

  return (
    <>
      <Tooltip hasArrow label='Ver y Editar'>
        <Button
          onClick={onOpen}
          onClickCapture={() => getOneClient(idCliente)}
          bg={"#0f1e49"}
          color={"white"}
          _hover={{}}
        >
          {icon}
          {title}
        </Button>
      </Tooltip>
      <Drawer onClose={onClose} isOpen={isOpen} size={size}>
        <DrawerOverlay />
        <DrawerContent>
          {viewcliente.length != 0 ? (
            <>
              <DrawerHeader>
                <Flex>
                  <Box p="2">
                    <Heading size="md">
                      CLIENTE:{" "}
                      {viewcliente[0].PER_NAME +
                        " " +
                        viewcliente[0].PER_LASTNAME}
                    </Heading>
                  </Box>
                  <Spacer />
                  <Box>
                    <Button onClick={setFlag.toggle}>
                      <Flex>
                        {flag == true ? (
                          <>
                            <BiEdit />
                            <Text fontSize="sm"> Editar</Text>
                          </>
                        ) : (
                          <>
                            <BsFillEyeFill />
                            <Text fontSize="sm"> Solo Ver</Text>
                          </>
                        )}
                      </Flex>
                    </Button>
                  </Box>
                </Flex>
              </DrawerHeader>
              {flag == true ? (
                <DrawerBody>
                  <HStack spacing="20px">
                    <FormControl>
                      <FormLabel>TIPO DE CLIENTE</FormLabel>

                      <Select
                        name="PET_ID"
                        placeholder="Selecciona un tipo"
                        disabled={flag}>
                        {personType?.map((value, idx) => {
                          if (Number(value.PET_ID) == viewcliente[0].PET_ID) {
                            return (
                              <option key={idx} value={value.PET_ID} selected>
                                {value.PET_NAME}{" "}
                              </option>
                            );
                          } else {
                            return (
                              <option key={idx} value={value.PET_ID}>
                                {value.PET_NAME}{" "}
                              </option>
                            );
                          }
                        })}
                      </Select>
                    </FormControl>
                    <FormControl>
                      <FormLabel>Forma de Pago</FormLabel>

                      <Select
                        disabled={flag}
                        placeholder="Selecciona una forma de pago"
                        name="PMT_ID">
                        {grupo?.map((value, idx) => {
                          if (Number(value.PMT_ID) == viewcliente[0].PMT_ID) {
                            return (
                              <option key={idx} value={value.PMT_ID} selected>
                                {value.PMT_NAME}{" "}
                              </option>
                            );
                          } else {
                            return (
                              <option key={idx} value={value.GRO_ID}>
                                {value.GRO_NAME}{" "}
                              </option>
                            );
                          }
                        })}
                      </Select>
                    </FormControl>
                    <FormControl>
                      <FormLabel>CLASIFICACIÓN DE CLIENTE</FormLabel>
                      <Select
                        name="CLA_ID"
                        placeholder="Selecciona una clasificación"
                        disabled={flag}>
                        {clasificacion?.map((value, idx) => {
                          if (Number(value.CLA_ID) == viewcliente[0].CLA_ID) {
                            return (
                              <option key={idx} value={value.CLA_ID} selected>
                                {value.CLA_NAME}{" "}
                              </option>
                            );
                          } else {
                            return (
                              <option key={idx} value={value.CLA_ID}>
                                {value.CLA_NAME}{" "}
                              </option>
                            );
                          }
                        })}
                      </Select>
                    </FormControl>
                  </HStack>
                  <br />
                  <HStack spacing="20px">
                    <FormControl>
                      <FormLabel>NOMBRES COMPLETOS</FormLabel>
                      <>
                        <Stack direction="row" h="40px" p={2}>
                          <Divider orientation="vertical" />
                          <Text fontSize="md">{viewcliente[0].PER_NAME}</Text>
                        </Stack>
                      </>
                    </FormControl>
                    <FormControl>
                      <FormLabel>APELLIDOS COMPLETOS</FormLabel>
                      <>
                        <Stack direction="row" h="40px" p={2}>
                          <Divider orientation="vertical" />
                          <Text fontSize="md">
                            {viewcliente[0].PER_LASTNAME}
                          </Text>
                        </Stack>
                      </>
                    </FormControl>
                  </HStack>
                  <br />
                  <HStack spacing="20px">
                    <FormControl>
                      <FormLabel>NOMBRE COMERCIAL</FormLabel>
                      <>
                        <Stack direction="row" h="40px" p={2}>
                          <Divider orientation="vertical" />
                          <Text fontSize="md">
                            {viewcliente[0].PER_TRADENAME}
                          </Text>
                        </Stack>
                      </>
                    </FormControl>
                    <FormControl>
                      <FormLabel>EMAIL</FormLabel>
                      <>
                        <Stack direction="row" h="40px" p={2}>
                          <Divider orientation="vertical" />
                          <Text fontSize="md"> {viewcliente[0].PER_EMAIL}</Text>
                        </Stack>
                      </>
                    </FormControl>
                  </HStack>
                  <br />
                  <HStack spacing="20px">
                    <FormControl>
                      <FormLabel>DNI</FormLabel>
                      <>
                        <Stack direction="row" h="40px" p={2}>
                          <Divider orientation="vertical" />
                          <Text fontSize="md">{viewcliente[0].PER_DNI}</Text>
                        </Stack>
                      </>
                    </FormControl>
                    <FormControl>
                      <FormLabel>RUC</FormLabel>
                      <>
                        <Stack direction="row" h="40px" p={2}>
                          <Divider orientation="vertical" />
                          <Text fontSize="md">{viewcliente[0].PER_RUC}</Text>
                        </Stack>
                      </>
                    </FormControl>
                    <FormControl>
                      <FormLabel>N° CELULAR</FormLabel>
                      <>
                        <Stack direction="row" h="40px" p={2}>
                          <Divider orientation="vertical" />
                          <Text fontSize="md">
                            {viewcliente[0].PER_N_PHONE}
                          </Text>
                        </Stack>
                      </>
                    </FormControl>
                  </HStack>
                  <br />
                  <HStack spacing="20px">
                    <FormControl>
                      <FormLabel>DIRECCIÓN</FormLabel>
                      <>
                        <Stack direction="row" h="40px" p={2}>
                          <Divider orientation="vertical" />
                          <Text fontSize="md">
                            {viewcliente[0].PER_DIRECTION}
                          </Text>
                        </Stack>
                      </>
                    </FormControl>
                    <FormControl>
                      <FormLabel>DEPARTAMENTO</FormLabel>
                      <>
                        <Stack direction="row" h="40px" p={2}>
                          <Divider orientation="vertical" />
                          <Text fontSize="md">
                            {viewcliente[0].PER_DEPARTMENT}
                          </Text>
                        </Stack>
                      </>
                    </FormControl>
                    <FormControl>
                      <FormLabel>PROVINCIA</FormLabel>
                      <>
                        <Stack direction="row" h="40px" p={2}>
                          <Divider orientation="vertical" />
                          <Text fontSize="md">
                            {viewcliente[0].PER_PROVINCE}
                          </Text>
                        </Stack>
                      </>
                    </FormControl>
                  </HStack>
                  <br />
                  <HStack spacing="20px">
                    <FormControl>
                      <FormLabel>DISTRITO</FormLabel>
                      <>
                        <Stack direction="row" h="40px" p={2}>
                          <Divider orientation="vertical" />
                          <Text fontSize="md">
                            {viewcliente[0].PER_DISTRIC}
                          </Text>
                        </Stack>
                      </>
                    </FormControl>
                    <FormControl>
                      <FormLabel>PAÍS</FormLabel>
                      <>
                        <Stack direction="row" h="40px" p={2}>
                          <Divider orientation="vertical" />
                          <Text fontSize="md">
                            {viewcliente[0].PER_COUNTRY}
                          </Text>
                        </Stack>
                      </>
                    </FormControl>
                  </HStack>
                  <br />
                  <FormControl>
                    <Button colorScheme="blue" mr={3} disabled={flag}>
                      Editar
                    </Button>
                    <Button onClick={onClose}>Cancelar</Button>
                  </FormControl>
                </DrawerBody>
              ) : (
                <EditCliente
                  grupo={grupo}
                  clasificacion={clasificacion}
                  personType={personType}
                  viewcliente={viewcliente[0]}
                  reload={reload}
                  onclose={onClose}
                />
              )}
            </>
          ) : (
            <>
              <DrawerHeader>
                <Stack>
                  <Skeleton height="20px" />
                </Stack>
              </DrawerHeader>
              <DrawerBody>
                <Stack>
                  <Skeleton height="20px" />
                </Stack>
              </DrawerBody>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
};
