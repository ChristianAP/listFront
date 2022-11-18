import { Button } from '@chakra-ui/button'
import { Grid } from '@chakra-ui/layout'
import React, { useEffect, useState } from 'react'
import { MyContain } from '../../../UI/Components/MyContain'
import { StockTable } from './StockTable'
import { RegStockModal } from './RegStockModal'
import { useDisclosure } from '@chakra-ui/react'

export const RegistrarStock = () => {
    useEffect(() => {
        //@ts-ignore
        document.getElementById('title_view').textContent = 'Stock';
    }, [])
    return (
        <Grid
            gap="1rem"
        >
            <MyContain>
                <RegStockModal />
            </MyContain>
            <MyContain>
                <StockTable />
            </MyContain>
        </Grid>
    )
}
