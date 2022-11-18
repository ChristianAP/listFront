import React, { useEffect } from 'react'
import { Grid } from '@chakra-ui/react'
import { MyContain } from '../../../UI/Components/MyContain';
import { KarxTable } from './KardexTable';

export const Kardex = () => {
    useEffect(() => {
        //@ts-ignore
        document.getElementById('title_view').textContent = 'Kardex';
    }, [])
    
    return (
        <Grid
            gap="1rem"
        >
            <MyContain>
                <KarxTable />
            </MyContain>
        </Grid>)
}
