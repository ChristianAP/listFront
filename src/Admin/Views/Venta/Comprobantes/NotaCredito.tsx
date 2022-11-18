import { Alert, AlertIcon } from "@chakra-ui/alert";
import { Button } from "@chakra-ui/button";
import { useDisclosure } from "@chakra-ui/hooks";
import { Box, Center, Divider, Flex, Spacer, Text } from "@chakra-ui/layout";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/modal";
import { Select } from "@chakra-ui/select";
import { Spinner } from "@chakra-ui/spinner";
import { Table, Tbody, Th, Thead, Tr } from "@chakra-ui/table";
import React from "react";
import { Td } from "../../../UI/Components/MyTable";

export const NotaCredito = ({ venta, action }: { venta: any, action: any }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  let [cargaEnviado, SetCargaEnviado] = React.useState(false);
  let [despuesCarga, SetdespuesCarga] = React.useState(false);
  let [productos, SetProductos] = React.useState([]);
  let [tipoNota, SetTipoNota] = React.useState({
    DCT_ID: 0,
    DCT_NAME: "",
    DCT_SERIE: "",
    DCT_SEQUENCE: 0,
  });
  let [mensaje, SetMensaje] = React.useState({
    alertStatus: "info",
    alertMessage: "recabando información",
    mensaje1: "",
    mensaje2: "",
    mensaje3: "",
  });
  const getFecha = () => {
    let hoy = new Date();
    //return hoy.getDate() + "-" + (hoy.getMonth() + 1) + "-" + hoy.getFullYear();
    return hoy.getFullYear() + "-" + (hoy.getMonth() + 1) + "-" + hoy.getDate()
  };
  async function GetTipoNota(DOC_TIPO: string) {
    let tipo = "";
    if (DOC_TIPO == "BOLETA") {
      tipo = "boleta";
    } else if (DOC_TIPO == "FACTURA") {
      tipo = "factura";
    }
    const res = await fetch(
      import.meta.env.VITE_APP_API + "/document_type/notacredito/" + tipo
    ); //falta

    const data = await res.json();
    return data;
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
  async function InsertCreditNote(doc: any) {
    try {
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(doc),
      };
      const res = await fetch(
        import.meta.env.VITE_APP_API_SUNAT + "/api/notaCredito",
        requestOptions
      ); //falta
      const data = await res.json();
      return data;
    } catch (Error) {
      return Error;
    }
  }
  async function createCreditNote(datos: any) {
    try {
      let ruta = "";

      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos),
      };
      const res = await fetch(
        import.meta.env.VITE_APP_API + "/document/create",
        requestOptions
      ); //falta

      const data = await res.json();
      return data;
    } catch (Error) {
      return Error;
    }
  }
  const getStockChange = () => {
    let changeStock: any[] = [];
    productos.map((producto: any) => {
      changeStock.push({
        STK_ID: producto.STK_ID,
        SDT_AMOUNT: producto.SDT_AMOUNT, //CANTIDAD VENDIDA
      });
    });
    return changeStock;
  };
  const getProductosTabla = () => {
    let productosTabla: any[] = [];
    productos.map((producto: any) => {
      productosTabla.push({
        DOC_ID: 0,
        PRO_ID: producto.PRO_ID, //ID DEL PRODUCTO
        DIS_ID: producto.DIS_ID, //ID DEL DESCUENTO sv_discount, PUEDE SER NULO
        SDT_CODE: producto.SDT_CODE, //CODIGO DEL PRODUCTO
        SDT_AMOUNT: producto.SDT_AMOUNT, //CANTIDAD VENDIDA
        SDT_DESCRIPTION: producto.SDT_DESCRIPTION, //DESCRIPCION DEL PRODUCTO
        SDT_PRICE: producto.SDT_PRICE, //PRECIO DEL PRODUCTO
        SDT_SUBTOTAL: producto.SDT_SUBTOTAL, //CANTIDAD * PRECIO
        SDT_DISCOUNT: producto.SDT_DISCOUNT, //DESCUENTO DEL PRODUCTO
        SDT_TOTAL: producto.SDT_TOTAL, //SUBTOTAL - DESCUENTO
        SDS_DAYS_TO_SEND: 0, //FECHA DE CREACIÓN
        SDS_DATA: getFecha(), //FECHA DE CREACIÓN
        
        //SE MANTIENE POR DEFAULT
        SDS_STATUS: "1", //SIEMPRE 1
      });
    });
    return productosTabla;
  };
  function enviar() {
    //al momento de enviar
    SetCargaEnviado(true);
    SetdespuesCarga(false);
    //armado de json y envío

    //tipo doc

    //CARGADO DE PRODUCTOS
    let products: any = [];
    productos.map((element: any) => {
      products.push({
        codigo: element.SDT_CODE,
        unidad: "NIU",
        descripcion: element.SDT_DESCRIPTION,
        cantidad: element.SDT_AMOUNT,
        mtoBaseIgv: (parseFloat(element.SDT_TOTAL) / 1.18).toFixed(2),
        porcentajeIgv: 18.0,
        igv:
          (parseFloat(element.SDT_TOTAL) - parseFloat(element.SDT_TOTAL) / 1.18).toFixed(2),
        tipAfeIgv: "10",
        totalImpuestos:
          (parseFloat(element.SDT_TOTAL) - parseFloat(element.SDT_TOTAL) / 1.18).toFixed(2),
        valorVenta: (parseFloat(element.SDT_TOTAL) / 1.18).toFixed(2),
        valorUnitario:
          ((parseFloat(element.SDT_PRICE) -
            parseFloat(element.SDT_DISCOUNT) / parseFloat(element.SDT_AMOUNT)) /
            1.18).toFixed(2),
        precioUnitario:
          (parseFloat(element.SDT_PRICE) -
            parseFloat(element.SDT_DISCOUNT) / parseFloat(element.SDT_AMOUNT)).toFixed(2),
      });
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
    // TIPO DOCUMENTO REFERNCIA
    let tipoDocDoc = "0";
    if (venta.DOC_DOC_TYPE.trim() == "BOLETA") {
      tipoDocDoc = "03";
    } else if (venta.DOC_DOC_TYPE.trim() == "FACTURA") {
      tipoDocDoc = "01";
    }

    let comp = {
      idDocument: venta.DOC_ID,
      envioSunat: 2,
      cliente: {
        id: 5,
        tipoDoc: tipoDoc,
        numDoc: venta.DOC_ID_CLIENT,
        razonSocial: venta.DOC_BUSINESS_NAME,
      },
      tipoDocumento: {
        id: 15,
        tipoDoc: "07",
        serie: tipoNota.DCT_SERIE,
        numSerie: tipoNota.DCT_SEQUENCE,
      },
      documentoReferencia: {
        id: 15,
        tipoDoc: tipoDocDoc,
        codMotivo: "01",
        serie: venta.DOC_SERIE,
        correlativo: venta.DOC_NUMBER.toString(),
      },
      metodoPago: {
        id: 5,
      },
      tipoVenta: {
        id: 5,
      },
      empresaAddress: {
        id: 5,
        ubigeo: "150101",
        departamento: "LIMA",
        provincia: "LIMA",
        distrito: "LIMA",
        urbanizacion: "-",
        direccion: "AV PUNOYORK",
      },
      empresaDatos: {
        ruc: "20000000001",
        razonSocial: "EMPRESA SAC",
        nombreComercial: "EMPRESA",
      },
      productosTotal: {
        descuentoTotal: 0,
        totalIgv: ((parseFloat(venta.DOC_NETO) / 1.18) * 0.18).toFixed(2),
        precioNeto: (venta.DOC_NETO).toFixed(2),
        operacionGravada: (parseFloat(venta.DOC_NETO) / 1.18).toFixed(2),
      },
      productos: products,
    };
    InsertCreditNote(comp).then((result: any) => {
      // cuando hay respuesta
      SetCargaEnviado(false);
      SetdespuesCarga(true);
      if (result[0] == "ACEPTADO") {
        //agregar documento 
        let newcomp = {
          //MODELO DEL JSON QUE DEBE TOMAR LA VARIABLE doc ||||||||| NO MODIFICAR ESTA VARIABLE
          document: {
            //ESTO SE DEJA POR DEFAULT EN PAGO AL CONTADO
            PMT_ID: 5, // METODO DE PAGO DE LA TABLA sv_payment_method

            //VALOR CAMBIA
            DCT_ID: tipoNota.DCT_ID, //TIPO DE DOCUMENTO DE LA TABLA sv_document_type [FACTURA, BOLETA]
            //default
            SLT_ID: 5, //TIPO DE VENTA DE LA TABLA sv_sales_type [VENTA FISICA, VENTA ONLINE]

            //ESTO SE DEJA EN DEFAULT
            XCR_ID: 5, //NO SE QUE VAINA ES, SOLO PONLE 5
            BUS_ID: 5, //DATOS DEL NEGOCIO CON EL QUE SE ESTÁ VENDIENDO

            //CAMBIA - DATOS CLIENTE
            PER_ID: venta.PER_ID == 0 ? null : venta.PER_ID, //dato del cliente
            DOC_ID_CLIENT: venta.DOC_ID_CLIENT, //EL ID DEL CLIENTE YA SEA DNI O RUC
            DOC_BUSINESS_NAME: venta.DOC_BUSINESS_NAME, //NOMBRE DEL CLIENTE O SU RAZON SOCIAL
            DOC_DIRECTION_CLIENT: venta.DOC_DIRECTION_CLIENT, //DIRECCION DEL CLIENTE
            //CAMBIA - DATOS DOCUMENTO
            DOC_DOC_TYPE: "NOTA DE CREDITO", //SI ES FACTURA, BOLETA O NOTA DE CREDITO
            DOC_SERIE: tipoNota.DCT_SERIE, //CODIGO SERIE DEL COMPROBANTE
            DOC_NUMBER: tipoNota.DCT_SEQUENCE, //NUMERO QUE ACOMPAÑA A LA SERIE, ES EL CORRELATIVO
            //CAMBIA - DATOS DOCUMENTO - TOTAL
            DOC_SUBTOTAL: venta.DOC_SUBTOTAL, //EL TOTAL DEL SUBTOTAL SIN IGV SIN EL DESCUENTO
            DOC_DISCOUNT: venta.DOC_DISCOUNT, //EL TOTAL DEL DESCUENTO
            DOC_TAXED: venta.DOC_TAXED, //TOTAL DEL SUBTOTAL SIN IGV CON DESCUENTO
            //SE DEJA EN 0.00
            DOC_INAFECT: venta.DOC_INAFECT, //TOTAL DE INAFECTO
            DOC_RELEASED: venta.DOC_RELEASED, //TOTAL QUE EXONERA IGV
            //CAMBIA
            DOC_IGV: venta.DOC_IGV, //IGV DEL DOC_TAXED
            DOC_NETO: venta.DOC_NETO, //DOC_TAXED + DOC_IGV
            DOC_URLUBICATION: result[4],
            //CAMBIA - ESTADO DOCUMENTO
            DOC_STATUS: "ACEPTADO", //HAY 2 ESTADO [CREADO,ACEPTADO ]
            DOC_DATE: getFecha(),
          },
          sales_description: getProductosTabla(),
          stock: getStockChange(),
        };
        SetMensaje({
          alertStatus: "success",
          alertMessage: "Comprobante enviado y verificado, guardando nota de crédito",
          mensaje1: result[0],
          mensaje2: result[1],
          mensaje3: result[2],
        });
        createCreditNote(newcomp).then((result) => {
          if (result.status == 200) {
            action();
            SetMensaje({
              alertStatus: "success",
              alertMessage: "la nota de crédito a sido verificada y guardada",
              mensaje1: "",
              mensaje2: "",
              mensaje3: "creado",
            });
          } else {
            SetMensaje({
              alertStatus: "error",
              alertMessage: "no se pudo guardar la nota de crédito, intente nuevamente",
              mensaje1: "",
              mensaje2: "",
              mensaje3: "",
            });
          }
        })

      } else {
        if (result.length == 4) {
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
            mensaje1: result.length >= 2 ? result[1] : "ningún mensaje",
            mensaje2: "ningún mensaje",
            mensaje3: "ningún mensaje",
          });
        }
      }
    });
  }

  function OpenModal() {
    GetTipoNota(venta.DOC_DOC_TYPE).then((result: any) => {
      SetTipoNota({
        ...result,
        //@ts-ignore
        DCT_SEQUENCE: parseInt(result.DCT_SEQUENCE) + 1,
      });
      SetCargaEnviado(false);
      SetdespuesCarga(false);
      onOpen();
      getProductosByVenta().then((result) => {
        SetProductos(result);
      });
    });
  }
  return (
    <>
      <Button
        display={venta.DOC_STATUS.includes("ACEPTADO") && venta.DOC_DOC_TYPE != "NOTA DE CREDITO" && venta.DOC_ID_CLIENT != "00000000" ? "block" : "none"}
        onClick={OpenModal}
      >
        Generar N.C.
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size="4xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Generar nota de crédito</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {/**config nota credito */}
            <Box marginBottom="5px">
              <Flex>
                <Spacer />
                <Box marginInline="5px">
                  <Text>Tipo nota de crédito</Text>
                  <Select>
                    <option value="1">Anulación de comprobante</option>
                  </Select>
                </Box>
                <Spacer />

                <Box>
                  <Text>
                    {" "}
                    <b>Fecha:</b>
                  </Text>
                  <Text>{getFecha()}</Text>
                </Box>
                <Spacer />
                <Box marginInline="5px" border="1px" borderColor="gray.200">
                  <Text align="center" padding="10px">
                    {tipoNota.DCT_NAME} ELECTRÓNICA
                  </Text>
                  <Divider />
                  <Text align="center" padding="10px">
                    {tipoNota.DCT_SERIE} - {tipoNota.DCT_SEQUENCE}
                  </Text>
                </Box>
                <Spacer />
              </Flex>
            </Box>
            {/**CLIENTE */}
            <Box margin="10px">
              <Text>
                <b>Cliente:</b>
                {venta.DOC_BUSINESS_NAME}
              </Text>
              <Text>
                <b>ID Clinte:</b> {venta.DOC_ID_CLIENT}
              </Text>
              <Text>
                {" "}
                <b>Dirección:</b> {venta.DOC_DIRECTION_CLIENT}
              </Text>
            </Box>

            <Divider />
            {/**Productos */}
            <Box>
              <Table variant="striped" colorScheme="teal">
                <Thead>
                  <Tr>
                    <Th>COD</Th>
                    <Th>Descripción</Th>
                    <Th>Cantidad</Th>
                    <Th>Precio</Th>
                    <Th>Subtotal</Th>
                    <Th>descuento</Th>
                    <Th>Total</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {productos.map((product: any) => {
                    return (
                      <Tr>
                        <Td>{product.SDT_CODE}</Td>
                        <Td>{product.SDT_DESCRIPTION}</Td>
                        <Td>{product.SDT_AMOUNT.toFixed(4)}</Td>
                        <Td>{product.SDT_PRICE.toFixed(4)}</Td>
                        <Td>{product.SDT_SUBTOTAL.toFixed(4)}</Td>
                        <Td>{product.SDT_DISCOUNT.toFixed(4)}</Td>
                        <Td>{product.SDT_TOTAL.toFixed(4)}</Td>
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
            </Box>

            <Spacer></Spacer>

            {/**informacion venta */}
            <Flex>
              <Spacer />
              <Box
                width="150px"
                border="1px"
                borderColor="teal.100"
                padding="5px"
              >
                <Text align="right">GRAVADA:</Text>
                <Text align="right">INAFECTA:</Text>
                <Text align="right">EXONERADA:</Text>
                <Text align="right">IGV:</Text>
                <Text align="right">TOTAL:</Text>
              </Box>
              <Box
                width="100px"
                border="1px"
                borderLeftWidth="0px"
                padding="5px"
                borderColor="teal.100"
              >
                <Text align="right">{venta.DOC_TAXED.toFixed(4)}</Text>
                <Text align="right">{venta.DOC_INAFECT.toFixed(4)}</Text>
                <Text align="right">{venta.DOC_RELEASED.toFixed(4)}</Text>
                <Text align="right">{venta.DOC_IGV.toFixed(4)}</Text>
                <Text align="right">{venta.DOC_NETO.toFixed(4)}</Text>
              </Box>
            </Flex>
            {/**Información envío*/}
            <Box display={cargaEnviado ? "block" : "none"}>
              <Center>
                <Spinner size="lg" color="red.500" />
              </Center>
              <Text align="center">Generando Nota de Crédito...</Text>
            </Box>
            <Box display={despuesCarga ? "block" : "none"}>
              <Alert
                //@ts-ignore
                status={mensaje.alertStatus}>
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
          </ModalBody>

          <ModalFooter>
            <Box display={cargaEnviado ? "none" : "block"}>
              <Flex>
                <Button colorScheme="blue" mr={3} onClick={onClose}>
                  Cerrar
                </Button>
                <Button
                  colorScheme="green"
                  onClick={enviar}
                  display={despuesCarga ? "none" : "block"}
                >
                  Generar Nota de crédito
                </Button>
              </Flex>
            </Box>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
