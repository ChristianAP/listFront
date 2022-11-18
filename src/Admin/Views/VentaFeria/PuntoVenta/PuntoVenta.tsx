import { Grid } from '@chakra-ui/react';
import React, { useEffect } from 'react'
import { MyContain } from '../../../UI/Components/MyContain';
import { PuntoVentaTable } from './PuntoVentaTable';
import { RegPosModal } from './RegPosModal';

export const PuntoVenta = () => {
    useEffect(() => {
        //@ts-ignore
        document.getElementById('title_view').textContent = 'Punto de Venta(Feria)';
    }, [])
    return (<>
        <Grid
            gap="1rem"
        >
            <MyContain>
                <RegPosModal />
            </MyContain>
            <MyContain>
                <PuntoVentaTable />
            </MyContain>
        </Grid>
    </>
    )
}
