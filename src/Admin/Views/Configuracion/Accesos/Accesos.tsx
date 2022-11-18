import { Box, Button, Center, Icon, Stack } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { AiOutlineReload } from "react-icons/ai";
import { useQuery } from "react-query";
import { Tooltip } from "recharts";
import { MyReactTable } from "../../../../GlobalUI/Table/MyReactTable";
import { GetAllRol } from "../../../../Service/RolService";
import { MyContain } from "../../../UI/Components/MyContain";
import { TableChargeListProduct } from "../../../UI/Components/TableCharge/tablecharge";
import { RegistrarRol } from "./RegistrarRol";
import { VerAccesos } from "./VerAccesos";

export const Accesos = () => {
  useEffect(() => {
    //@ts-ignore
    document.getElementById("title_view").textContent = "Roles y Accesos";
  }, []);

  const { data, isLoading, isError, isFetching, refetch } = useQuery(
    "accesos",
    GetAllRol,
    { refetchOnWindowFocus: false }
  );

  const columns = [
    {
      Header: "ID",
      accessor: "ROL_ID",
    },
    {
      Header: "NOMBRE DE ROL",
      accessor: "ROL_NAME",
    },
    {
      Header: "DESCRIPTION",
      accessor: "ROL_DESCRIPTION",
    },
    {
      Header: "ACCIONES",
      id: "actions",

      // @ts-ignore
      Cell: ({ row }) => <ActionCell data={row.original} />,
    },
  ];

  if (isLoading || isFetching) return <TableChargeListProduct />;

  return (
    <MyContain>
      <Box>
        <RegistrarRol />
        <Tooltip label='Actualizar'>
        <Button onClick={() => refetch()}>
          <Icon as={AiOutlineReload} />
        </Button>
        </Tooltip>
      </Box>
      <MyReactTable
        columns={columns}
        // @ts-ignore
        data={data}
        isPaginated
        hasFilters
        //@ts-ignore
        pagesOptions={[50, 75, 100]}
      />
    </MyContain>
  );
};

export const ActionCell = (props: any) => {
  return (
    <Stack direction={{ base: "column", md: "row" }}>
      <Center>
        <VerAccesos idrol={props.data.ROL_ID} />
      </Center>
    </Stack>
  );
};
