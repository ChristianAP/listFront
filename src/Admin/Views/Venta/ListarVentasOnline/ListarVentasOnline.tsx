import { Flex, Grid, Input } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { ListSalesOnline } from "../../../../Service/Sales";
import { ButtonRefetch } from "../../../UI/Components/ButtonRefetch";
import { MyContain } from "../../../UI/Components/MyContain";
import { DescargarPedidos } from "./ExportPedidos";
import { VentasTable } from "./VentasTable";

export const ListarVentasOnline = () => {
  function getMonday(d: Date) {
    d = new Date(d);

    let dayinit = d.getDay();
    let diffinit = d.getDate() - dayinit + (dayinit == 0 ? -7 : 0); // adjust when day is sunday 
    let formatinit = new Date(d.setDate(diffinit)).toISOString().substring(0, 10)

    let dayfinal = d.getDay();
    let diffinal = d.getDate() - dayfinal + (dayfinal == 0 ? +7 : 7); // adjust when day is sunday 
    let formatfin = new Date(d.setDate(diffinal)).toISOString().substring(0, 10)

    return { diffinit: formatinit, formatdiffinit: formatinit, dayfinal: formatfin, formatdayfinal: formatfin };
  }
  const [fechas, setFechas] = useState({ fechaIni: getMonday(new Date()).formatdiffinit, fechaFin: getMonday(new Date()).formatdayfinal })
  const { isLoading, isError, data, error, isFetching, refetch } = useQuery(
    ["salesonline", fechas],
    () => ListSalesOnline(fechas),
    { refetchOnWindowFocus: false }
  );

  const formatDate = (date: any) => {
    let formatted_date = date.substring(0, 10);
    return formatted_date;
  }

  function handleInput(e: any) {

    const fechaParcer = formatDate(e.target.value)
    setFechas({
      ...fechas,
      [e.target.name]: fechaParcer,
    });
  }


  useEffect(() => {
    //@ts-ignore
    document.getElementById('title_view').textContent = 'Listar Pedidos Online';
  }, [])

  return (<Grid gap="1rem">
    <MyContain>
      <Flex w="full">
        <Flex>
          <Input type="date" name="fechaIni" defaultValue={getMonday(new Date()).diffinit} onChange={handleInput} variant="filled" />
          <Input type="date" name="fechaFin" defaultValue={getMonday(new Date()).dayfinal} onChange={handleInput} variant="filled" />
        </Flex>
        <ButtonRefetch refetch={refetch} />
        <DescargarPedidos fechas={fechas}/>
      </Flex>
    </MyContain>
    <MyContain>
      <VentasTable isLoading={isLoading} isError={isError} data={data} error={error} isFetching={isFetching} refetch={refetch} />
    </MyContain>
  </Grid>)
};
