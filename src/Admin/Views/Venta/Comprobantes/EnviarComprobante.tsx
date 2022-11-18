import { Button } from "@chakra-ui/button";
import { useDisclosure } from "@chakra-ui/hooks";
import React from "react";

import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
  Box,
  Spinner,
  Center,
  Text,
  Alert,
  AlertIcon,
  Divider,
  Tooltip,
  IconButton
} from "@chakra-ui/react";
import { BiSend } from "react-icons/bi";
import { FiSend } from "react-icons/fi";

export const Enviar = ({ venta, action }: { venta: any; action: any }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();
  // console.log(venta);

  let [business, SetBusiness] = React.useState([]);
  let [momentoCarga, SetMomentoCarga] = React.useState(false);

  let [mensaje, SetMensaje] = React.useState({
    alertStatus: "info",
    alertMessage: "recabando información",
    mensaje1: "",
    mensaje2: "",
    mensaje3: "",
  });

  async function SendComprobante(datos: any) {
    try {
      let ruta = "";
      if (datos.tipoDocumento.tipoDoc == "01") {
        ruta = "boleta";
      } else if (datos.tipoDocumento.tipoDoc == "03") {
        ruta = "factura";
      }
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos),
      };
      const res = await fetch(
        import.meta.env.VITE_APP_API_SUNAT + "/api/" + ruta,
        requestOptions
      ); //falta

      const data = await res.json();
      return data;
    } catch (Error) {
      return Error;
    }
  }
  async function getProductosByVenta() {

    const typeSale = await fetch(
      import.meta.env.VITE_APP_API + "/document/" + venta.DOC_ID
    ); //falta
    const type = await typeSale.json()
    const res = await fetch(
      import.meta.env.VITE_APP_API + "/sales_description/bysale/" + venta.DOC_ID + "/" + (type.SLT_ID == 15 ? "online" : "fisico")
    ); //falta

    const data = await res.json();
    return data;
  }

  function Enviar() {
    onOpen();
    SetMomentoCarga(true);
    getProductosByVenta().then((result) => {
      let products: any = [];
      result.forEach((element: any) => {

        products.push(
          element.PRO_INAFECT == "0" ? {
            codigo: element.SDT_CODE,
            unidad: "KGM",
            descripcion: element.SDT_DESCRIPTION,
            cantidad: element.SDT_AMOUNT,
            mtoBaseIgv: (element.SDT_SUBTOTAL / 1.18).toFixed(2),
            porcentajeIgv: 18.0,
            igv: ((element.SDT_SUBTOTAL / 1.18) * 0.18).toFixed(2),
            tipAfeIgv: "10",
            totalImpuestos: ((element.SDT_SUBTOTAL / 1.18) * 0.18).toFixed(2),
            valorVenta: (element.SDT_SUBTOTAL / 1.18).toFixed(2),
            valorUnitario: (element.SDT_PRICE / 1.18).toFixed(2),
            precioUnitario: ((element.SDT_TOTAL / element.SDT_AMOUNT)).toFixed(2),
            descuentoItem: [
              {
                codTipoDescuento: "01",
                montoBaseDescuento: (element.SDT_SUBTOTAL / 1.18).toFixed(2),
                factorDescuento: (1.18 * (1 - element.SDT_TOTAL / element.SDT_SUBTOTAL)).toFixed(3),
                montoDescuento: (element.SDT_SUBTOTAL - element.SDT_TOTAL).toFixed(2),
              },
            ],
          } : {
            codigo: element.SDT_CODE,
            unidad: "KGM",
            descripcion: element.SDT_DESCRIPTION,
            cantidad: element.SDT_AMOUNT,
            mtoBaseIgv: element.SDT_SUBTOTAL,
            porcentajeIgv: 0,
            igv: 0,
            tipAfeIgv: "20",
            totalImpuestos: 0,
            valorVenta: element.SDT_SUBTOTAL,
            valorUnitario: element.SDT_PRICE,
            precioUnitario: ((element.SDT_TOTAL / element.SDT_AMOUNT) == Infinity ? (element.SDT_PRICE / 1.18) : (element.SDT_TOTAL / element.SDT_AMOUNT)).toFixed(2),
            descuentoItem: [
              {
                codTipoDescuento: "01",
                montoBaseDescuento: (element.SDT_SUBTOTAL).toFixed(2),
                factorDescuento: ((1 - element.SDT_TOTAL / element.SDT_SUBTOTAL)).toFixed(3),
                montoDescuento: (element.SDT_SUBTOTAL - element.SDT_TOTAL).toFixed(2),
              },
            ],
          }
        );
      });
      let tipoDoc = "0";
      if (venta.DOC_ID_CLIENT == "00000000") {
        tipoDoc = "3";
      } else {
        if (venta.DOC_ID_CLIENT.length == 8) {
          tipoDoc = "1";
        } else if (venta.DOC_ID_CLIENT.length == 11) {
          tipoDoc = "6";
        }
      }
      let tipoDocDoc = "0";
      if (venta.DOC_DOC_TYPE.trim() == "BOLETA") {
        tipoDocDoc = "01";
      } else if (venta.DOC_DOC_TYPE.trim() == "FACTURA") {
        tipoDocDoc = "03";
      } else if (venta.DOC_DOC_TYPE.trim() == "NOTA DE CREDITO") {
        tipoDocDoc = "07";
      }
      let comp = {
        idDocument: venta.DOC_ID,
        envioSunat: 2,
        cliente: {
          id: 5, //dejar
          tipoDoc: tipoDoc, //1 para DNI , 2 para RUC
          numDoc: venta.DOC_ID_CLIENT, //
          razonSocial: venta.DOC_BUSINESS_NAME,
        },
        tipoDocumento: {
          id: 5,
          tipoDoc: tipoDocDoc, // DE LA SUNAT , JALAR DE DOCUMENT_TYPE
          serie: venta.DOC_SERIE,
          numSerie: venta.DOC_NUMBER.toString(),
        },
        metodoPago: {
          id: 5, //SE DEJA
        },
        tipoVenta: {
          id: 5, //SE DEJA
        },
        empresaAddress: {
          id: 5, // SE DEJA
          ubigeo: "150101", //CAMBIAR
          departamento: "LIMA", //CAMBIAR
          provincia: "LIMA", //CAMBIAR
          distrito: "LIMA", //CAMBIAR
          urbanizacion: "-", //CAMBIAR
          direccion: "AV PUNOYORK", //CAMBIAR
        },
        empresaDatos: {
          ruc: "20000000001", // CAMBIAR PERO EN CRUDO
          razonSocial: "EMPRESA SAC", // CAMBIAR PERO EN CRUDO
          nombreComercial: "EMPRESA", // CAMBIAR PERO EN CRUDO
        },
        productosTotal: {
          operacionGravada: Number(venta.DOC_TAXED.toFixed(2)) ,
          montoIgv: venta.DOC_IGV.toFixed(2),
          totalImpuestos: venta.DOC_IGV.toFixed(2),
          valorVenta: venta.DOC_SUB_SUBTOTAL.toFixed(2),
          subTotal: venta.DOC_SUBTOTAL.toFixed(2),
          montoOperExoneradas: venta.DOC_INAFECT.toFixed(2),
          icbper: 0,
          montoImpVenta: venta.DOC_NETO.toFixed(2),
          descuentoTotal: [
            {
              codTipoDescuento: "03",
              montoBaseDescuento: venta.DOC_DISCOUNT.toFixed(3),
              factorDescuento: 1,
              montoDescuento: venta.DOC_DISCOUNT.toFixed(2),
              sumaOtrosDescuentos: (venta.DOC_DISCOUNT + venta.DOC_SUB_DISCOUNT).toFixed(2),
            },
          ],
        },
        productos: products,
      };
      console.log("llego");

      SendComprobante(comp).then((result) => {
        SetMomentoCarga(false);
        if (result[0] == "ACEPTADO") {
          SetMensaje({
            alertStatus: "success",
            alertMessage: "Comprobante enviado y verificado",
            mensaje1: result[0],
            mensaje2: result[1],
            mensaje3: result[2],
          });
        } else {
          if (result.length == 3) {
            SetMensaje({
              alertStatus: "warning",
              alertMessage:
                "Comprobante enviado pero sunat no dió una buena respuesta, es recomendable generar otro comprobante ",
              mensaje1: result[0],
              mensaje2: result[1],
              mensaje3: result[2],
            });
          } else {
            SetMensaje({
              alertStatus: "error",
              alertMessage: "hubo algún error al enviar a sunat",
              mensaje1: result.length >= 2 ? result[1] : "ningun mensaje",
              mensaje2: "ningun mensaje",
              mensaje3: "ningun mensaje",
            });
          }
        }
        //action();
      });
    });
  }
  return (
    <>
      <Tooltip label='Enviar Sunat'>
        <Button
          onClick={Enviar}
          aria-label='Enviar Sunat'
          colorScheme="blue"
          display={venta.DOC_STATUS == "CREADO" ? "block" : "none"}
        >
          <FiSend />
        </Button>
      </Tooltip>
      <AlertDialog
        motionPreset="slideInBottom"
        closeOnOverlayClick={false}
        //@ts-ignore

        leastDestructiveRef={cancelRef}
        closeOnEsc={false}
        onClose={onClose}
        isOpen={isOpen}
        isCentered
      >
        <AlertDialogOverlay />

        <AlertDialogContent>
          <AlertDialogHeader>Envío de comprobante a SUNAT</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            <Box display={momentoCarga ? "block" : "none"}>
              <Center>
                <Spinner color="red.500" />
              </Center>
              <Text align="center"> Enviando Comprobante...</Text>
            </Box>
            <Box display={momentoCarga ? "none" : "block"}>
              <Alert
                //@ts-ignore
                status={mensaje.alertStatus}
              >
                <AlertIcon />
                {mensaje.alertMessage}
              </Alert>
              <Box
                mt="1"
                border="1px"
                borderColor="gray.200"
                borderRadius="10px"
              >
                <Text padding="8px" align="center">
                  {mensaje.mensaje1}
                </Text>
                <Divider />
                <Text padding="8px" align="center">
                  {mensaje.mensaje2}
                </Text>
                <Divider />
                <Text padding="8px" align="center">
                  {mensaje.mensaje3}
                </Text>
              </Box>
            </Box>
          </AlertDialogBody>
          <AlertDialogFooter>
            <Box display={momentoCarga ? "none" : "block"}>
              <Button
                //@ts-ignore
                ref={cancelRef}
                onClick={onClose}
              >
                Cerrar
              </Button>
            </Box>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};