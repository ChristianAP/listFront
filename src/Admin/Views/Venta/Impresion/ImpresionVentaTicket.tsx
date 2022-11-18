import { Button } from "@chakra-ui/button";
import { Image } from "@chakra-ui/image";
import {
  Box,
  Center,
  Divider,
  Flex,
  HStack,
  Spacer,
  Stack,
  StackDivider,
  Text,
  VStack,
} from "@chakra-ui/layout";
import { Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/table";
import React from "react";

import { useMutation, useQuery } from "react-query";
import { Skeleton } from "@chakra-ui/skeleton";
import './print.css';
export const ImpresionVentaTicket = ({
  idventa = null,
  activador = () => { },
}: {
  idventa: any;
  activador: any;
}) => {
  function Print() {
    window.print();
  }

  async function getVentasWithClient() {
    if (idventa != null) {
      // const res = await fetch(import.meta.env.VITE_APP_API + "/sales/saleswithclient/"+idventa); //falta
      const res = await fetch(import.meta.env.VITE_APP_API + "/document/" + idventa);
      return res.json();
    } else {
      return null;
    }
  }
  const { isLoading, isError, data, error } = useQuery(
    "venta",
    getVentasWithClient
  );

  if (isLoading)
    return (
      <Stack>
        <Skeleton height="20px" />
        <Skeleton height="20px" />
        <Skeleton height="20px" />
      </Stack>
    );
  //@ts-ignore
  if (isError) return <h1>{error.message}</h1>;
  // React.useEffect(() => {
  //   activador();
  // })
  return (
    <Box marginLeft={"5"} paddingLeft={"5"}>
      {/* <Button onClick={Print} id="boton"> Imprimir</Button> */}
      <Box w="350px" border="0px" margin="3">
        {/**Info Empresa */}
        <InformacionEmpresa />
        {/**info venta  */}
        <InformacionVenta datos={data} />
        {/**Info cliente  */}
        <InformacionCliente datos={data} />
        {/**Descripcion producto */}
        <InformacionProducto idventa={idventa} />
        {/**Total */}
        <InformacionTotal datos={data} />
      </Box>
    </Box>
  );
};

const InformacionEmpresa = () => {
  async function getEmpresa() {
    // const res = await fetch(import.meta.env.VITE_APP_API + "/sales/saleswithclient/"+idventa); //falta
    const res = await fetch(import.meta.env.VITE_APP_API + "/company/");
    return res.json();
  }
  const { isLoading, isError, data, error } = useQuery("empresa", getEmpresa, {
    refetchOnWindowFocus: false,
  });
  if (isLoading)
    return (
      <Stack>
        <Skeleton height="20px" />
        <Skeleton height="20px" />
        <Skeleton height="20px" />
      </Stack>
    );
  //@ts-ignore
  if (isError) return <h1>{error.message}</h1>;
  return (
    <Box>
      <Center>
        <Image
          src="gibbresh.png"
          fallbackSrc={import.meta.env.VITE_APP_LOGO + "/upload/LOGO%20HORIZONTAL.png"}
        />
      </Center>
      <Text textAlign="center">
        <b>{data[0].COM_COMPANY_NAME}</b>
      </Text>
      <Text textAlign="center">{data[0].COM_ORGANIZATION_DIRECTION} </Text>
      <Text textAlign="center">{data[0].COM_ORGANIZATION_PHONE_ONE}</Text>
      <Text textAlign="center">{data[0].COM_ORGANIZATION_PHONE_THREE} </Text>
    </Box>
  );
};
const InformacionVenta = ({ datos }: { datos: any }) => {
  return (
    <Box>
      <Divider />
      <Text textAlign="center">{datos.DOC_DOC_TYPE} ELECTRÓNICA</Text>
      <Text textAlign="center">
        {datos.DOC_SERIE} - {datos.DOC_NUMBER}
      </Text>
      <Text textAlign="center">{datos.DOC_DATE}</Text>
    </Box>
  );
};
const InformacionCliente = ({ datos }: { datos: any }) => {
  return (
    <Box>
      <Divider />
      <Text textAlign="center">
        <b>Cliente:</b> {datos.DOC_BUSINESS_NAME}
      </Text>
      <Text textAlign="center">
        <b>Dirección:</b> {datos.DOC_DIRECTION_CLIENT}
      </Text>
      <Text textAlign="center">
        <b>Id-Cliente:</b> {datos.DOC_ID_CLIENT}
      </Text>
    </Box>
  );
};
const InformacionProducto = ({ idventa = null }: { idventa: any }) => {
  async function getProductosByVenta() {
    if (idventa != null) {
      const typeSale = await fetch(
        import.meta.env.VITE_APP_API + "/document/" + idventa
      ); //falta
      const type = await typeSale.json();
      // const res = await fetch(import.meta.env.VITE_APP_API + "/sales/saleswithclient/"+idventa); //falta
      const res = await fetch(
        import.meta.env.VITE_APP_API + "/sales_description/bysale/" + idventa + "/" + (type.SLT_ID == 15 ? "online" : "fisico")
      );
      return res.json();
    } else {
      return null;
    }
  }
  const { isLoading, isError, data, error } = useQuery(
    "productos",
    getProductosByVenta,
    { refetchOnWindowFocus: false }
  );
  if (isError) {
    return <h1>No se encuentran datos</h1>;
  }
  if (data != undefined) {
    if (data.hasOwnProperty("status")) {
      if (data.status == 404) {
        return <h1 color="red">No hay datos</h1>;
      }
    }
  }

  if (isLoading) {
    return <h1>Cargando...</h1>;
  }
  return (
    <Box>
      <Flex borderColor="black" borderBottom="1px" borderStyle="dashed">
        <Text>Cant.</Text>
        <Spacer />
        <Text>Precio</Text>
        <Spacer />
        <Text>Subtotal.</Text>
        <Spacer />
        <Text>Desc.</Text>
        <Spacer />
        <Text>Total</Text>
      </Flex>
      {/**Info producto */}
      {data.map((result: any, idx: any) => {
        return (
          <React.Fragment>
            <Text>
              {result.SDT_DESCRIPTION}
            </Text>
            <Flex>
              <Text>{result.SDT_AMOUNT.toFixed(2)}</Text>
              <Spacer />
              <Text>{result.SDT_PRICE.toFixed(2)}</Text>
              <Spacer />
              <Text>{result.SDT_SUBTOTAL.toFixed(2)}</Text>
              <Spacer />
              <Text>{result.SDT_DISCOUNT.toFixed(2)}</Text>
              <Spacer />
              <Text>{result.SDT_TOTAL.toFixed(2)}</Text>
            </Flex>
          </React.Fragment>
        );
      })}
    </Box>
  );
};
const InformacionTotal = ({ datos }: { datos: any }) => {
  return (
    <Box borderTop="1px" borderColor="black">
      <Flex>
        <Text w="70%" align="right">
          Subtotal:
        </Text>
        <Text w="30%" align="right">
          {datos.DOC_SUBTOTAL.toFixed(2)}
        </Text>
      </Flex>
      <Flex>
        <Text w="70%" align="right">
          Descuento:
        </Text>
        <Text w="30%" align="right">
          {datos.DOC_DISCOUNT.toFixed(2)}
        </Text>
      </Flex>
      <Flex>
        <Text w="70%" align="right">
          Grabada:
        </Text>
        <Text w="30%" align="right">
          {datos.DOC_TAXED.toFixed(2)}
        </Text>
      </Flex>
      <Flex>
        <Text w="70%" align="right">
          Exonerada:
        </Text>
        <Text w="30%" align="right">
          {datos.DOC_RELEASED.toFixed(2)}
        </Text>
      </Flex>
      <Flex>
        <Text w="70%" align="right">
          Inafecta:
        </Text>
        <Text w="30%" align="right">
          {datos.DOC_INAFECT.toFixed(2)}
        </Text>
      </Flex>
      <Flex>
        <Text w="70%" align="right">
          IGV:
        </Text>
        <Text w="30%" align="right">
          {datos.DOC_IGV.toFixed(2)}
        </Text>
      </Flex>
      <Flex>
        <Text w="70%" align="right">
          Importe Total:
        </Text>
        <Text w="30%" align="right">
          {datos.DOC_NETO.toFixed(2)}
        </Text>
      </Flex>
      {/**Info venta toal escrita  */}
      <Text>Son {datos.DOC_NETO.toFixed(2)} con 0/100 soles</Text>
      {/**QR */}
      <Center>
        {/*  <Image
          boxSize="150px"
          src="gibbresh.png"
          fallbackSrc="https://static-unitag.com/images/help/QRCode/qrcode.png?mh=07b7c2a2"
        /> */}
      </Center>
      {/**Observaciones */}
      <Text>Observaciones:</Text>
      <Text>
      </Text>
    </Box>
  );
};
