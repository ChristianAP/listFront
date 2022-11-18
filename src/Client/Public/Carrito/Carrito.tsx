import {
  Box,
  Button,
  Divider,
  useDisclosure,
  Alert,
  AlertIcon,
  AlertTitle,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Flex,
  ListItem,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  UnorderedList,
  useColorModeValue,
  AlertDescription,
  TableContainer,
  Table,
  TableCaption,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  CloseButton,
  Center,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { BiPurchaseTag, BiStore } from "react-icons/bi";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Link, Redirect } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { CostoCompraState } from "../../../Data/Atoms/Carrito";
import {
  ClientState,
  HeaderClient,
  NavClient,
} from "../../../Data/Atoms/Client";
import { IProductoCompra } from "../../../Model/Productos";
import { getCompany } from "../../../Service/CompanyService";
import { ListFormaVenta } from "../../../Service/FormaVentaService";
import { closeAlert, getPerfilFact, validationAlert } from "../../../Service/TiendaOnlineService";
import { IsLoading } from "../../UI/Component/isLoading";
import { ProductoCarrito } from "../../UI/Component/ProductoComp";
import { DivAddCarrito } from "./DivAddCarrito";

export const Carrito = () => {

  //const state
  const [nextStep, setNextStep] = useState(false);
  const [validate, setValidate] = useState(false);
  const [item, setItem] = useState([]);


  const auth = useRecoilValue(ClientState);
  const setCostoCarrito = useSetRecoilState(CostoCompraState);
  const costoCarrito = useRecoilValue(CostoCompraState);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isOpenAlert, onOpen: onOpenAlert, onClose: onCloseAlert } = useDisclosure();
  const setNavClient = useSetRecoilState(NavClient);
  const setHeadClient = useSetRecoilState(HeaderClient);

  const { data: reglas } = useQuery("reglas", ListFormaVenta, { refetchOnWindowFocus: false })
  const { data: company } = useQuery("company", getCompany, { refetchOnWindowFocus: false })
  const { mutateAsync, isLoading } = useMutation(validationAlert, {})

  useEffect(() => {
    setNavClient(false);
    setHeadClient(true);
  }, []);
  //const colors and background
  const boxColorBG = useColorModeValue("white", "gray.700");
  const boxResumenCompraBG = useColorModeValue("white", "gray.200");
  const buttonColorHover = useColorModeValue("blue.600", "gray.300");
  const boxCarritoVacioBG = useColorModeValue("gray.200", "gray.500");
  const buttonarritoVacioBG = useColorModeValue("blue.600", "gray.300");
  //obtenemos fecha para registrar el pedido:
  var today = new Date();
  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  const yyyy = today.getFullYear();
  //@ts-ignore
  today = mm + "/" + dd + "/" + yyyy;

  var subtotal: number = 0;
  var descuento: number = 0;
  var total: number = 0;
  var envio: number = company && company?.COM_DELIVERY_PRICE;
  const productos: IProductoCompra[] = JSON.parse(
    localStorage.getItem("cart") || "[]"
  ) as Array<IProductoCompra>;
  const { data, isError } = useQuery(
    "perfilfact",
    async () => await getPerfilFact(),
    { refetchOnWindowFocus: false }
  );
  function CalcularSubtotal(): number {
    console.log(productos);

    productos.map((val, idx) => {
      //@ts-ignore
      subtotal += val.subtotal
    });
    return subtotal;
  }
  function CalcularDescuento(): number {
    productos.map((val, idx) => {
      //@ts-ignore
      if (val.descuento != null || val.descuento == 0) {
        descuento += val.descuento * val.cantidad;
      }
    });
    console.log(descuento);
    return descuento;
  }
  function CalcularTotal(): number {
    total = subtotal - descuento + envio;
    setCostoCarrito({
      subtotal: subtotal,
      descuento: descuento,
      total: +(total.toFixed(2)),
    });
    return total;
  }

  async function Validation() {
    onOpenAlert()
    setValidate(true)

    var items = []
    for (let i = 0; i < productos.length; i++) {
      const element = productos[i];
      items.push(element)
    }

    let i = await mutateAsync({ orders_detail: items })
    console.log(i);
    if (i.message != "Item Disponible") {
      setValidate(false)
      setItem(i.items);
    } else {
      setItem([]);
      setValidate(false)
      setTimeout(() => {
        setNextStep(true);
      }, 3000)
    }


  }


  useEffect(() => {
    CalcularSubtotal();
    CalcularDescuento();
    CalcularTotal();
  }, [company]);


  return (
    <Box width="100">
      {nextStep && <Redirect to={"/metodo-pago"} />}
      <Flex direction={{ base: "column", xl: "row" }}>
        <Flex
          direction="column"
          padding={{ base: "1", md: "8" }}
          marginY="2"
          bg=""
          flex="8">
          <Box>
            <Text fontSize="xl">Orden</Text>
            <Box
              bg={boxColorBG}
              paddingLeft={{ base: "2", sm: "5" }}
              borderRadius="lg"
              paddingY="2"
              margin={{ base: "2", sm: "5" }}>
              {productos.length >= 1 && (
                <ProductoCarrito
                  key="carritokey"
                  productocompra={productos}></ProductoCarrito>
              )}
              {productos.length < 1 && (
                <DivAddCarrito type={"carrito"} />
              )}
            </Box>
          </Box>
          <Box
            bg={boxColorBG}
            paddingLeft={{ base: "2", sm: "5" }}
            borderRadius="lg"
            paddingY="2"
            margin={{ base: "2", sm: "5" }}>
            <Tabs isFitted variant="enclosed">
              <TabList mb="1em">
                <Tab>Enviar a Dirección</Tab>
                <Tab>Reglas de Envio</Tab>
              </TabList>
              <TabPanels>
                {(data && data.message) || isError ? (
                  <TabPanel>
                    <Flex justifyContent="center">
                      <Box
                        width="80%"
                        textAlign="center"
                        borderRadius="lg"
                        p="2"
                        m="1"
                        bg={boxCarritoVacioBG}>
                        <Text fontWeight="bold" textTransform="uppercase">
                          Aun Necesita Iniciar Sesion
                        </Text>
                        <Link to="/login">
                          <Button
                            mt="5"
                            colorScheme="teal"
                            variant="solid"
                            _hover={{ bg: buttonarritoVacioBG }}>
                            Iniciar Sesión
                          </Button>
                        </Link>
                      </Box>
                    </Flex>
                  </TabPanel>
                ) : (
                  (data && reglas) && (
                    <TabPanel>
                      <Flex gap={8}>
                        <Box>
                          <Text>Datos del Envio</Text>
                          <UnorderedList>
                            <ListItem>Pais:{data.PER_COUNTRY}</ListItem>
                            <ListItem>Departamento:{data.PER_DEPARTMENT}</ListItem>
                            <ListItem>Distrito:{data.PER_DISTRIC}</ListItem>
                            <ListItem>Dirección:{data.PER_DIRECTION}</ListItem>
                          </UnorderedList>
                        </Box>
                        <Box>
                          <Text>Reglas del Envio</Text>
                          <UnorderedList>
                            {(reglas[0].ORT_DETAIL.split('|')).map((val: any, idx: any) =>
                              <ListItem>{val}</ListItem>
                            )}
                          </UnorderedList>
                        </Box>
                      </Flex>
                    </TabPanel>
                  )
                )}
                <TabPanel>
                  <TableContainer>
                    <Table variant='simple'>
                      <TableCaption>Delivery</TableCaption>
                      <Thead>
                        <Tr>
                          <Th>LUNES</Th>
                          <Th>MARTES</Th>
                          <Th>MIERCOLES</Th>
                          <Th>VIERNES</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        <Tr>
                          <Td>BARRANCO</Td>
                          <Td>ATE</Td>
                          <Td>JESUS MARIA</Td>
                          <Td>JESUS MARIA</Td>
                        </Tr>
                        <Tr>
                          <Td>CARABAYLLO</Td>
                          <Td>LA MOLINA</Td>
                          <Td>CARABAYLLO</Td>
                          <Td>CARABAYLLO</Td>
                        </Tr>
                        <Tr>
                          <Td>COMAS</Td>
                          <Td>SAN BORJA</Td>
                          <Td>COMAS</Td>
                          <Td>COMAS</Td>
                        </Tr>
                        <Tr>
                          <Td>JESUS MARIA</Td>
                          <Td>SJL</Td>
                          <Td>LINCE</Td>
                          <Td>LINCE</Td>
                        </Tr>
                        <Tr>
                          <Td>LINCE</Td>
                          <Td>SURCO</Td>
                          <Td>BARRANCO</Td>
                          <Td>BARRANCO</Td>
                        </Tr>
                        <Tr>
                          <Td>LOS OLIVOS</Td>
                          <Td> </Td>
                          <Td>LOS OLIVOS</Td>
                          <Td>LOS OLIVOS</Td>
                        </Tr>
                        <Tr>
                          <Td>MAGDALENA</Td>
                          <Td></Td>
                          <Td>MAGDALENA</Td>
                          <Td>MAGDALENA</Td>
                        </Tr>
                        <Tr>
                          <Td>MIRAFLORES</Td>
                          <Td></Td>
                          <Td>MIRAFLORES</Td>
                          <Td>MIRAFLORES</Td>
                        </Tr>
                        <Tr>
                          <Td>PUEBLO LIBRE</Td>
                          <Td></Td>
                          <Td>PUEBLO LIBRE</Td>
                          <Td>PUEBLO LIBRE</Td>
                        </Tr>
                        <Tr>
                          <Td>SAN ISIDRO</Td>
                          <Td></Td>
                          <Td>SAN ISIDRO</Td>
                          <Td>SAN ISIDRO</Td>
                        </Tr>
                        <Tr>
                          <Td>SAN MIGUEL</Td>
                          <Td></Td>
                          <Td>SAN MIGUEL</Td>
                          <Td>SAN MIGUEL</Td>
                        </Tr>
                        <Tr>
                          <Td>SMP</Td>
                          <Td></Td>
                          <Td>SMP</Td>
                          <Td>SMP</Td>
                        </Tr>
                        <Tr>
                          <Td>SURQUILLO</Td>
                          <Td></Td>
                          <Td>SURQUILLO</Td>
                          <Td>SURQUILLO</Td>
                        </Tr>
                        <Tr>
                          <Td> </Td>
                          <Td></Td>
                          <Td>CHORRILLOS</Td>
                          <Td></Td>
                        </Tr>
                      </Tbody>
                    </Table>
                  </TableContainer>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>
        </Flex>
        <Box padding={{ base: "1", md: "8" }} margin="2" bg="" flex="4">
          <Text fontSize="xl">Resumen de Compra</Text>
          <Box
            bg={boxResumenCompraBG}
            paddingX="10"
            borderRadius="lg"
            paddingY="5"
            margin="5">
            <Flex marginY="3" justifyContent="space-between">
              <Text opacity="0.8">Subtotal</Text>
              <Box width="80px" textAlign="end">
                <Text>S/.{costoCarrito.subtotal.toFixed(2)}</Text>
              </Box>
            </Flex>
            <Flex marginY="3" justifyContent="space-between">
              <Text opacity="0.8">Descuento</Text>
              <Box width="80px" textAlign="end">
                <Text>- S/.{costoCarrito.descuento.toFixed(2)}</Text>
              </Box>
            </Flex>
            <Flex marginY="3" justifyContent="space-between">
              <Text opacity="0.8">Envio</Text>
              <Box width="80px" textAlign="end">
                <Text>S/.{envio}</Text>
              </Box>
            </Flex>
            <Divider opacity="1" />
            <Flex marginY="2" justifyContent="space-between">
              <Text fontSize="lg" fontWeight="bold">
                Total
              </Text>
              <Box width="80px" textAlign="end">
                <Text>S/.{costoCarrito.total}</Text>
              </Box>
            </Flex>
          </Box>
          <Box paddingLeft={{ base: "1", md: "8" }} flex="4">
            <>
              {productos.length >= 1 && (
                <Button
                  onClick={() => {
                    Validation()
                  }}
                  leftIcon={<BiPurchaseTag />}
                  bg="blue.700"
                  color="white"
                  variant="solid"
                  _hover={{ bg: buttonColorHover }}>
                  <Text fontSize="lg">Realizar Pago</Text>
                </Button>
              )}
              {productos.length < 1 && (
                <Button
                  onClick={onOpen}
                  leftIcon={<BiPurchaseTag />}
                  bg="blue.700"
                  color="white"
                  variant="solid"
                  _hover={{ bg: buttonColorHover }}>
                  <Text fontSize="lg">Realizar Pago</Text>
                </Button>
              )}
            </>
          </Box>
        </Box>
      </Flex>
      <Modal size="xl" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Alerta!!</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Alert status="error">
              <AlertIcon />
              <AlertTitle mr={2}>Agregar producto</AlertTitle>
              <AlertDescription>para poder seguir comprando</AlertDescription>
            </Alert>
          </ModalBody>

          <ModalFooter>
            <Link to="">
              <Button
                mt="5"
                leftIcon={<BiStore />}
                colorScheme="teal"
                variant="solid"
                _hover={{ bg: buttonarritoVacioBG }}>
                Ir a la tienda
              </Button>
            </Link>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal size="xl" isOpen={isOpenAlert} onClose={onCloseAlert} closeOnOverlayClick={false}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Realizando Proceso de Validacion</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {!validate ? (
              item.length > 0 ?
                <Alert status='error' fontFamily={"Roboto"}>
                  <AlertIcon />
                  <Box>
                    <AlertTitle>Producto Ocupado</AlertTitle>
                    <AlertDescription>
                      Alguno de los productos que desea comprar se encuentran en otro proceso de compra
                      o ya fueron comprado espere o reemplace los siguientes productos:
                      {/* JSON.stringify(item) */
                        item.map((val: any) =>
                          <>
                            <Text>- <b>{val.PRO_NAME}</b> con un precio de <b>{val.PRO_PRICE}</b> ({val.PRO_WEIGHT})</Text>
                          </>)
                      }
                    </AlertDescription>
                  </Box>
                </Alert>
                :
                <Alert status='success'>
                  <AlertIcon />
                  <Box>
                    <AlertTitle>Productos Confirmados</AlertTitle>
                    <AlertDescription>
                      Ya esta cerca de terminar su compra
                    </AlertDescription>
                  </Box>
                </Alert>

            ) : (
              <Center>
                <IsLoading />
              </Center>
            )}
          </ModalBody>
          <ModalFooter>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

const ModalValidation = (loading: any, items: any) => {
  console.log(items);

  return
}