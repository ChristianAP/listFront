
import { Button } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { BiPlus } from 'react-icons/bi';
import { MyContain } from '../../../UI/Components/MyContain';
import { AddMetodoPago } from './AddMetodoPago';
import { MetodoPagoTable } from './MetPagoTable';

export const MetodoPago = () => {
    useEffect(() => {
        //@ts-ignore
        document.getElementById('title_view').textContent = 'Métodos de Pagos';
    }, [])
    return (
        <>
            <MyContain>
                <AddMetodoPago>
                    <Button colorScheme='green'> <BiPlus fontSize={"xl"} /> &nbsp; &nbsp; Agregar Método de Pago</Button>
                </AddMetodoPago>
            </MyContain>
            <br />
            <MyContain >
                <MetodoPagoTable />
            </MyContain>
        </>
    )
}
