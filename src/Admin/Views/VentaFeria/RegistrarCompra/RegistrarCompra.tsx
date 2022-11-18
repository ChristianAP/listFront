import { Button } from '@chakra-ui/button'
import { Grid } from '@chakra-ui/layout'
import React, { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { MyContain } from '../../../UI/Components/MyContain'
import { CompraTable } from './CompraTable'
import { RegCompraModal } from './RegCompraModal'

export const RegistrarCompra = () => {

    const currentTime = new Date();
    const year = currentTime.getFullYear()
  
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
  
    const [fechas, setFechas] = useState({ fechaIni: getMonday(new Date()).formatdiffinit, fechaFin: getMonday(new Date()).formatdayfinal, tienda: 5 })
  
    async function getVentas({ fechaIni, fechaFin, tienda }: { fechaIni: string, fechaFin: string, tienda: number }) {
      const res = await fetch(import.meta.env.VITE_APP_API + `/document/desc/${fechaIni + '/' + fechaFin + '/' + tienda}`);
      return res.json();
    }
  
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
  
    useEffect(() => {
        //@ts-ignore
        document.getElementById('title_view').textContent = 'Guía de Remisión';
    }, [])
    return (
        <Grid
            gap="1rem"
        >
            <MyContain>
                <RegCompraModal fecha = {fechas} handleInput = {handleInput} getMonday = {getMonday}/>
            </MyContain>
            <MyContain>
                <CompraTable fecha={fechas} />
            </MyContain>
        </Grid>
    )
}
