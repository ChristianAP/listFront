import React, { useEffect } from "react";
import {
  Flex,
  Stack,
  Box,
  Grid,
  useColorModeValue,
  Spacer,
  HStack,
} from "@chakra-ui/react";

import { AddTicket } from "./AddTicket";
import { useQuery } from "react-query";
import { MyReactTable } from "../../../GlobalUI/Table/MyReactTable";

import { MyViewStatus } from "../../UI/Components/ModalAlert/MyModal";
import { ViewTicket } from "./ViewTicket";
import { BsFillEyeFill } from "react-icons/bs";
import { listaTickets } from "../../../Data/Atoms/Ticket";
import { useRecoilValue } from "recoil";
import { MyContain } from "../../UI/Components/MyContain";
import { TableChargeList } from "../../UI/Components/TableCharge/tablecharge";
import { TablaSinDatos } from "../../UI/Components/TablaSinDatos";
import { ButtonRefetch } from "../../UI/Components/ButtonRefetch";

//@ts-ignore
export const TablaGeneral = ({ title, viewColumns, atom, query }: { title: any; viewColumns: any; atom: any; query: any }) => {
  const { isLoading, isError, data, error, isFetching, refetch } = useQuery(
    atom,
    query,
    { refetchOnWindowFocus: false }
  );

  const nuevosTickets = useRecoilValue(listaTickets);

  const columns = viewColumns;
  useEffect(() => {
    refetch();
  }, [nuevosTickets]);

  if (isLoading || isFetching) {
    return (
      <>
        <Grid gap="1rem" w="100%">
          <Box
            p={ 3 }
            bg={ useColorModeValue("white", "gray.800") }
            borderRadius="md"
            alignItems="start"
            justifyContent="center">
            <TableChargeList />
          </Box>
        </Grid>
      </>
    );
  }

  // @ts-ignore
  if (isError) {
    // @ts-ignore
    return <h1>{ error.message }</h1>;
  }

  return (
    <>
      <Grid gap="1rem" w="100%">
        <MyContain>
          <HStack>
            {/* @ts-ignore */ }
            <AddTicket title="Nuevo" length={ data.length > 0 ? data.length : 0 } view={ title } />
            <Spacer />
            <ButtonRefetch refetch={ refetch } />
          </HStack>
        </MyContain>
        <MyContain>
          {/* @ts-ignore */ }
          { data.status != 404 ? (
            <MyReactTable
              columns={ columns }
              // @ts-ignore
              data={ data }
              isPaginated
              hasFilters
              //@ts-ignore
              pagesOptions={ [2, 5, 10, data.length] }
            />
          ) : (<TablaSinDatos message="No hay Tickets" />)
          }
        </MyContain>
      </Grid>
    </>
  );
};

export const ActionCell = ({ act }: { act: any }) => {
  return (
    <Stack direction={ { base: "column", md: "row" } }>
      <ViewTicket
        idTicket={ act.ID }
        icon={
          <>
            <BsFillEyeFill />
          </>
        }
      />
    </Stack>
  );
};

export const InfoCell = ({ info }: { info: any }) => {
  return (
    <Stack direction={ { base: "column", md: "row" } }>
      <Flex display="-webkit-box">
        #{ info.ID }
        <MyViewStatus status={ info.ESTADO } tooltip={ info.STATUS_DES } />
      </Flex>
    </Stack>
  );
};
