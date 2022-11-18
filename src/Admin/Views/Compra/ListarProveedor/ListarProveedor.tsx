import { Button } from '@chakra-ui/button'
import { Grid } from '@chakra-ui/layout'
import React, { useEffect } from 'react'
import { MyContain } from '../../../UI/Components/MyContain'
import { ProvTable } from './ProvTable'
import { RegProvModal } from './RegProvModal'

export const ListarProveedor = () => {
    useEffect(() => {
        //@ts-ignore
        document.getElementById('title_view').textContent = 'Proveedores';
    }, [])
    
    return (
        <Grid
            gap="1rem"
        >
            <MyContain>
                <RegProvModal>
                    <Button colorScheme="green">Agregar</Button>
                </RegProvModal>
            </MyContain>
            <MyContain>
                <ProvTable />
            </MyContain>
        </Grid>
    )
}
