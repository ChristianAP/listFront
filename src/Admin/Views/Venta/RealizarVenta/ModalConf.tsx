import {
  Alert,
  AlertIcon,
  AlertDescription,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  Button,
  Input,
  Box,
  Text,
  Link,
  InputGroup,
  InputRightElement,
  Center,
  useDisclosure,
  Spinner,
  ModalBody,
  useToast,
  ModalFooter,
} from "@chakra-ui/react";
import React from "react";
import api from "./ApiVentas";
import { getFecha } from "./RealizarVenta";

export const ModalConf = (props: any) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const messageToast = useToast();
  let [loadSend, SetLoadSend] = React.useState(true);
  let [messageOfSended, SetMessageOfSended] = React.useState({
    message: "cargando información",
    status: 100,
    lastId: 0,
  });
  let [comprobanteCodigo, SetComprobanteCodigo] = React.useState("");
  const getProductosTabla = () => {
    let productosTabla: any[] = [];
    props.vistaDescripcion.map((producto: any) => {
      productosTabla.push({
        DOC_ID: 0,
        PRO_ID: producto.PRO_ID, //ID DEL PRODUCTO
        DIS_ID: producto.DIS_ID, //ID DEL DESCUENTO sv_discount, PUEDE SER NULO
        SDT_CODE: producto.PRO_CODE, //CODIGO DEL PRODUCTO
        SDT_AMOUNT: producto.cantidad, //CANTIDAD VENDIDA
        SDT_DESCRIPTION: producto.PRO_NAME, //DESCRIPCION DEL PRODUCTO
        SDT_PRICE: producto.precio.toFixed(2), //PRECIO DEL PRODUCTO
        SDT_SUBTOTAL: producto.subtotal.toFixed(2), //CANTIDAD * PRECIO
        SDT_DISCOUNT: producto.descuento.toFixed(2), //DESCUENTO DEL PRODUCTO
        SDT_TOTAL: producto.total.toFixed(2), //SUBTOTAL - DESCUENTO
        SDS_DAYS_TO_SEND: getFecha(), //FECHA DE CREACIÓN
        SDT_DATE: getFecha(),
        //SE MANTIENE POR DEFAULT
        SDS_STATUS: "1", //SIEMPRE 1
      });
    });
    return productosTabla;
  };
  const getStockChange = () => {
    let changeStock: any[] = [];
    props.vistaDescripcion.map((producto: any) => {
      changeStock.push({
        STK_ID: producto.STK_ID,
        SDT_AMOUNT: producto.cantidad, //CANTIDAD VENDIDA
      });
    });
    return changeStock;
  };

  const saveDataVenta = () => {
    SetLoadSend(true);
    //console.log(props.formDetalle, "detalle del documento");

    let dataVenta = {
      //MODELO DEL JSON QUE DEBE TOMAR LA VARIABLE doc ||||||||| NO MODIFICAR ESTA VARIABLE
      document: {
        //ESTO SE DEJA POR DEFAULT EN PAGO AL CONTADO
        PMT_ID: props.formDetalle.metodoPago, // METODO DE PAGO DE LA TABLA sv_payment_method

        //VALOR CAMBIA
        DCT_ID: props.comprobanteSeleccionado.DCT_ID, //TIPO DE DOCUMENTO DE LA TABLA sv_document_type [FACTURA, BOLETA]
        //default
        SLT_ID: 5, //TIPO DE VENTA DE LA TABLA sv_sales_type [VENTA FISICA, VENTA ONLINE]

        //ESTO SE DEJA EN DEFAULT
        XCR_ID: 5, //NO SE QUE VAINA ES, SOLO PONLE 5
        BUS_ID: 5, //DATOS DEL NEGOCIO CON EL QUE SE ESTÁ VENDIENDO

        //CAMBIA - DATOS CLIENTE
        PER_ID: props.formDetalle.PER_ID == 0 ? null : props.formDetalle.PER_ID, //dato del cliente
        DOC_ID_CLIENT: props.formDetalle.idCliente, //EL ID DEL CLIENTE YA SEA DNI O RUC
        DOC_BUSINESS_NAME: props.formDetalle.razonSocial, //NOMBRE DEL CLIENTE O SU RAZON SOCIAL
        DOC_DIRECTION_CLIENT: props.formDetalle.direccion, //DIRECCION DEL CLIENTE
        //CAMBIA - DATOS DOCUMENTO
        DOC_DOC_TYPE: props.comprobanteSeleccionado.DCT_NAME, //SI ES FACTURA, BOLETA O NOTA DE CREDITO
        DOC_SERIE: props.comprobanteSeleccionado.DCT_SERIE, //CODIGO SERIE DEL COMPROBANTE
        DOC_NUMBER: props.comprobanteSeleccionado.DCT_SEQUENCE, //NUMERO QUE ACOMPAÑA A LA SERIE, ES EL CORRELATIVO
        //CAMBIA - DATOS DOCUMENTO - TOTAL
        DOC_SUB_SUBTOTAL:
          (props.total + props.descuentoGeneral + props.descuento) / 1.18,
        DOC_SUB_DISCOUNT: props.descuento,
        DOC_SUBTOTAL: props.total + props.descuentoGeneral + props.descuento, //EL TOTAL DEL SUBTOTAL SIN IGV SIN EL DESCUENTO
        DOC_DISCOUNT: props.descuentoGeneral, //EL TOTAL DEL DESCUENTO
        DOC_TAXED:
          (props.total + props.descuentoGeneral + props.descuento) / 1.18, //TOTAL DEL SUBTOTAL SIN IGV CON DESCUENTO
        //SE DEJA EN 0.00
        DOC_INAFECT: 0.0, //TOTAL DE INAFECTO
        DOC_RELEASED: 0.0, //TOTAL QUE EXONERA IGV

        //CAMBIA
        DOC_IGV:
          ((props.total + props.descuentoGeneral + props.descuento) / 1.18) *
          0.18, //IGV DEL DOC_TAXED
        DOC_NETO: props.total.toFixed(2), //DOC_TAXED + DOC_IGV
        //CAMBIA - ESTADO DOCUMENTO
        DOC_STATUS: "CREADO", //HAY 2 ESTADO [CREADO,ACEPTADO ]
        DOC_DATE: getFecha(),
      },
      sales_description: getProductosTabla(),
      stock: getStockChange(),
    };
    // onOpen();

    //validar productos
    if (getProductosTabla().length == 0) {
      messageToast({
        title: "Datos faltantes",
        description: "No hay productos por vender",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    } else {
      onOpen();
      api.ventas.addDocument(dataVenta).then((result) => {
        SetLoadSend(false);
        if (result.status == 200) {
          SetMessageOfSended({
            ...messageOfSended,
            message: result.message,
            status: result.status,
            lastId: result.lastId,
          });
        } else {
          if (result.status == 500) {
            console.log(result);
            SetMessageOfSended({
              ...messageOfSended,
              message: "error interno [500]",

              status: result.status,
            });
          } else {
            if (result.status == 404) {
              SetMessageOfSended({
                ...messageOfSended,
                message: "Dirección no encontrada [404]",
                status: result.status,
              });
            } else {
              SetMessageOfSended({
                ...messageOfSended,
                message: "error interno",
                status: result.status,
              });
            }
          }
        }
      });
    }
  };
  async function getConfiguracionImpresion() {
    const res = await fetch(import.meta.env.VITE_APP_API + "/config"); //falta
    return res.json();
  }
  function AbrirVentana() {
    getConfiguracionImpresion().then((result: any) => {
      let ruta = import.meta.env.VITE_APP_API_SUNAT_2 + "/impresion/";
      if (result[0].TEM_ID == 5) {
        ruta = ruta + "ventas/" + messageOfSended.lastId;
      } else if (result[0].TEM_ID == 15) {
        ruta = ruta + "ventasticket/" + messageOfSended.lastId;
      }
      let titulo = "Ventar";
      let opciones =
        "toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=0,resizable=0,width=400,height=screen.height,top=0,left=0";

      window.open(ruta, titulo, opciones);
    });
  }
  let [correo, SetCorreo] = React.useState("");
  function EnviarCorreo() {
    let emailRegex =
      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    if (emailRegex.test(correo)) {
      messageToast({
        title: "Estamos enviando el correo",
        description: "El comprobante se está enviando al correo",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
      api.ventas.sendCorreo(messageOfSended.lastId, correo).then((result) => {
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
    } else {
      messageToast({
        title: "Correo no válido",
        description: "Ingrese un correo electrónico",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    }
  }
  return (
    <>
      <Button
        onClick={
          props.comprobanteSeleccionado.DCT_NAME.trim() == "FACTURA"
            ? props.formDetalle.idCliente.length == 11
              ? saveDataVenta
              : () => {
                  messageToast({
                    title: "ID o RUC incorrecto",
                    description: "cambie el RUC ingresado",
                    status: "warning",
                    duration: 3000,
                    isClosable: true,
                  });
                }
            : saveDataVenta
        }
        colorScheme="blue"
        w="100%"
      >
        Generar
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => {}}
        closeOnOverlayClick={false}
        isCentered={true}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirmación del comprobante</ModalHeader>
          <ModalCloseButton onClick={() => {
            location.reload()
          }}/>
          <ModalBody>
            <Box display={loadSend ? "none" : "block"}>
              <Box display={messageOfSended.status == 200 ? "block" : "none"}>
                <h3>
                  Comprobante {props.serie} -{props.numeracion}, A SIDO{" "}
                  <b>CREADA</b>
                </h3>
                <InputGroup size="md">
                  <Input
                    pr="4.5rem"
                    type="gmail"
                    placeholder="Ingrese Correo"
                    value={correo}
                    onChange={(e: any) => {
                      SetCorreo(e.target.value);
                    }}
                  />
                  <InputRightElement width="6rem">
                    <Button h="1.75rem" size="sm" onClick={EnviarCorreo}>
                      Enviar Correo
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </Box>
              <Box display={messageOfSended.status != 200 ? "block" : "none"}>
                <Alert status="error">
                  <AlertIcon />
                  <AlertDescription>{messageOfSended.message}</AlertDescription>
                </Alert>
              </Box>
            </Box>
            <Box display={loadSend ? "block" : "none"}>
              <Center>
                <Spinner
                  thickness="4px"
                  speed="0.65s"
                  emptyColor="gray.200"
                  color="green.500"
                  size="xl"
                />
                <Text>Creando Venta...</Text>
              </Center>
            </Box>
          </ModalBody>

          <ModalFooter>
            <Box display={loadSend ? "none" : "block"}>
              <Box display={messageOfSended.status == 200 ? "block" : "none"}>
                <Link href="/admin/ventas/listar-venta">
                  <Button colorScheme="blue" mr={3}>
                    Ver Listado
                  </Button>
                </Link>
                <Link href="/admin/ventas/realizar-venta">
                  <Button variant="dark" colorScheme="blue">
                    Nueva Venta
                  </Button>
                </Link>

                <Button  variant="ghost" onClick={AbrirVentana}>
                  Imprimir
                </Button>
              </Box>
              <Box display={messageOfSended.status != 200 ? "block" : "none"}>
                <Button colorScheme="blue" mr={3} onClick={onClose}>
                  Cerrar
                </Button>
              </Box>
            </Box>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
