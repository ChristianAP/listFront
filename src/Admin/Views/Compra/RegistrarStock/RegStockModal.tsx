import React, { ReactNode, useEffect, useState } from 'react'
import { Button } from "@chakra-ui/button";
import { useDisclosure } from "@chakra-ui/hooks";
import { Box, Grid, GridItem, Stack, Text } from "@chakra-ui/layout";
import {
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
} from "@chakra-ui/modal";

import { CategoriaComp } from '../../../../Client/UI/Component/CategoriaComp';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { CreateStockDetail, producstByCatId, stockByProId, stockDetailByStockId, UpdateStock } from '../../../../Service/StockAdmin';
import { NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Select, Skeleton } from '@chakra-ui/react';
import { MyReactTable } from '../../../../GlobalUI/Table/MyReactTable';

export const RegStockModal = () => {
    const [stock, setstock] = useState(0);
    const [stockActual, setstockActual] = useState(0);
    const [stockDetail, setStockDetail] = useState({
        stkId: 0,
        cantidad: 0
    });
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [idCategori, setIdCategori] = useState({ CAT_ID: 1 });
    const queryClient = useQueryClient();
    const { data: product, isError: catIsError, isLoading: catLoading } = useQuery(["productsByIdCat", idCategori.CAT_ID], () => producstByCatId(idCategori.CAT_ID), { refetchOnWindowFocus: false });
    const { data: datastock, isError: stockIsError, isLoading: stockLoading, isFetching: stockFeching } = useQuery(["stockByIdProd", stock], () => stockByProId(stock),
        {
            refetchOnWindowFocus: false,
            onSuccess: (e) => {
                console.log(e);
                setStockDetail({
                    ...stockDetail,
                    stkId: e.STK_ID
                })
                setstockActual(e.STK_TODAY)
            }
        });
    const { mutateAsync: createStockDetail } = useMutation(CreateStockDetail);
    const { mutateAsync: updateStock } = useMutation(UpdateStock);

    async function HadleClick() {
        const resulDetail = await createStockDetail(stockDetail)
        console.log(resulDetail);

        queryClient.invalidateQueries('stockDetail')
        if (resulDetail.status == 200) {
            queryClient.invalidateQueries('stockByIdProd')
            console.log({
                STK_ID: stockDetail.stkId,
                stock: {
                    STK_TODAY: stockActual + stockDetail.cantidad
                }
            });
            updateStock({ STK_ID: stockDetail.stkId, stock: { STK_TODAY: stockActual + stockDetail.cantidad } })
        }
    }

    function HadleInput(value: any) {
        setStockDetail({
            ...stockDetail,
            cantidad: Number(value)
        })
    }

    return (
        <>
            <Box onClick={onOpen} w={"fit-content"} display="flex" gap={5} flexWrap="wrap">
                <CategoriaComp background setCategoria={setIdCategori} />
            </Box>
            <Modal
                closeOnOverlayClick={false}
                closeOnEsc={false}
                isOpen={isOpen}
                onClose={() => {
                    setStockDetail({
                        ...stockDetail,
                        cantidad: 0
                    })
                    setstock(0)
                    onClose()
                }}
                size="xl">
                <ModalOverlay />
                <ModalContent maxW="80%">
                    <ModalHeader>Registrar Stock</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>

                        {
                            !product || (product && product.message) || catLoading || catIsError ?
                                <Skeleton height="35%" borderRadius="5px" />
                                :
                                <Select onChange={(e: any) => {
                                    setstock(e.target.value)
                                }}>
                                    <option value={""} >Seleccion un Producto</option>
                                    {//@ts-ignore
                                        product.map((pro, idx) =>
                                            <option key={idx} value={pro.PRO_ID} >{pro.PRO_NAME}</option>
                                        )}
                                </Select>

                        }
                        <br />
                        <NumberInput onChange={(e) => {
                            HadleInput(e);
                            console.log(stock);
                        }} defaultValue={0} precision={2} step={0.2}>
                            <NumberInputField />
                            <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                            </NumberInputStepper>
                        </NumberInput>
                        <br />
                        <Button
                            onClick={() => {
                                HadleClick()
                            }}
                            disabled={stockDetail.cantidad == 0 || stockDetail.stkId == 0 || stock == 0}>
                            Agregar Stock
                        </Button>
                        <DataStock datastock={datastock} stockIsError={stockIsError} stockLoading={stockLoading} stockFeching={stockFeching} />
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            onClick={() => (onClose())}>
                            Cancelar
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}
const DataStock = (
    {
        datastock,
        stockIsError,
        stockLoading,
        stockFeching
    }: {
        datastock: any,
        stockIsError: any,
        stockLoading: any,
        stockFeching: any
    }) => {

    console.log(datastock);

    if (stockLoading || stockFeching)
        return (
            <Grid
                h="auto"
                templateRows="repeat(5, auto)"
                templateColumns="repeat(8, 12.5%)"
                w="full">
                <GridItem mx={2} mt="15px" colSpan={4}>
                    Stock Actual {<Skeleton w={2} h={2} />}
                </GridItem>
                <GridItem mx={2} mt="15px" colSpan={4}>
                    Otro dato {<Skeleton w={2} h={2} />}
                </GridItem>
                <GridItem mx={2} mt="15px" colSpan={8}>
                    Fecha de la Ultima Actualizacion {<Skeleton w={2} h={2} />}
                </GridItem>
            </Grid>
        );
    //@ts-ignore
    if (stockIsError) return <h1>{error.message}</h1>;
    if (datastock.message) return <h1>{datastock.message}</h1>;

    return (
        <>
            <Grid
                h="auto"
                templateRows="repeat(5, auto)"
                templateColumns="repeat(8, 12.5%)"
                w="full">
                <GridItem mx={2} mt="15px" colSpan={4}>
                    Stock Actual {datastock.STK_TODAY}
                </GridItem>
                <GridItem mx={2} mt="15px" colSpan={4}>
                    Otro dato {datastock.STK_STATUS}
                </GridItem>
                <GridItem mx={2} mt="15px" colSpan={8}>
                    Fecha de la Ultima Actualizacion {datastock.STK_DATE_UPGRADE}
                </GridItem>
            </Grid>
            <StockDetailTable idStock={datastock.STK_ID} />
        </>
    )
}
const StockDetailTable = ({ idStock }: { idStock: any }) => {
    const { data, isLoading, isFetching, isError, error } = useQuery('stockDetail', () => stockDetailByStockId(idStock), { refetchOnWindowFocus: false });

    const columns = [
        {
            Header: 'ID',
            accessor: 'STD_ID'
        },
        {
            Header: 'Entrada',
            accessor: 'STD_INPUT'
        },
        {
            Header: 'Fecha de Entrada',
            accessor: 'STD_DATECREATED'
        },

    ]

    if (isLoading || isFetching) return (
        <Stack>
            <Skeleton height="70px" />
            <Skeleton height="70px" />
            <Skeleton height="70px" />
            <Skeleton height="70px" />
            <Skeleton height="70px" />
            <Skeleton height="70px" />
            <Skeleton height="70px" />
        </Stack>
    )
    if (data.message) return (
        <Stack>
            <Text>{data.message}</Text>
        </Stack>
    )
    // @ts-ignore
    if (isError) return <h1>{error.message} {':('}</h1>
    return (
        <>
            <MyReactTable
                columns={columns}
                data={data}
                isPaginated
                hasFilters
                pagesOptions={[50, 75, 100]} />
        </>
    )
}
