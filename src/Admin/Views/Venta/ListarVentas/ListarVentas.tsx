import React, { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { MyContain } from "../../../UI/Components/MyContain";
import { MyReactTable } from "../../../../GlobalUI/Table/MyReactTable";

import {
  Grid,
  Skeleton,
  Stack,
  Box,
  Button,
  Input,
  Text,
  useToast,
  InputGroup,
  InputRightElement,
  Flex,
  IconButton,
  Spacer,
  HStack,
  Tooltip,
  TabPanel,
  TabPanels,
  Tab,
  Tabs,
  TabList,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Portal,
  PopoverArrow,
  PopoverCloseButton,
  PopoverBody,
  Center,
  ModalContent,
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from "@chakra-ui/react";
import { ImpresionVenta as FormatoImpresion } from "../Impresion/ImpresionVenta";
import api from "../RealizarVenta/ApiVentas";
import { ListaVentasExport } from "./ListaVentasExport";
import { ButtonRefetch } from "../../../UI/Components/ButtonRefetch";
import { TablaSinDatos } from "../../../UI/Components/TablaSinDatos";
import { TableCharge } from "../../../UI/Components/TableCharge/tablecharge";
import { BiPrinter } from "react-icons/bi";
import { BsFillPrinterFill, BsFillTrashFill } from "react-icons/bs";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Enviar } from "../Comprobantes/EnviarComprobante";
import { VerComprobante } from "../Comprobantes/VerComprobante";
import { NotaCredito } from "../Comprobantes/NotaCredito";
import { GenerarDeAnulado } from "../Comprobantes/GenerarDeAnulado";
import { FcDataConfiguration } from "react-icons/fc";
import { GrConfigure } from "react-icons/gr";
import { IoMdOptions } from "react-icons/io";
import { DonwloadPDF } from "../ListarVentasOnline/DonwloadPDF";
import { AiFillFilePdf } from "react-icons/ai";
import { VentaPdf } from "./VentaPdf";
import { documentDelete } from "../../../../Service/Sales";
export const ListarVentas = () => {

  useEffect(() => {
    //@ts-ignore
    document.getElementById('title_view').textContent = 'Listar Venta';
  })

  const currentTime = new Date();
  const year = currentTime.getFullYear()

  function getMonday(d: Date) {
    d = new Date(d);

    let dayinit = d.getDay();
    let diffinit = d.getDate() - dayinit + (dayinit == 0 ? -7 : 0); // adjust when day is sunday 
    let formatinit = new Date(d.setDate(diffinit)).toISOString().substring(0, 10)
    let splitformatinit = formatinit.split("-");
    let formatCorrectInit = splitformatinit[2] + "-" + splitformatinit[1] + "-" + splitformatinit[0];

    let dayfinal = d.getDay();
    let diffinal = d.getDate() - dayfinal + (dayfinal == 0 ? +7 : 7); // adjust when day is sunday 
    let formatfin = new Date(d.setDate(diffinal)).toISOString().substring(0, 10)
    let splitformatfin = formatfin.split("-");
    let formatCorrectFin = splitformatfin[2] + "-" + splitformatfin[1] + "-" + splitformatfin[0];

    return { diffinit: formatinit, formatdiffinit: formatCorrectInit, dayfinal: formatfin, formatdayfinal: formatCorrectFin };
  }

  const [fechas, setFechas] = useState({ fechaIni: getMonday(new Date()).formatdiffinit, fechaFin: getMonday(new Date()).formatdayfinal, tienda: 5 })

  async function getVentas({ fechaIni, fechaFin, tienda }: { fechaIni: string, fechaFin: string, tienda: number }) {
    const res = await fetch(import.meta.env.VITE_APP_API + `/document/desc/${fechaIni + '/' + fechaFin + '/' + tienda}`);
    return res.json();
  }


  const { isLoading, isError, data, error, isFetching, refetch } = useQuery(["ventas", fechas], () => getVentas(fechas), {
    refetchOnWindowFocus: false,
  });

  const formatDate = (date: any) => {
    let fecha = date.split('-')
    let formatted_date = fecha[2].substr(0, 2) + '-' + fecha[1] + '-' + fecha[0];
    return formatted_date;
  }

  function handleInput(e: any) {

    const fechaParcer = formatDate(e.target.value)
    setFechas({
      ...fechas,
      [e.target.name]: fechaParcer,
    });
  }


  const columnas = [
    {
      Header: "Fecha",
      Footer: "Fecha",
      accessor: "DOC_DATE2",
    },
    {
      Header: "DNI/RUC",
      Footer: "DNI/RUC",
      accessor: "DOC_ID_CLIENT",
    },
    {
      Header: "Nombres Comercial",
      Footer: "Nombres Comercial",
      accessor: "DOC_BUSINESS_NAME",
      filter: "fuzzyText",
    },
    {
      Header: "Tipo Documento",
      Footer: "Tipo Documento",
      accessor: "DCT_NAME",
    },
    {
      Header: "Nro. Comprobante",
      Footer: "Nro. Comprobante",
      accessor: "COMPROBANTE",
    },
    {
      Header: "Forma de Pago",
      Footer: "Forma de Pago",
      accessor: "PMT_NAME",
    },
    {
      Header: "Estado SUNAT",
      Footer: "Estado SUNAT",
      accessor: "DOC_STATUS",
    },
    {
      Header: "Estado Documento",
      Footer: "Estado Documento",
      //@ts-ignore
      Cell: ({ row }) => (
        <React.Fragment>
          <Text>{row.original.DOC_ESTADO == 0 ? "Emitido" : "Pagado"}</Text>
        </React.Fragment>
      ),
    },
    {
      Header: "Total Neto",
      Footer: "Total Neto",
      //@ts-ignore
      Cell: ({ row }) => (
        <React.Fragment>
          <Text>S/.{row.original.DOC_NETO}</Text>
        </React.Fragment>
      ),
    },
    {
      Header: "Acciones",
      Footer: "Acciones",
      //@ts-ignore
      Cell: ({ row }) => (
        <React.Fragment>
          <Flex gap={2}>

            {/* <VentaPdf venta={row.original}>
              <Tooltip label='Descargar PDF'>
                <IconButton
                  colorScheme='gray'
                  aria-label='Call Segun'
                  size='lg'
                  icon={<AiFillFilePdf />}
                  onClick={()=>{console.log(row.original);
                  }}
                />
              </Tooltip>
            </VentaPdf> */}

            <Eliminar venta={row.original} />
            <Impresion venta={row.original} />

            <Box hidden={(row.original.DOC_DOC_TYPE == 'COTIZACION' || row.original.DOC_DOC_TYPE == 'TICKET DE VENTA' || row.original.DOC_DOC_TYPE == 'NOTA DE VENTA') ? false : true}>
              <VerVenta venta={row.original} />
            </Box>

            <Box hidden={(row.original.DOC_DOC_TYPE !== 'COTIZACION' && row.original.DOC_DOC_TYPE !== 'TICKET DE VENTA' && row.original.DOC_DOC_TYPE !== 'NOTA DE VENTA') ? false : true}>
              <Popover placement='left'>
                <PopoverTrigger>
                  <Box>
                    <Tooltip label="Opciones">
                      <IconButton aria-label="Opciones" bg={"#006dae"} color="white" _hover={{}} size={'lg'} icon={<IoMdOptions />}                    >
                      </IconButton>
                    </Tooltip>

                  </Box>
                </PopoverTrigger>
                <Portal>
                  <PopoverContent>
                    <PopoverArrow />
                    <PopoverCloseButton />
                    <PopoverBody>
                      <Center>
                        <Box display={"flex"} alignContent={'center'} alignItems={'center'}>
                          <Enviar venta={row.original} action={refetch} />
                          <VerComprobante venta={row.original} />
                          <NotaCredito venta={row.original} action={refetch} />
                          <GenerarDeAnulado venta={row.original} />
                          {/* <VerVenta venta={row.original} /> */}
                        </Box>
                      </Center>
                    </PopoverBody>
                  </PopoverContent>
                </Portal>
              </Popover>

            </Box>

          </Flex>
        </React.Fragment>
      ),
    },
  ];

  //@ts-ignore
  if (isError) return <h1>{error.message}</h1>;

  return (
    <Grid gap="1rem">
      <MyContain>
        <HStack>
          <Flex w="full" gap={5}>
            <Flex>
              <Input type="date" name="fechaIni" defaultValue={getMonday(new Date()).diffinit} onChange={handleInput} variant="filled" />
              <Input type="date" name="fechaFin" defaultValue={getMonday(new Date()).dayfinal} onChange={handleInput} variant="filled" />
            </Flex>
            <ListaVentasExport fechas={fechas} isLoading={isLoading} data={data} />
          </Flex>
          <Spacer />
          <ButtonRefetch refetch={refetch} />
        </HStack>

      </MyContain>
      {
        <MyContain>
          <Tabs variant='enclosed'>
            <TabList>
              <Tab onClick={() => { setFechas({ ...fechas, tienda: 5 }) }}>Fisica</Tab>
              <Tab onClick={() => { setFechas({ ...fechas, tienda: 15 }) }}>Online</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                {(isLoading || isFetching) ? (<TableCharge />) : (data.length > 0) ?
                  (
                    <Box w="full">
                      <MyReactTable
                        data={data}
                        columns={columnas}
                        isPaginated
                        hasFilters
                        pagesOptions={[50, 75, 100]}
                      />
                    </Box>
                  ) :
                  (<TablaSinDatos message="No hay Ventas" />)}
              </TabPanel>
              <TabPanel>
                {(isLoading || isFetching) ? (<TableCharge />) : (data.length > 0) ?
                  (
                    <Box w="full">
                      <MyReactTable
                        data={data}
                        columns={columnas}
                        isPaginated
                        hasFilters
                        pagesOptions={[50, 75, 100]}
                      />

                    </Box>
                  ) :
                  (<TablaSinDatos message="No hay Ventas" />)}
              </TabPanel>
            </TabPanels>
          </Tabs>
        </MyContain >
      }
    </Grid >
  );
};

const Eliminar = ({ venta }: { venta: any }) => {
  const { mutateAsync, isLoading } = useMutation(documentDelete);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const queryClient = useQueryClient();

  return (
    <>
      <Tooltip label='Eliminar'>
        <IconButton
          hidden={venta.DOC_STATUS == "CREADO" ? false : true}
          colorScheme='red'
          aria-label='Call Segun'
          size='lg'
          icon={<BsFillTrashFill />}
          onClick={async () => {
            onOpen()
          }}
        />
      </Tooltip>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>¿DESEA ELIMINAR EL DOCUMENTO?</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Esta acción eliminara el detalle de la venta y el documento como tal
          </ModalBody>

          <ModalFooter>
            <Button isLoading={isLoading} colorScheme='red' mr={3} onClick={async () => {
              await mutateAsync({ DOC_ID: venta.DOC_ID })
              await queryClient.invalidateQueries("ventas")
              await onClose()
            }}>
              Eliminar
            </Button>
            <Button variant='ghost' onClick={onClose}>Cancelar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>)

};

const Impresion = ({ venta }: { venta: any }) => {
  async function getConfiguracionImpresion() {
    const res = await fetch(import.meta.env.VITE_APP_API + "/config"); //falta
    return res.json();
  }
  function AbrirVentana() {
    getConfiguracionImpresion().then((result: any) => {
      let ruta = import.meta.env.VITE_APP_API_SUNAT_2 + "/impresion/";
      if (result[0].TEM_ID == 5) {
        ruta = ruta + "ventas/" + venta.DOC_ID;
      } else if (result[0].TEM_ID == 15) {
        ruta = ruta + "ventasticket/" + venta.DOC_ID;
      }
      let titulo = "Ventar";
      let opciones =
        "toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=0,resizable=0,width=400,height=screen.height,top=0,left=0";

      window.open(ruta, titulo, opciones);
    });
  }
  return <Tooltip label='Imprimir'>
    <IconButton
      colorScheme='gray'
      aria-label='Call Segun'
      size='lg'
      icon={<BsFillPrinterFill />}
      onClick={AbrirVentana}
    />
  </Tooltip>;
};

const VerVenta = ({ venta }: { venta: any }) => {
  const messageToast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();
  let [correo, SetCorreo] = React.useState("");
  function EnviarCorreo() {
    // let emailRegex =
    //   /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    // if (emailRegex.test(correo)) {
    messageToast({
      title: "Estamos enviando el correo",
      description: "El comprobante se está enviando al correo",
      status: "info",
      duration: 3000,
      isClosable: true,
    });
    api.ventas.sendCorreo(venta.DOC_ID, correo).then((result: any) => {
      if (result.message == "Mail send") {
        messageToast({
          title: "Correo enviado",
          description:
            "El comprobante fue enviado a " + correo + " satisfactoriamente",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        messageToast({
          title: "Correo no enviado",
          description: "hubo algún error al enviar el correo",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    });
  }


  return (
    <>
      <Tooltip label='Ver'>
        <IconButton
          bg={"#0080ff"}
          color="white"
          _hover={{}}
          aria-label='Call Segun'
          size='lg'
          /*@ts-ignore*/
          ref={btnRef}
          icon={<FaEye />}
          onClick={onOpen}
        />
      </Tooltip>
      {/* <Button ref={btnRef} ml="1" colorScheme="teal" onClick={onOpen}>
        Ver
      </Button> */}
      {/*@ts-ignore*/}
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        //@ts-ignore
        finalFocusRef={btnRef}
        size="xl">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Información de ventas</DrawerHeader>

          <DrawerBody>
            <FormatoImpresion
              productos={[]}
              idventa={venta.DOC_ID}
              activador={() => { }}
            />
            <InputGroup size="md">
              <Input
                pr="4.5rem"
                type="email"
                placeholder="Ingrese Correo"
                value={correo}
                onChange={(e) => {
                  SetCorreo(e.target.value);
                }}
              />
              <InputRightElement width="6rem">
                <Button h="1.75rem" size="sm" onClick={EnviarCorreo}>
                  Enviar Correo
                </Button>
              </InputRightElement>
            </InputGroup>

            <Box display={'flex'} justifyContent='center' justifyItems={'center'} justifySelf='center'>

              <VentaPdf venta={venta}>
                <Tooltip label='Descargar PDF'>
                  <Button
                    colorScheme='red'
                    aria-label='Call Segun'
                    size='lg'
                    leftIcon={<AiFillFilePdf />}
                    onClick={() => {
                      console.log(venta);
                    }}
                  > GENERAR PDF </Button>
                </Tooltip>
              </VentaPdf>
            </Box>
          </DrawerBody>

          <DrawerFooter>
            <Button bg={"#0080ff"}
              color={"white"}
              _hover={{ bg: "rgb(237 242 247)", color: "#0080ff" }} variant="outline" mr={3} onClick={onClose}>
              Cancelar
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};
