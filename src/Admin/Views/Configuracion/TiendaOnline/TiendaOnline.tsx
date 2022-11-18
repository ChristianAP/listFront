
import { Box, Checkbox, Flex, Grid, GridItem, Input, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, RangeSlider, RangeSliderFilledTrack, RangeSliderMark, RangeSliderThumb, RangeSliderTrack, Skeleton, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { getConfigTienda } from '../../../../Service/ConfigAdminService';
import { MyContain } from '../../../UI/Components/MyContain';
import { PasosOnline } from '../PasosOnline/PasosOnline';
import { ActiveOpenCash } from './ActivateOpenCash';
import { ConfCodebar } from './ConfCodeBar';
import { ProductDetailConfig } from './ProductDetailConfig';
import { TiendaOnlineActive } from './TiendaOnlineActive';

export const TiendaOnline = () => {
    const { data, isLoading, isFetching } = useQuery("configuracionTiendaOnline", getConfigTienda, { refetchOnWindowFocus: false })
    console.log(data);


    useEffect(() => {
        //@ts-ignore
        document.getElementById('title_view').textContent = 'Configuracion de Tienda Online';
    }, [])
    return (
        <>
            <Grid gridTemplateColumns={'repeat(2, 1fr)'} gap={'20px'}>
                <GridItem>
                    <MyContain >
                        {isLoading || isFetching ?
                            <Skeleton height="20px" /> :
                            <TiendaOnlineActive data={data}></TiendaOnlineActive>
                        }
                    </MyContain>
                </GridItem>

                <GridItem>
                    <MyContain >
                        {isLoading || isFetching ?
                            <Skeleton height="20px" /> :
                            <ActiveOpenCash data={data}></ActiveOpenCash>
                        }
                    </MyContain>
                </GridItem>

            </Grid>
            <Box h={"15px"}></Box>
            <MyContain >
                <Tabs size='md' variant='enclosed'>
                    <TabList>
                        <Tab>Detalle del Producto</Tab>
                        <Tab>Configuración de Código de Barras</Tab>
                        <Tab>Pasos Online</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <ProductDetailConfig />
                        </TabPanel>
                        <TabPanel>
                            <ConfCodebar />
                        </TabPanel>
                        <TabPanel>
                            <PasosOnline />
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </MyContain>

        </>
    )
}
