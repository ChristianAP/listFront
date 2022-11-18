import { Button } from "@chakra-ui/button";
import { Box, Center, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverTrigger, Portal, Text } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useQuery } from "react-query";
import { MyReactTable } from "../../../../GlobalUI/Table/MyReactTable";
import { ButtonRefetch } from "../../../UI/Components/ButtonRefetch";
import { MyContain } from "../../../UI/Components/MyContain";
import { TablaSinDatos } from "../../../UI/Components/TablaSinDatos";
import { TableCharge } from "../../../UI/Components/TableCharge/tablecharge";
import { Enviar } from "./EnviarComprobante";
import { GenerarDeAnulado } from "./GenerarDeAnulado";
import { NotaCredito } from "./NotaCredito";
import { VerComprobante } from "./VerComprobante";
export const Comprobantes = () => {
  async function getVentas() {
    const res = await fetch(
      import.meta.env.VITE_APP_API + "/document/desconlycomp  "
    ); //falta

    return res.json();
  }


  useEffect(() => {
    //@ts-ignore
    document.getElementById('title_view').textContent = 'Listar Comprobantes';
  }, []);

  const { isLoading, isError, data, error, isFetching, refetch } = useQuery("ventas", getVentas, {
    refetchOnWindowFocus: false,
  });

  console.log(data);
  

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
      Header: "Tipo de Documento",
      Footer: "Tipo de Documento",
      accessor: "DCT_NAME",
    },
    {
      Header: "Nro. Comprobante",
      Footer: "Nro. Comprobante",
      accessor: "COMPROBANTE",
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
      Header: "Estado SUNAT",
      Footer: "Estado SUNAT",
      accessor: "DOC_STATUS",
    },
    {
      Header: "Accion",
      Footer: "Accion",
      //@ts-ignore
      Cell: ({ row }) => (
        <Popover placement='left'>
          <PopoverTrigger>
            <Button bg={"#0080ff"} color="white" _hover={{}}>Acciones</Button>
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
                    <GenerarDeAnulado venta={ row.original}/>
                  </Box>
                </Center>
              </PopoverBody>
            </PopoverContent>
          </Portal>
        </Popover>
      ),
    },
  ];

  // @ts-ignore
  if (isLoading || isFetching) return (<TableCharge />)

  //@ts-ignore
  if (isError) return <h1>{error.message}</h1>;

  if (data.status == 200)
    return (
      <TablaSinDatos message="Sin Comprobantes" />
    );

  return (
    <>
      <MyContain>
        <ButtonRefetch refetch={refetch} />
      </MyContain>
      <MyContain>
        <Box w="full">
          <MyReactTable
            data={data}
            columns={columnas}
            isPaginated
            hasFilters
            pagesOptions={[50, 75, 100]}
          />
        </Box>
      </MyContain>
    </>
  );
};

