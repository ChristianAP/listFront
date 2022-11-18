import {
  Button,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Skeleton,
  Stack,
  Text,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { BiExport } from "react-icons/bi";
import { BsFillPrinterFill } from "react-icons/bs";
import { useMutation, useQuery } from "react-query";
import { MyReactTable } from "../../../../GlobalUI/Table/MyReactTable";
import { getBuyDetail, getBuys } from "../../../../Service/ProductAdminService";
import { AgregarRemission, EditarRemission, remissionList } from "../../../../Service/RemisionAdminService";
import { EditProdCompra } from "./EditProdCompra";
import { ExportRemision } from "./ExportRemision";

export const CompraTable = ({fecha} : {fecha : any}) => {

  // @ts-ignore
  const { data, isLoading, isFetching, refetch } = useQuery(["remision", fecha],() => remissionList(fecha) , { refetchOnWindowFocus: false });


  const columns = [
    {
      Header: "Codigo de Remision",
      Footer: "Codigo de Remision",
      accessor: "REM_CODE",
    },
    {
      Header: "Lugar de Partida",
      Footer: "Lugar de Partida",
      accessor: "REM_OUTPOINT",
    },
    {
      Header: "Lugar de Llegada",
      Footer: "Lugar de Llegada",
      accessor: "REM_INPOINT",
    },
    {
      Header: "Conductor",
      Footer: "Conductor",
      accessor: "REM_CARRIER",
    },
    {
      Header: "Estado",
      Footer: "Estado",
      accessor: "REM_OUT",
      //accessor: 'cell',
      // @ts-ignore
      Cell: ({ row }) => (
        <Text >{row.original.REM_OUT == 1 ? "Enviado" : "En Almacen"}</Text>
      ),
    },
    {
      Header: 'Acciones',
      Footer: 'Acciones',
      accessor: 'cell',
      // @ts-ignore
      Cell: ({ row }) => (
        <ActionCell prov={row.original} refetch={refetch} />
      ),
    },
  ];

  if (isLoading || isFetching)
    return (
      <Stack>
        <Skeleton height="20px" />
        <Skeleton height="20px" />
        <Skeleton height="20px" />
      </Stack>
    );

  // @ts-ignore
  return (
    <>
      {((data.length < 0) || data.message) ? (
        <h1>No hay compras registradas</h1>
      ) :
        <MyReactTable
          columns={columns}
          data={data}
          isPaginated
          hasFilters
          pagesOptions={[50, 75, 100]}
        />}
    </>
  );
};

const ActionCell = ({ prov, refetch }: { prov: any, refetch: any }) => {

  return (
    <Stack
      style={{ justifyContent: "center" }}
      direction={{ base: "column", md: "row" }}>
      <EditProdCompra Producto={prov}>
        <Button>
          {prov.REM_OUT == 1 ? "En Remision" : "En Almacen"}
        </Button>
      </EditProdCompra>
      <Tooltip label='Exportar'>
        <ExportRemision idexport={prov.REM_ID} />
      </Tooltip>;
    </Stack>
  );
};
