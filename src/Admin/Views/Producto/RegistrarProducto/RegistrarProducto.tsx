import { Grid } from '@chakra-ui/layout'
import { Button } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { MyContain } from '../../../UI/Components/MyContain'
import { CreateProdModal } from './CreateProdModal'
import { ProdTable } from './ProdTable'

export const RegistrarProducto = ({ online }: { online: boolean }) => {
    useEffect(() => {
        //@ts-ignore
        document.getElementById('title_view').textContent = online ? "Insumo Online" : 'Insumo';
    }, [])

    return (
        <Grid
            gap="1rem"
        >
            <ProdTable online={online} />
        </Grid>
    )
}
