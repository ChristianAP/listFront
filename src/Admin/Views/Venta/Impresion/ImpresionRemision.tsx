import { Image } from "@chakra-ui/image";
import {
  Box,
  Center,
  Divider,
  HStack,
  Spacer,
  Stack,
  StackDivider,
  Text,
  VStack,
} from "@chakra-ui/layout";
import { Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/table";
import React, { useEffect, useState } from "react";

import { useQuery } from "react-query";
import { Skeleton } from "@chakra-ui/skeleton";
import "./print.css";
export const ImpresionRemision = ({
  productos = [],
  idventa = null,
  activador = () => { },
}: {
  productos: any;
  idventa: any;
  activador: any;
}) => {

  let formato = {
    empresa: "",
    infoDoc: "",
    infoCliente: "",
    infoProductos: "",
    infoCostos: "",
  };
  const [total, setTotal] = useState(0)
  async function getRemissionDetail() {
    if (idventa != null) {
      const res = await fetch(import.meta.env.VITE_APP_API + "/remission/" + idventa);
      return res.json();
    } else {
      return null;
    }
  }

  const { isLoading, isError, data, error } = useQuery(
    "remission_Detail",
    getRemissionDetail,
    { refetchOnWindowFocus: false }
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

  return (
    <div>
      {/* <Text> idventa :{idventa}</Text> */}
      <Box margin="5" border="1px" borderColor="blue.200" w="775px">
        <HStack m="4px">
          <InformacionEmpresa />
          {/* info Documento */}
          <InformacionRecibo datos={data} />
        </HStack>
        <Divider borderColor="blue.200" />

        {/* Info Cliente */}
        <InformacionCliente datos={data} />

        <Divider borderColor="blue.200" />

        {/* Info Productosss */}
        <InformacionProducto idventa={idventa} activador={activador} total={total} setTotal={setTotal} />

        <Divider borderColor="blue.200" />

        <HStack m="5px">
          {/* qr Info */}
          <CodigoQR />

          <Spacer />

          {/* precios total Info */}
          <InformacionTotal
            total={total}
          />
        </HStack>
        {/* Resumen */}
        {/* <Observaciones total={data.DOC_NETO.toFixed(2)} error={data.DOC_ERROR} /> */}
      </Box>
    </div>
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
    <React.Fragment>
      <Image src="gibbresh.png" fallbackSrc="https://via.placeholder.com/150" />
      {/* empresa */}
      <Box w="650px">
        <Center>
          <Text>
            <b>{data[0].COM_COMPANY_NAME}</b>
          </Text>
        </Center>

        <label></label>
        <Text fontSize="sm">
          <b>Descripción:</b> {data[0].COM_ORGANIZATION_SECTOR}
        </Text>
        <Text fontSize="sm">
          <b>Dirección:</b> {data[0].COM_ORGANIZATION_DIRECTION}
        </Text>
        <Text fontSize="sm">
          <b>Teléfono:</b> {data[0].COM_ORGANIZATION_PHONE_ONE} <b>Celular:</b>{" "}
          {data[0].COM_ORGANIZATION_PHONE_THREE}
        </Text>
      </Box>
    </React.Fragment>
  );
};
const InformacionRecibo = ({ datos }: { datos: any }) => {
  async function getEmpresa() {
    // const res = await fetch(import.meta.env.VITE_APP_API + "/sales/saleswithclient/"+idventa); //falta
    const res = await fetch(import.meta.env.VITE_APP_API + "/company/");
    return res.json();
  }
  const { isLoading, isError, data, error } = useQuery("empresa", getEmpresa);

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
    <React.Fragment>
      <VStack
        border="1px"
        borderColor="blue.200"
        w="225px"
        h="150px"
        divider={<StackDivider borderColor="blue.200" />}
      >
        <Text h="50px" align="center" fontSize="lg">
          GUIA DE REMISION
        </Text>
        <Text fontSize="sm" align="center">
          <b>RUC:</b> {data[0].COM_ORGANIZATION_RUC}
        </Text>
        <Text align="center">
          {" "}
          {datos.REM_INPOINT} - {datos.REM_OUTPOINT}
        </Text>
      </VStack>
    </React.Fragment>
  );
};
const InformacionCliente = ({ datos }: { datos: any }) => {
  return (
    <React.Fragment>
      <Box m="5px">
        <HStack>
          <Text>
            {" "}
            <b>FECHA DE CREACION:</b>
          </Text>
          <Text>{datos.REM_DATECREATED}</Text>
        </HStack>
        <HStack>
          <Text w="75px">
            {" "}
            <b>Direccion:</b>
          </Text>
          <Text w="150px">{datos.REM_ADDRESSEE}</Text>
          <Text w="90px">
            {" "}
            <b>Conductor:</b>
          </Text>
          <Text w="150px">{datos.REM_CARRIER}</Text>
          <Text w="90px">
            {" "}
            <b>Placa Vhc.:</b>
          </Text>
          <Text w="150px">{datos.REM_PLATE}</Text>
        </HStack>
      </Box>
    </React.Fragment>
  );
};
const InformacionProducto = ({
  idventa = null,
  activador = () => { },
  total,
  setTotal,
}: {
  idventa: any;
  activador: any;
  total: any;
  setTotal: any;
}) => {
  async function getProductosByRemission() {
    if (idventa != null) {
      // const res = await fetch(import.meta.env.VITE_APP_API + "/sales/saleswithclient/"+idventa); //falta
      const res = await fetch(
        import.meta.env.VITE_APP_API + "/remission_details/remission/" + idventa
      );
      return res.json();
    } else {
      return null;
    }
  }

  const { isLoading, isError, data, error } = useQuery(
    "productos",
    getProductosByRemission,
    { refetchOnWindowFocus: false }
  );
  useEffect(() => {
    if (data && data.messenger) {
      setTotal(0);
    } else if (data) {
      data.map((val: any, idx: number) => {
        setTotal(Number(total) + Number(val.RDT_PRICE))
      })
    }
  }, [isLoading]);
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
  } else {
    // React.useEffect(() => {
    //   activador()
    // })
    return (
      <React.Fragment>
        <Box m="5px">
          <Table variant="striped" colorScheme="blue" size="sm">
            <Thead>
              <Tr>
                <Th>Item</Th>
                <Th>Nombre</Th>
                <Th>Peso</Th>
                <Th isNumeric>Precio </Th>
              </Tr>
            </Thead>
            <Tbody>
              {data.map((result: any, idx: any) => {
                return (
                  <Tr key={idx + 1}>
                    <Td>{idx + 1}</Td>
                    <Td>{result.PRO_NAME}</Td>
                    <Td>{result.RDT_AMOUNT}</Td>
                    <Td textAlign={"end"}>{result.RDT_PRICE}</Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </Box>
      </React.Fragment>
    );
  }
};
const InformacionTotal = ({
  total,
}: {
  total: any;
}) => {
  return (
    <React.Fragment>
      <Box border="1px" borderColor="blue.200">
        <Table variant="simple" size="sm" colorScheme="blue">
          <Tbody>
            <Tr>
              <Td>
                <Text align="right">
                  <b>Importe total</b>
                </Text>
              </Td>
              <Td>{total}</Td>
            </Tr>
          </Tbody>
        </Table>
      </Box>
    </React.Fragment>
  );
};
const CodigoQR = () => {
  return (
    <React.Fragment>
      <Box w="500px">
        <Center>
          <Image
            boxSize="150px"
            src="gibbresh.png"
            fallbackSrc="https://static-unitag.com/images/help/QRCode/qrcode.png?mh=07b7c2a2"
          />
        </Center>
        <Text align="center">
          Representación impresa del comprobante daef aef ea
        </Text>
      </Box>
    </React.Fragment>
  );
};
const Observaciones = ({ total = 0, error = '' }: { total: any; error: any }) => {
  return (
    <React.Fragment>
      <Box m="5px">
        <Text>
          <b>SON: {total} con 0/100 soles</b>
        </Text>

        <Box border="1px" borderColor="blue.200">
          <Text>Observaciones:</Text>
          <Text>
            {error}
          </Text>
        </Box>
      </Box>
    </React.Fragment>
  );
};
