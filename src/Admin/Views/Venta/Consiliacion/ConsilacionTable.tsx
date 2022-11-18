import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Stack,
  Text,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { MyReactTable } from "../../../../GlobalUI/Table/MyReactTable";
import { useRecoilValue } from "recoil";
import { listaSaleOnline } from "../../../../Data/Atoms/SaleOnline";
import { MyContain } from "../../../UI/Components/MyContain";
import { TableCharge, TableChargeListProduct } from "../../../UI/Components/TableCharge/tablecharge";
import { TablaSinDatos } from "../../../UI/Components/TablaSinDatos";
import { useMutation } from "react-query";
import { ChangeStatePay } from "../../../../Service/Sales";
import { ConsiEditModal } from "./ConsiEditModal";


export const ConsilacionTable = ({ isLoading, isError, data, error, isFetching, refetch }:
  { isLoading: any, isError: any, data: any, error: any, isFetching: any, refetch: any }) => {

  const salesupdate = useRecoilValue(listaSaleOnline);

  const columns = [
    {
      Header: "Nro Comprobante",
      accessor: "COMPROBANTE",
      filter: "fuzzyText",
    },
    {
      Header: "Forma de Pago",
      accessor: "PMT_NAME",
      filter: "fuzzyText",
    },
    {
      Header: "Razon Social",
      accessor: "DOC_BUSINESS_NAME",
      filter: "fuzzyText",
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
      Header: "Fecha de Registro",
      accessor: "DOC_DATE2",
      disableFilters: true,
    },
    {
      Header: "Acciones",
      id: "actions",

      // @ts-ignore
      Cell: ({ row }) => <ActionCell ven={row.original} />,
    },
  ];

  useEffect(() => {
    refetch();
  }, [salesupdate]);

  // @ts-ignore
  if (isLoading || isFetching) return (<TableCharge />)

  // @ts-ignore
  if (isError) return <h1>{error.message} </h1>;

  return (
    <>
      {
        (data.length > 0) ? (
          <>
            <MyContain>
              <Box w="full">
                <MyReactTable
                  columns={columns}
                  data={data}
                  isPaginated
                  hasFilters
                  pagesOptions={[50, 75, 100]}
                />
              </Box>
            </MyContain>
          </>
        ) : (
          <TablaSinDatos message="No hay Ventas Online" />
        )
      }
    </>
  );
};

const ActionCell = ({ ven }: { ven: any }) => {
  const [isOpen, setIsOpen] = useState(false)
  const cancelRef = useRef()

  const onClose = () => setIsOpen(false)

  async function handleDelete() {
    // @ts-ignore
    const { DOC_ID, DOC_ESTADO } = ven
    console.log({ DOC_ID, DOC_ESTADO });

    onClose()
  }
  return (
    <Stack direction={{ base: "column", md: "row" }}>
      <ConsiEditModal document={ven}>
        <Button>
          Conciliar
        </Button>
      </ConsiEditModal>
    </Stack>
  );
};

