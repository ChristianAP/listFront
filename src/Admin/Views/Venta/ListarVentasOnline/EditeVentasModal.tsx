import {
  Accordion,
  AccordionButton,
  AccordionPanel,
  AccordionItem,
  Drawer,
  DrawerOverlay,
  useDisclosure,
  DrawerBody,
  DrawerHeader,
  DrawerContent,
  Box,
  Text,
  Center,
  Flex,
  Button,
  Image,
  IconButton,
  FormControl,
  Badge,
  useToast,
  DrawerCloseButton,
} from "@chakra-ui/react";
import React, { ReactNode, useState } from "react";
import { BsFileEarmarkMinus, BsPlusSquareFill } from "react-icons/bs";
import { IoPrintSharp, IoDownloadSharp, IoMail } from "react-icons/io5";
import { useMutation, useQueryClient } from "react-query";
import { useRecoilState, useSetRecoilState } from "recoil";
import { listaSaleOnline } from "../../../../Data/Atoms/SaleOnline";
import { ListForDocument } from "../../../../Service/PersonService";
import {
  ChangeOrderState,
  deleteOrder,
  getDocumentForSaleOnline,
  ListProductsSalesOnline,
  VerifyVoucherOrder,
} from "../../../../Service/Sales";
import {
  SendMail,
  SendMailRejectedVoucher,
} from "../../../../Service/SendMailService";
import api from "../RealizarVenta/ApiVentas";
import { CambiarEstado } from "./CambiarEstado";
import { DonwloadPDF } from "./DonwloadPDF";
import { TablaProductosVentasOnline } from "./TablaProductos";
import { AdminState } from "../../../../Data/Atoms/Admin";
import { Tooltip } from "@chakra-ui/react";

import success from "./assets/images/success.gif";
import denied from "./assets/images/denied.gif";
import noimage from "../../../UI/Assets/images/noimage.png";
import { VerficationOptions } from "./VerificationOptions/VerificationOptions";
import { VerifiedVoucher } from "./VerifiedVoucher/VerifiedVoucher";
import { DescriptionOrder } from "./Description/DescriptionOrder";
import { closeAlert } from "../../../../Service/TiendaOnlineService";

const getFecha = () => {
  let hoy = new Date();
  return hoy.getFullYear() + "-" + (hoy.getMonth() + 1) + "-" + hoy.getDate();
};

