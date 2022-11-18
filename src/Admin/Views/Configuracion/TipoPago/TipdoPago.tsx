
import { Button, Grid } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { FaPlus } from 'react-icons/fa';
import { MyContain } from '../../../UI/Components/MyContain';
import { CrearTipPagoModal } from './CrearTipoPagoModal';
import { TipoPagoTable } from './TipPagoTable';

export const TipoPago = () => {
    /* useEffect(() => {
        //@ts-ignore
        document.getElementById('title_view').textContent = 'Tipo de Pagos';
    }, []) */
    return (
        <Grid gap="1rem">
            <MyContain >
                <CrearTipPagoModal>
                    <Button leftIcon={<FaPlus />} colorScheme="green" >Agregar</Button>
                </CrearTipPagoModal>
            </MyContain>
            <MyContain >
                <TipoPagoTable />
            </MyContain>
        </Grid>
    )
}
