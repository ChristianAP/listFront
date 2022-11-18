import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { MyContain } from "../../../UI/Components/MyContain";
import {
  Table,
  Thead,
  Tbody,
  Grid,
  Tr,
  Th,
  Td,
  Box,
  Alert,
  AlertIcon,
  Center,
  HStack,
  Stack,
  Heading,
  Circle,
  Button,
  Skeleton,
  Flex,
  SimpleGrid,
  Wrap,
  WrapItem,
  Avatar,
  useColorModeValue,
  Text,
  Badge,
  Link,
  Spacer,
  Tooltip,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  useDisclosure,
  Spinner,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";
import {
  DeletePerson,
  ListClasificacion,
  ListFormaPago,
  ListGrupo,
  ListTipo,
} from "../../../../Service/PersonService";
import { Cliente } from "../../../../Model/Clientes";
import {
  ListClientes,
  ListTrabajadores,
  DeleteCliente,
} from "../../../../Service/ClienteService";

import { Clasificacion, Grupo, PersonType } from "../../../../Model/Clientes";
import { MyReactTable } from "../../../../GlobalUI/Table/MyReactTable";
import { AddCliente } from "./AddCliente";
import { BsFillEyeFill, BsFillTrashFill, BsPlusSquare } from "react-icons/bs";
import { BiEdit } from "react-icons/bi";
import { ViewCliente } from "./ViewCliente";

import { CreatePerson } from "../../../../Model/Person";
import { createCliente } from "../../../../Model/Clientes";
import { ModalDeleteCliente } from "./DeleteCliente";
import { TableCharge, TableChargeList } from "../../../UI/Components/TableCharge/tablecharge";
import { ButtonRefetch } from "../../../UI/Components/ButtonRefetch";
import { ImportPlantilla } from "./ImportPlantilla";
import { ImportClient } from "./ImportClient";
import { TablaSinDatos } from "../../../UI/Components/TablaSinDatos";
export const ListarClientes = () => {
  // const [cliente, setClientes] = useState<Cliente[]>([]);
  // const [clasificacion, setClasificacion] = useState<Clasificacion[]>([]);
  // const [personType, setType] = useState<PersonType[]>([]);
  // const [grupo, setGrupo] = useState<Grupo[]>([]);
  const [ismobile, setIsMobile] = useState(false);
  const [isWorker, setIsWorker] = useState(0);
  const [carganding, setCarganding] = useState(false)

  const { isOpen, onOpen, onClose } = useDisclosure()


  const { isLoading, isError, data, error, isFetching, refetch } = useQuery(
    "allclients",
    ListClientes,
    { refetchOnWindowFocus: false }
  );

  const { isLoading: isLoadingTrabajador, isError: isErrorTrabajadores, data: dataTrabajadores, error: errorTrabajadores, isFetching: isfetchingTrabajadores, refetch: refetchTrabajadores } = useQuery(
    "alltrabajadores",
    ListTrabajadores,
    { refetchOnWindowFocus: false }
  );

  const { data: personType, isLoading: personTypeLading, refetch: personTypeRefetch } = useQuery(
    "typeClients",
    ListTipo,
    { refetchOnWindowFocus: false }
  );

  const { data: clasificacion, isLoading: clasificacionLoading, refetch: clasificacionRefetch } = useQuery(
    "ListClasificacion",
    ListClasificacion,
    { refetchOnWindowFocus: false }
  );

  const { data: grupo, isLoading: grupoLoading, refetch: ListGrupoRefetch } = useQuery(
    "ListGrupo",
    ListFormaPago,
    { refetchOnWindowFocus: false }
  );

  // @ts-ignore
  const [persona, setPersona] = useState<CreatePerson>({
    PET_ID: 0,
    PMT_ID: 0,
    PER_NAME: "",
    PER_LASTNAME: "",
    PER_TRADENAME: "",
    PER_EMAIL: "",
    PER_DNI: "",
    PER_RUC: "",
    PER_N_PHONE: "",
    PER_DIRECTION: "",
    PER_DEPARTMENT: "",
    PER_PROVINCE: "",
    PER_DISTRIC: "",
    PER_COUNTRY: "",
  });

  const [clienteForm, setClienteForm] = useState<createCliente>({
    CLA_ID: 0,
    PER_ID: 0,
  });
  

  const columns = [
    {
      Header: "nombres y apellidos",
      accessor: "PER_NAME",
      filter: "fuzzyText",
      // @ts-ignore
      Cell: ({ row }) => (
        <Text>{row.original.PER_LASTNAME + " " + row.original.PER_NAME}</Text>
      ),
    },
    {
      Header: "Razon Social",
      accessor: "PER_TRADENAME",
      filter: "fuzzyText",
    },
    {
      Header: "EMAIL",
      accessor: "PER_EMAIL",
      filter: "fuzzyText",
    },

    {
      Header: "CELULAR",
      accessor: "PER_N_PHONE",
      filter: "fuzzyText",
    },

    {
      Header: "DIRECCIÓN",
      accessor: "PER_DIRECTION",
      filter: "fuzzyText",
    },

    {
      Header: "Acciones",
      id: "actions",

      // @ts-ignore
      Cell: ({ row }) => (
        <ActionCell
          data={row.original}
          setDataClient={ListClientes}
          clasificacion={clasificacion}
          personType={personType}
          grupo={grupo}
          refecth={refetch}
        />
      ),
    },
  ];

  useEffect(() => {

    //@ts-ignore
    document.getElementById('title_view').textContent = 'Listar Personas y Clientes';

    navigator.userAgent.search('Mobile') >= 0 ? setIsMobile(true) : setIsMobile(false);

  }, []);

  if (isLoading || isFetching || clasificacionLoading || grupoLoading || personTypeLading) return <TableChargeList />

  // @ts-ignore
  if (isError) return <h1>{error.message} </h1>;

  return (
    <>
      {/* <div id="carga" style={{'border' : '2px solid black', 'display' : carganding ? 'block' : 'none'}}> */}
      <Modal closeOnOverlayClick={false} onClose={onClose} isOpen={carganding} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign={'center'}>IMPORTANDO DATOS</ModalHeader>
          <ModalBody>

            <Flex flexDirection={'column'} justifyContent={'center'} alignContent='center' alignSelf={'center'} alignItems={'center'} justifyItems='center' justifySelf={'center'}>
              <Stack direction='row' spacing={4}>
                <Spinner size='xl' />
              </Stack>
              <Text textTransform={'uppercase'} fontSize= '20px' fontWeight={'bold'} marginTop='10px'> CARGANDO REGISTROS </Text>
            </Flex>

          </ModalBody>
          <ModalFooter>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <MyContain>
        <HStack>
          <AddCliente
            title="Añadir"
            reload={refetch}
            personType={personType}
            grupo={grupo}
            clasificacion={clasificacion}
            sizeButton={"md"}
            clientState={false}
            persona={persona}
            setPersona={setPersona}
            clienteForm={clienteForm}
            setClienteForm={setClienteForm}
            actionCloseDraw={() => { }}
            isWorker={isWorker}
            icon={
              <BsPlusSquare style={{ marginRight: 10 }} />
            }
          />
          <ImportPlantilla />
          <ImportClient setCarganding={setCarganding} />
          <Spacer />
          <ButtonRefetch refetch={refetch} />
        </HStack>
      </MyContain>
      <br />
      <Grid gap="1rem">
        <MyContain>
          <Tabs variant='enclosed'>
            <TabList>
              <Tab onClick={() => { setIsWorker(0) }}>Clientes</Tab>
              <Tab onClick={() => { setIsWorker(1) }}>Empleados</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                {data.status != 404 || data.status != 400 ? (
                  ismobile === true ? (
                    <CardCliente data={data}
                      setDataClient={ListClientes}
                      clasificacion={clasificacion}
                      personType={personType}
                      grupo={grupo}
                      refetch={refetch}
                    />
                  ) : (

                    <MyReactTable
                      columns={columns}
                      data={data}
                      isPaginated
                      hasFilters
                      pagesOptions={[50, 75, 100]}
                    />
                  )
                ) : (
                  <>
                    <Center> SIN DATA</Center>
                  </>
                )}
              </TabPanel>
              <TabPanel>
                {data.status != 404 || data.status != 400 ? (
                  ismobile === true ? (
                    <CardCliente data={dataTrabajadores}
                      setDataClient={ListTrabajadores}
                      clasificacion={clasificacion}
                      personType={personType}
                      grupo={grupo}
                      refetch={refetch}
                    />
                  ) : (

                    <MyReactTable
                      columns={columns}
                      data={dataTrabajadores}
                      isPaginated
                      hasFilters
                      pagesOptions={[50, 75, 100]}
                    />
                  )
                ) : (
                  <>
                    <Center> SIN DATA</Center>
                  </>
                )}
              </TabPanel>
            </TabPanels>
          </Tabs>
        </MyContain>
      </Grid>
    </>
  );
};

const ActionCell = ({
  data,
  setDataClient,
  clasificacion,
  personType,
  grupo,
  refecth
}: {
  data: any;
  setDataClient: any;
  clasificacion: any;
  personType: any;
  grupo: any;
  refecth: any;
}) => {
  return (
    <>
      <Stack direction="row" spacing={4}>
        <ViewCliente
          personType={personType}
          grupo={grupo}
          clasificacion={clasificacion}
          idCliente={Number(data.CLI_ID)}
          reload={setDataClient}
          dateFlag={false}
          icon={
            <>
              <BiEdit />
            </>
          }
        />
        <ModalDeleteCliente personId={data.PER_ID} clientId={data.CLI_ID} refetch={refecth}>
          <Tooltip hasArrow label='Eliminar'>
            <Button mr={3} backgroundColor="red.400" color="white">
              <BsFillTrashFill />
            </Button>
          </Tooltip>
        </ModalDeleteCliente>
      </Stack>
    </>
  );
};


const CardCliente = ({
  data,
  setDataClient,
  clasificacion,
  personType,
  grupo,
  refetch
}: {
  data: any;
  setDataClient: any;
  clasificacion: any;
  personType: any;
  grupo: any;
  refetch: any;
}) => {
  return (
    <>
      <Box>
        <Wrap >
          {data.map((item: any, idx: number) => (
            <WrapItem>
              <Center py={6}>
                <Box
                  maxW={'300px'}
                  w={'full'}
                  bg={useColorModeValue('white', 'gray.900')}
                  boxShadow={'2xl'}
                  rounded={'lg'}
                  p={6}
                  textAlign={'center'}>
                  <Avatar
                    size={'xl'}
                    mb={4}
                    name={item.PER_NAME}
                    pos={'relative'}
                    _after={{
                      content: '""',
                      w: 4,
                      h: 4,
                      bg: 'green.300',
                      border: '2px solid white',
                      rounded: 'full',
                      pos: 'absolute',
                      bottom: 0,
                      right: 3,
                    }}
                  />
                  <Heading fontSize={'2xl'} fontFamily={'body'}>
                    {item.PER_NAME ? item.PER_NAME : item.PER_TRADENAME}
                    <br />
                    {item.PER_LASTNAME ? item.PER_LASTNAME : ''}
                  </Heading>
                  <Box alignItems={'center'} justifyContent={'center'} flexDirection={'row'} mt={6}>
                    <Badge
                      px={2}
                      py={1} mb={1}
                      bg={useColorModeValue('gray.50', 'gray.800')}
                      fontWeight={'400'}>
                      {item.PET_NAME}
                    </Badge>
                    <Badge
                      px={2}
                      py={1}
                      mb={1}
                      bg={useColorModeValue('gray.50', 'gray.800')}
                      fontWeight={'400'}>
                      {item.PER_EMAIL}
                    </Badge>
                    <br />
                    <Badge
                      px={2}
                      py={1}
                      mb={1}
                      bg={useColorModeValue('gray.50', 'gray.800')}
                      fontWeight={'400'}>
                      {item.PER_N_PHONE}
                    </Badge>
                  </Box>
                  <Text
                    textAlign={'center'}
                    color={useColorModeValue('gray.700', 'gray.400')}
                    px={3}>
                    {item.PER_DIRECTION}
                  </Text>

                  <Stack mt={8} direction={'row'} spacing={4}>
                    <ViewCliente
                      personType={personType}
                      grupo={grupo}
                      clasificacion={clasificacion}
                      idCliente={Number(item.CLI_ID)}
                      reload={setDataClient}
                      dateFlag={false}
                      icon={
                        <>
                          <Button
                            flex={1}
                            fontSize={'sm'}
                            rounded={'full'}
                            _focus={{
                              bg: 'gray.200',
                            }}>
                            Editar
                          </Button>
                        </>
                      }
                    />
                    <ModalDeleteCliente personId={item.PER_ID} clientId={item.CLI_ID} refetch={refetch}>
                      <Button
                        flex={1}
                        fontSize={'sm'}
                        rounded={'full'}
                        bg={'blue.400'}
                        color={'white'}
                        boxShadow={
                          '0px 1px 25px -5px rgb(66 153 225 / 48%), 0 10px 10px -5px rgb(66 153 225 / 43%)'
                        }
                        _hover={{
                          bg: 'blue.500',
                        }}
                        _focus={{
                          bg: 'blue.500',
                        }}>
                        Eliminar
                      </Button>
                    </ModalDeleteCliente>
                  </Stack>
                </Box>
              </Center>
            </WrapItem>
          ))}
        </Wrap>
      </Box>
    </>
  );
};