export const EditVentasModal = ({
  children,
  venta,
}: {
  children: ReactNode;
  venta?: any;
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [aprobacion, statusaprobacion] = useState(venta.APROBACION);
  const [donwload, statusdownload] = useState(
    venta.APROBACION === "1" ? false : true
  );
  const [admin, setAdmin] = useRecoilState(AdminState);
  const [imagen, setImage] = useState(
    venta.VOUCHER == null ? noimage : venta.VOUCHER
  );
  const [loadingSend, setLoadinSend] = useState(false);
  const queryClient = useQueryClient();
  const company: any = queryClient.getQueryData("company");
  const { mutate, isLoading: isLoadingM } = useMutation(ChangeOrderState, {
    mutationKey: "stateMutation",
  });

  const { mutateAsync, isLoading } = useMutation(deleteOrder)
  const { mutateAsync: closeAlertAsync, isLoading: isLoadingClose } = useMutation(closeAlert)

  const toast = useToast();

  const updated = useSetRecoilState(listaSaleOnline);
  function mutateM(
    state: number,
    orderId: number,
    correo: string,
    nombre: string
  ) {
    // mutate({ ORD_ID: orderId, ORD_STATUS: state, correo, nombre });
    mutate({ ...venta,  ESTADO : state, ORD_ID : orderId});
  }

  async function sendEmail(wtogo: string) {
    let getPersonForDocument = await ListForDocument(venta.IDCLIENT);
    let productsArray = await ListProductsSalesOnline(venta.PEDIDO);
    setLoadinSend(true);
    let resSendEmail;
    if (wtogo === "Aceptar") {
      resSendEmail = await SendMail(venta);
    } else if (wtogo === "Rechazar") {
      resSendEmail = await SendMailRejectedVoucher(venta);
    }

    if (resSendEmail.status == 200) {
      setLoadinSend(false);
      return toast({
        position: "bottom-left",
        title: "Email enviado correctamente.",
        description: "El email fue enviado correctamente.",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    } else {
      setLoadinSend(false);
      return toast({
        position: "bottom-left",
        title: "Falló el envio de mensaje",
        description: "Intentelo mas tarde cuando el servicio se restablesca",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
    console.log(venta);
    console.log(productsArray);
    
    
  }

  async function confirmar() {
    let getPersonForDocument = await ListForDocument(venta.IDCLIENT);
    let productsArray = await ListProductsSalesOnline(venta.PEDIDO);
    let comprobanteSeleccionado = await getDocumentForSaleOnline(
      getPersonForDocument.DNI && getPersonForDocument.DNI.length > 0 ? 5 : 15
    );

    if (!getPersonForDocument.message) {
      const saleProduct: any = [];
      const stockProduc: any = [];
      /* saleProduct.push({
        DOC_ID: 0,
        PRO_ID: 27,
        DIS_ID: null,
        SDT_CODE: "DELIVERY",
        SDT_AMOUNT: 1,
        SDT_DESCRIPTION: "DELIVERY",
        SDT_PRICE: company.COM_DELIVERY_PRICE,
        SDT_SUBTOTAL: company.COM_DELIVERY_PRICE,
        SDT_DISCOUNT: 0,
        SDT_TOTAL: company.COM_DELIVERY_PRICE,
        SDS_DAYS_TO_SEND: "DELIVERY",
        SDT_DATE: getFecha(),
        SDS_STATUS: "1",
      }); */
      productsArray.map((values: any, idx: any) => {
        saleProduct.push({
          DOC_ID: 0,
          PRO_ID: values.PRO_ID,
          DIS_ID: null,
          SDT_CODE: values.PRO_CODE,
          SDT_AMOUNT: values.CANTIDAD,
          SDT_DESCRIPTION: values.PRODUCTO,
          SDT_PRICE: values.PRECIO / values.CANTIDAD, // CALCULAMOS EL PRECIO UNITARIO A BASE DE LA CANTIDAD Y LE PRECIO QUE SALIO
          SDT_SUBTOTAL: (values.PRECIO / values.CANTIDAD) * values.CANTIDAD,
          SDT_DISCOUNT:
            (values.PRECIO / values.CANTIDAD) * values.CANTIDAD -
            values.SUBTOTAL,
          SDT_TOTAL: values.SUBTOTAL,
          SDS_DAYS_TO_SEND: values.ODT_DAYS_TO_SENDE,
          SDT_DATE: getFecha(),
          SDS_STATUS: "1",
        });
      });
      productsArray.map((values: any, idx: any) => {
        stockProduc.push({
          STK_ID: values.STK_ID,
          SDT_AMOUNT: values.CANTIDAD,
        });
      });
      console.log(productsArray, saleProduct);

      let dataVenta = {
        document: {
          PMT_ID: 5,
          DCT_ID:
            getPersonForDocument.DNI && getPersonForDocument.DNI.length > 0
              ? 5
              : 15,
          SLT_ID: 15,
          XCR_ID: 5,
          BUS_ID: 5,
          PER_ID: venta.IDCLIENT,
          DOC_ID_CLIENT:
            getPersonForDocument.DNI == ""
              ? getPersonForDocument.RUC
              : getPersonForDocument.DNI,
          DOC_BUSINESS_NAME: getPersonForDocument.TRADENAME
            ? getPersonForDocument.TRADENAME
            : getPersonForDocument.NOMBRE,
          DOC_DIRECTION_CLIENT: getPersonForDocument.DIRECTION,
          DOC_DOC_TYPE: comprobanteSeleccionado.DCT_NAME,
          DOC_SERIE: comprobanteSeleccionado.DCT_SERIE,
          DOC_NUMBER: comprobanteSeleccionado.DCT_SEQUENCE,
          DOC_SUBTOTAL: parseFloat(venta.TOTAL) + parseFloat(venta.DESCUENTO),
          DOC_SUB_SUBTOTAL:
            (parseFloat(venta.TOTAL) + parseFloat(venta.DESCUENTO)) / 1.18,
          DOC_SUB_DISCOUNT: parseFloat(venta.DESCUENTO),
          DOC_DISCOUNT: 0,
          DOC_DATE: getFecha(),
          DOC_TAXED:
            (parseFloat(venta.TOTAL) + parseFloat(venta.DESCUENTO)) / 1.18,
          DOC_INAFECT: 0.0,
          DOC_RELEASED: 0.0,
          DOC_IGV: venta.IGV,
          DOC_NETO: venta.TOTAL,
          DOC_STATUS: "CREADO",
          DOC_METODO_PAGO : venta.METODO_PAGO
        },
        sales_description: saleProduct,
        stock: stockProduc,
      };
      api.ventas.addDocument(dataVenta).then(async(result) => { 
      
        let verifyVoucher = await VerifyVoucherOrder(venta.PEDIDO, result.lastId, 1, admin.iu);

      });
      sendEmail("Aceptar");
      statusdownload(true);
      updated((val) => !val);
      statusaprobacion("1");
    }
  }

  async function rechazar() {
    let verifyVoucher = await VerifyVoucherOrder(venta.PEDIDO, 0, 2, admin.iu);

    if (verifyVoucher.status == 200) {
      sendEmail("Rechazar");
      statusaprobacion("2");
      updated((val) => !val);
      statusdownload(false);
    }
  }
  async function cancelar() {
    console.log(venta);
    let dataProduct = await ListProductsSalesOnline(venta.PEDIDO);
    console.log(dataProduct);
    var items = []
    for (let i = 0; i < dataProduct.length; i++) {
      const element = dataProduct[i];
      items.push({ ...element, id: element.PRO_ID })
    }
    console.log(items);

    await closeAlertAsync({ orders_detail: items })
    // @ts-ignore
    await mutateAsync(venta.PEDIDO);
    queryClient.invalidateQueries("salesonline")
    onClose()
  }

  return (
    <>
      <div onClick={onOpen}>{children}</div>
      <Drawer onClose={onClose} isOpen={isOpen} size={"xl"}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            <Box>
              <Flex>
                <Text style={{ fontWeight: "bold" }}> Detalle Pedido</Text>
                <Tooltip label='Imprimir'>
                  <IconButton
                    icon={<IoPrintSharp />}
                    aria-label="Imprimir"
                    colorScheme="orange"
                    ml={4}
                    mr={4}
                    disabled={donwload}
                  />
                </Tooltip>
                <DonwloadPDF venta={venta} disabled={donwload}>
                  <Tooltip label='Descargar'>
                    <IconButton
                      icon={<IoDownloadSharp />}
                      aria-label="Descargar"
                      colorScheme="blue"
                      disabled={donwload}
                    />
                  </Tooltip>
                </DonwloadPDF>
              </Flex>
            </Box>
          </DrawerHeader>
          <DrawerBody>
            <Box bg="white" w="100%" color="black">
              <DescriptionOrder
                venta={venta}
                sendEmail={sendEmail}
                loadingSend={loadingSend}
              />
              <BoxInfo>
                <CambiarEstado
                  sale={venta}
                  isLoading={isLoadingM}
                  mutateM={mutateM}
                  aprobacion={venta.APROBACION}
                />
              </BoxInfo>
              <Box
                bg="white"
                w="100%"
                mt={4}
                color="black"
                border="1px solid gray"
              >
                <TablaProductosVentasOnline idOrder={venta.PEDIDO} />
              </Box>
              <Box
                bg="white"
                w="100%"
                mt={4}
                color="black"
                border="1px solid gray"
              >
                <Accordion allowMultiple>
                  <AccordionItem>
                    {({ isExpanded }) => (
                      <>
                        <AccordionButton>
                          <VerifiedVoucher
                            aprobacion={aprobacion}
                            voucher={venta.VOUCHER}
                          />
                          {isExpanded ? (
                            <BsFileEarmarkMinus fontSize="12px" />
                          ) : (
                            <BsPlusSquareFill fontSize="12px" />
                          )}
                        </AccordionButton>
                        <AccordionPanel>
                          {aprobacion == "0" && venta.VOUCHER !== null ? (
                            <Box>
                              <BoxView>
                                <VerficationOptions
                                  confirmar={confirmar}
                                  rechazar={rechazar}
                                  cancelar={cancelar}
                                />
                              </BoxView>
                              <BoxView>
                                <Center h="100%" w="100%">
                                  <Image
                                    src={imagen}
                                    alt="Voucher"
                                    objectFit="contain"
                                    boxSize="600px"
                                  />
                                </Center>
                              </BoxView>
                            </Box>
                          ) : aprobacion == "1" ? (
                            <>
                              <BoxView>
                                <Center mb={2}>
                                  <Badge backgroundColor={"white"} p={1}>
                                    <Center>
                                      <img
                                        src={success}
                                        alt=""
                                        sizes={"100"}
                                        width={"100"}
                                      />
                                      - Voucher verificado y aprobado
                                      <br />- Aprobado por {venta.APROBADOR}
                                    </Center>
                                  </Badge>
                                </Center>
                              </BoxView>
                              <BoxView>
                                <Center h="100%" w="100%">
                                  <Image
                                    src={imagen}
                                    alt="Voucher"
                                    objectFit="contain"
                                    boxSize="600px"
                                  />
                                </Center>
                              </BoxView>
                            </>
                          ) : (
                            <>
                              <BoxView>
                                <Center mb={2}>
                                  <Badge backgroundColor={"white"} p={1}>
                                    <Center>
                                      <img
                                        src={denied}
                                        alt=""
                                        sizes={"100"}
                                        width={"100"}
                                      />
                                      - Voucher Rechazado
                                      <br />- Rechazado por {venta.APROBADOR}
                                    </Center>
                                  </Badge>
                                </Center>
                              </BoxView>
                              <BoxView>
                                <Center h="100%" w="100%">
                                  <Image
                                    src={imagen}
                                    alt="Voucher"
                                    objectFit="contain"
                                    boxSize="600px"
                                  />
                                </Center>
                              </BoxView>
                            </>
                          )}
                        </AccordionPanel>
                      </>
                    )}
                  </AccordionItem>
                </Accordion>
              </Box>
              <FormControl>
                <Box bg="white" w="100%" pl={4} pr={4} mt={4} color="black">
                  <Button onClick={onClose}>Cerrar</Button>
                </Box>
              </FormControl>
            </Box>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export const BoxInfo = ({ children }: { children: ReactNode }) => {
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

export const BoxView = ({ children }: { children: ReactNode }) => {
  return (
    <Box bg="white" p={2} m={2} border="1px solid gray" height={"auto"}>
      {children}
    </Box>
  );
};
