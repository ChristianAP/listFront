import {
  Box,
  Button,
  Center,
  Flex,
  Grid,
  GridItem,
  Heading,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Stack,
  Switch,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { BiUserCircle } from "react-icons/bi";
import { GrUserAdmin } from "react-icons/gr";
import {
  GetPersonUserOne,
  GetUserOne,
} from "../../../../Service/PersonService";
import Cookies from "universal-cookie";
import { CreatePerson } from "../../../../Model/Person";
import { Form, Formik } from "formik";
import { MyTextInput } from "../../../../GlobalUI/Forms/MyInputs";
import { AdminState } from "../../../../Data/Atoms/Admin";
import { useRecoilState } from "recoil";
import { array } from "yup";
import { createCountClient } from "../../../../Service/User";
import { useToast } from "@chakra-ui/react";

export const PerfilConfiguration = () => {
  const toast = useToast();
  const cookies = new Cookies();
  const token = cookies.get("token");
  const [cliente, setcliente] = useState(Boolean);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [admin, setAdmin] = useRecoilState(AdminState);
  const [userPersonData, setUserPersonData] = useState<CreatePerson[]>([]);
  const [userPersonData2, setUserPersonData2] = useState<CreatePerson>();

  const messageClient: string =
    "Al confirmar, se creara una cuenta de usuario cliente con su mismo usuario y contraseña.";
  const messageNoClient: string =
    "Al confirmar, se desactivara su cuenta de usuario cliente y no podra acceder a dicha cuenta.";

  const [isOpenpopo, setIsOpen] = React.useState(false);
  const [loadingCount, setLoadingCount] = useState(false);
  const open = () => setIsOpen(!isOpenpopo);
  const close = () => setIsOpen(false);

  const [userData, setUserData] = useState<any>();

  async function getData() {
    const dataPerson = await GetPersonUserOne(admin.iu);
    setUserPersonData2(dataPerson);
    setUserPersonData(dataPerson);
  }

  async function countCliente() {
    setLoadingCount(true);
    const serCliente = await createCountClient({
      USR_ID: admin.iu,
      PER_ID: userPersonData2?.PER_ID,
    });
    if (serCliente.status === 200) {
      setcliente(!cliente);
      setLoadingCount(false);
      toast({
        title: "Cuenta cliente.",
        description: serCliente.message,
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    }
    close();
  }

  useEffect(() => {
    //@ts-ignore
    setcliente(admin.roles.includes("CLIENTE"));

    // if (token) {
    getData();
    // }
  }, []);
  return (
    <>
      <Stack>
        <Box h="40px" bg="whiteAlpha.600" p={2}>
          <Heading fontWeight={"normal"} fontSize={"xl"}>
            Perfil
          </Heading>
        </Box>
        <Center>
          <Grid
            h="340px"
            templateRows="repeat(2, 1fr)"
            templateColumns="repeat(5, 1fr)"
            gap={4}>
            <GridItem colSpan={4} width="500px" bg="white" borderRadius={10}>
              <Box m={0}>
                <Center pt={4} pl={4} pr={4}>
                  <Image
                    borderRadius="full"
                    boxSize="150px"
                    src={userPersonData2?.PER_PHOTO}
                    alt={userPersonData2?.PER_NAME}
                  />
                </Center>
              </Box>
              <Box m={0}>
                <Center pt={2}>
                  <Heading mb={1} fontWeight={"light"}>
                    {userPersonData2?.PER_NAME +
                      " " +
                      userPersonData2?.PER_LASTNAME}
                  </Heading>
                </Center>
              </Box>
              <Box m={0}>
                <Center pt={1}>
                  <Heading mb={4} fontWeight={"light"} fontSize={"x-large"}>
                    {admin.roles}
                  </Heading>
                </Center>
              </Box>
              <Box mr={4} ml={4}>
                <Center>
                  <Heading fontWeight={"normal"} fontSize={"xl"} p={2}>
                    Cuentas
                  </Heading>
                </Center>
                <Center>
                  <Box pl={2} mr={2} mt={3}>
                    <Flex>
                      <Flex mr={2} ml={2}>
                        <Box mr={1} ml={1}>
                          <Popover isOpen={isOpenpopo} onClose={close}>
                            <PopoverTrigger>
                              <Button onClick={open}>
                                {cliente === true
                                  ? "Dejar de ser cliente"
                                  : "Quiero ser cliente"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent>
                              <PopoverArrow />
                              <PopoverCloseButton />
                              <PopoverHeader>¡Confirmacion!</PopoverHeader>
                              <PopoverBody>
                                {cliente === true
                                  ? messageNoClient
                                  : messageClient}
                              </PopoverBody>
                              <PopoverFooter>
                                <Button
                                  isLoading={loadingCount}
                                  colorScheme="red"
                                  onClick={ countCliente }>
                                  Confirmar
                                </Button>
                              </PopoverFooter>
                            </PopoverContent>
                          </Popover>
                        </Box>
                      </Flex>
                    </Flex>
                  </Box>
                </Center>
                <br />
              </Box>
              <Box m={4}>
                <Center>
                  <Button colorScheme="blue" variant="solid" onClick={onOpen}>
                    Editar Información
                  </Button>
                </Center>
              </Box>
            </GridItem>
          </Grid>
        </Center>
      </Stack>
      <Modal
        size="2xl"
        isCentered
        onClose={onClose}
        isOpen={isOpen}
        motionPreset="slideInBottom">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Datos de Usuario</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Formik
              initialValues={userPersonData}
              onSubmit={async (values: any) => {
                // TO DO - Terminar el proceso de editar perfil
                console.log(values);
              }}>
              <Form>
                <Grid
                  h="auto"
                  templateRows="repeat(6, auto)"
                  templateColumns="repeat(6, 16.6%)"
                  w="full">
                  <GridItem mx={2} colSpan={3}>
                    <MyTextInput
                      label="Nombres"
                      name="PER_NAME"
                      type="text"
                      placeholder="CUDESI"
                    />
                  </GridItem>
                  <GridItem mx={2} colSpan={3}>
                    <MyTextInput
                      label="Apellidos"
                      name="PER_LASTNAME"
                      type="text"
                      placeholder="SAC"
                    />
                  </GridItem>
                  <GridItem mx={2} colSpan={3}>
                    <MyTextInput
                      label="DNI"
                      name="PER_DNI"
                      type="text"
                      placeholder="DNI"
                    />
                  </GridItem>
                  <GridItem mx={2} colSpan={3}>
                    <MyTextInput
                      label="Email"
                      name="PER_EMAIL"
                      type="text"
                      placeholder="Email"
                    />
                  </GridItem>
                  <GridItem mx={2} colSpan={3}>
                    <MyTextInput
                      label="Celular"
                      name="PER_N_PHONE"
                      type="text"
                      placeholder="Celular"
                    />
                  </GridItem>
                  <GridItem mx={2} colSpan={3}>
                    <MyTextInput
                      label="RUC"
                      name="PER_RUC"
                      type="text"
                      placeholder="11111111111"
                    />
                  </GridItem>

                  <GridItem mx={2} colSpan={3}>
                    <MyTextInput
                      label="Direccion"
                      name="PER_DIRECTION"
                      type="text"
                      placeholder="Mza. Q Lote. 5 A.H. San Francisco de ñaña"
                    />
                  </GridItem>
                  <GridItem mx={2} colSpan={3}>
                    <MyTextInput
                      label="Ciudad"
                      name="PER_COUNTRY"
                      type="text"
                      placeholder="Lima"
                    />
                  </GridItem>
                  <GridItem mx={2} colSpan={3}>
                    <MyTextInput
                      label="Distrito"
                      name="PER_DISTRIC"
                      type="text"
                      placeholder="Lima"
                    />
                  </GridItem>
                  <GridItem mx={2} colSpan={3}>
                    <MyTextInput
                      label="Provincia"
                      name="PER_PROVINCE"
                      type="text"
                      placeholder="Lima"
                    />
                  </GridItem>
                  <GridItem mx={2} colSpan={3}>
                    <MyTextInput
                      label="Departamento"
                      name="PER_DEPARTMENT"
                      type="text"
                      placeholder="Lima"
                    />
                  </GridItem>
                  <GridItem mx={2} colSpan={3}></GridItem>
                  <GridItem mx={2} colSpan={3}></GridItem>
                </Grid>
              </Form>
            </Formik>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" mr={3} onClick={onClose}>
              Cerrar
            </Button>
            <Button variant="ghost" type="submit" colorScheme="blue" mr={3}>
              Aceptar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
