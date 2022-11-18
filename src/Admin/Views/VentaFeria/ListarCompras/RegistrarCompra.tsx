import { Button } from '@chakra-ui/button'
import { Grid } from '@chakra-ui/layout'
import { Box, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { BsShop } from 'react-icons/bs'
import { FiShoppingCart } from 'react-icons/fi'
import { MyContain } from '../../../UI/Components/MyContain'
import { CompraTable } from './CompraTable'
import { RegCompraModal } from './RegCompraModal'
import { RegistrarCompraExterna } from './RegistrarCompraExterna'
import { TableExternal } from './TableExternal'

export const RegistraCompra = () => {
    useEffect(() => {
        //@ts-ignore
        document.getElementById('title_view').textContent = 'Compras';
    }, [])
    return (
        <Grid
            gap="1rem"
        >
            <MyContain>
                <Box display={'flex'} gap='10px'>
                    <RegCompraModal>
                        <Button colorScheme={'messenger'} leftIcon={<BsShop />}> &nbsp; REGISTRAR COMPRA INTERNA</Button>
                    </RegCompraModal>

                    <RegistrarCompraExterna />
                </Box>
            </MyContain>
            <MyContain>
                <Tabs isFitted variant='enclosed'>
                    <TabList mb='1em'>
                        <Tab>COMPRAS INTERNAS</Tab>
                        <Tab>COMPRAS EXTERNAS</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <CompraTable />
                        </TabPanel>
                        <TabPanel>
                            <TableExternal />
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </MyContain>
        </Grid>
    )
}
