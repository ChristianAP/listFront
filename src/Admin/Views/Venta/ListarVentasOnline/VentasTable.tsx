import {
  IconButton,
  Stack,
  Skeleton,
  Text,
  Badge,
  Box,
  Flex,
  Input,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { AiFillEye } from "react-icons/ai";
import { EditVentasModal } from "./EditeVentasModal";
import { MyReactTable } from "../../../../GlobalUI/Table/MyReactTable";
import { ListSalesOnline } from "../../../../Service/Sales";
import { useRecoilValue } from "recoil";
import { listaSaleOnline } from "../../../../Data/Atoms/SaleOnline";
import { MyContain } from "../../../UI/Components/MyContain";
import { TableCharge, TableChargeListProduct } from "../../../UI/Components/TableCharge/tablecharge";
import { TablaSinDatos } from "../../../UI/Components/TablaSinDatos";
import { ButtonRefetch } from "../../../UI/Components/ButtonRefetch";
import { IoReload } from "react-icons/io5";
import { DescargarPedidos } from "./ExportPedidos";
import { DeleteVentasModal } from "./DeleteVentasModal";
import { BiTrash } from "react-icons/bi";


export const VentasTable = ({ isLoading, isError, data, error, isFetching, refetch }: { isLoading: any, isError: any, data: any, error: any, isFetching: any, refetch: any }) => {

  const salesupdate = useRecoilValue(listaSaleOnline);

  const columns = [
    {
      Header: "Número de Pedido",
      accessor: "PEDIDO",
      filter: "fuzzyText",
    },
    {
      Header: "Cliente",
      // @ts-ignore
      Cell: ({ row }) => <ClienteName pro={row.original} />

    },
    {
      Header: "Total",
      accessor: "TOTAL",
    },
    {
      Header: "Fecha Pedido",
      accessor: "ORD_DATE_ORDER2",
      disableFilters: true,
    },
    {
      Header: "Estado",
      disableFilters: true,
      // @ts-ignore
      Cell: ({ row }) => <ApprovalCell apr={row.original} />,
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
const ClienteName = ({ pro }: { pro: any }) => {
  console.log(pro);
  return (<Text>{(pro.CLIENTE ? pro.CLIENTE.trim() : "".trim()).length > 0 ? pro.CLIENTE : pro.TRADENAME}</Text>)
}
const ActionCell = ({ ven }: { ven: any }) => {
  return (
    <Stack direction={{ base: "column", md: "row" }}>
      <EditVentasModal venta={ven}>
        <IconButton
          icon={<AiFillEye />}
          aria-label="Ver"
          colorScheme="yellow"
        />
      </EditVentasModal>
      {ven.APROBACION == 2 && <DeleteVentasModal venta={ven}>
        <IconButton
          icon={<BiTrash />}
          aria-label="Ver"
          _hover={{}}
          bg="#3e49f9"
        />
      </DeleteVentasModal>}
    </Stack>
  );
};

const ApprovalCell = ({ apr, sta }: { apr?: any; sta?: any }) => {
  let theVerifiedIs = "";
  let colorVerified = "";

  if (apr.VOUCHER == null) {
    theVerifiedIs = "Sin Voucher";
    colorVerified = "red";
  } else if (apr.VOUCHER == "") {
    theVerifiedIs = "Voucher eliminado";
    colorVerified = "orange";
  } else {
    switch (apr.APROBACION) {
      case "0":
        theVerifiedIs = "Falta Verificación";
        colorVerified = "yellow";
        break;
      case "1":
        theVerifiedIs = "Voucher Verificado";
        colorVerified = "green";
        break;
      case "2":
        theVerifiedIs = "Voucher Rechazado";
        colorVerified = "purple";
        break;
      default:
        theVerifiedIs = "Voucher Eliminado";
        colorVerified = "red";
        break;
    }
  }


  return (
    <Stack direction={{ base: "column", md: "row" }}>
      <Badge noOfLines={2} colorScheme={colorVerified}>
        {theVerifiedIs}
      </Badge>
    </Stack>
  );
};
