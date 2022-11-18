import { Flex, Grid, HStack, Input, Spacer } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { ButtonRefetch } from "../../../UI/Components/ButtonRefetch";
import { MyContain } from "../../../UI/Components/MyContain";
import { ConsilacionTable } from "./ConsilacionTable";

export const Consiliacion = () => {
  useEffect(() => {
    //@ts-ignore
    document.getElementById('title_view').textContent = 'Conciliación';
  }, [])
  function getMonday(d: Date) {
    d = new Date(d);

    let dayinit = d.getDay();
    let diffinit = d.getDate() - dayinit + (dayinit == 0 ? -7 : 0); // adjust when day is sunday 
    let formatinit = new Date(d.setDate(diffinit)).toISOString().substring(0, 10)
    let splitformatinit = formatinit.split("-");
    let formatCorrectInit = splitformatinit[2] + "-" + splitformatinit[1] + "-" + splitformatinit[0];

    let dayfinal = d.getDay();
    let diffinal = d.getDate() - dayfinal + (dayfinal == 0 ? +7 : 7); // adjust when day is sunday 
    let formatfin = new Date(d.setDate(diffinal)).toISOString().substring(0, 10)
    let splitformatfin = formatfin.split("-");
    let formatCorrectFin = splitformatfin[2] + "-" + splitformatfin[1] + "-" + splitformatfin[0];

    return { diffinit: formatinit, formatdiffinit: formatCorrectInit, dayfinal: formatfin, formatdayfinal: formatCorrectFin };
  }

  const [fechas, setFechas] = useState({ fechaIni: getMonday(new Date()).formatdiffinit, fechaFin: getMonday(new Date()).formatdayfinal })
  async function getVentas({ fechaIni, fechaFin }: { fechaIni: string, fechaFin: string }) {
    const res = await fetch(import.meta.env.VITE_APP_API + `/document/consilation/${fechaIni + '/' + fechaFin}`); //falta
    return res.json();
  }


  const { isLoading, isError, data, error, isFetching, refetch } = useQuery(["ventas", fechas], () => getVentas(fechas), {
    refetchOnWindowFocus: false,
  });

  const formatDate = (date: any) => {
    let fecha = date.split('-')
    let formatted_date = fecha[2].substr(0, 2) + '-' + fecha[1] + '-' + fecha[0];
    return formatted_date;
  }

  function handleInput(e: any) {

    const fechaParcer = formatDate(e.target.value)
    setFechas({
      ...fechas,
      [e.target.name]: fechaParcer,
    });
  }
  return (<Grid gap="1rem">
    <MyContain>
      <MyContain>
        <HStack>
          <Flex w="full">
            <Flex>
              <Input type="date" name="fechaIni" defaultValue={getMonday(new Date()).diffinit} onChange={handleInput} variant="filled" />
              <Input type="date" name="fechaFin" defaultValue={getMonday(new Date()).dayfinal} onChange={handleInput} variant="filled" />
            </Flex>
            {/* <ListaVentasExport isLoading={isLoading} data={data} /> */}
          </Flex>
          <Spacer />
          <ButtonRefetch refetch={refetch} />
        </HStack>

      </MyContain>
      <ConsilacionTable
        isLoading={isLoading}
        isError={isError}
        data={data}
        error={error}
        isFetching={isFetching}
        refetch={refetch} />
    </MyContain>
  </Grid>)
};
