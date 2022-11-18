import { Grid, Button } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { CatTable } from './CatTable';

export const Categoria = () => {
    useEffect(() => {
        //@ts-ignore
        document.getElementById('title_view').textContent = 'Categorias';
    }, [])

    return (
        <Grid
            gap="1rem"
        >
            <CatTable />
        </Grid>
    );
}