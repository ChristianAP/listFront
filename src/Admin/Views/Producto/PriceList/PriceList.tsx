import React, { useEffect } from 'react'
import { Grid, Button, Flex, Spacer, Box, TabList, Tabs, Tab, TabPanels, TabPanel } from '@chakra-ui/react'
import { PriceListTable } from './PricelistTable';
import { ListPriceN2 } from './ListPriceN2/ListPriceN2';
import { ListPriceN3 } from './ListPriceN3/ListPriceN3';

export const PriceList = () => {

    useEffect(() => {
        //@ts-ignore
        document.getElementById('title_view').textContent = 'Lista de precios';
    }, [])

    return (<Grid
        gap="1rem"
    >
        <Tabs isFitted variant='soft-rounded' colorScheme='green'>
            <TabList mb='1em'>
                <Tab >LISTA DE PRECIO NORMAL</Tab>
                <Tab >LISTA DE PRECIO CLIENTES MEDIOS</Tab>
                <Tab >LISTA DE PRECIO CLIENTES CONCURRENTES</Tab>
            </TabList>
            <TabPanels>
                <TabPanel>
                    <PriceListTable />
                </TabPanel>
                <TabPanel>
                    <ListPriceN2 />
                </TabPanel>
                <TabPanel>
                    <ListPriceN3 />
                </TabPanel>
            </TabPanels>
        </Tabs>

    </Grid>)
}
