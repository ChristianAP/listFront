import React, { useEffect, useState } from "react";
import { Button, IconButton, Input, Select } from '@chakra-ui/react'

import { Box, Flex, Grid, GridItem, Image, Skeleton, Text } from "@chakra-ui/react";
import { producstCategoria } from "../../../../Service/RemisionAdminService";
import { useQuery } from "react-query";
import { IoReturnDownBack } from "react-icons/io5";
import { FiDelete } from "react-icons/fi";
import { BiSearch } from "react-icons/bi";
import { producstByCatId } from "../../../../Service/StockAdmin";

export const FindProductPOD = ({ array,
    setListProd,
    setArray,
    numeros,
    price,
    setPrice,
    handleButton,
    handleDelete,
    categoria,
    setCategoria,
    productos,
    setProductos,
}: {
    array: any,
    setListProd: any,
    setArray: any,
    numeros: any,
    price: any,
    setPrice: any,
    handleButton: any,
    handleDelete: any,
    categoria: any,
    setCategoria: any,
    productos: any,
    setProductos: any,
}) => {
    const { data, isLoading: loadingCat, isFetching, isError: errorCat, refetch: refetchCat } = useQuery(
        "productsCategorias",
        () => producstCategoria(),
        {
            refetchOnWindowFocus: false,
        }
    );
    const { data: Prod, isLoading: loadingProd, isFetching: fetchingProd, isError: errorProd, refetch: refetchCatProd } = useQuery(
        ["productsProd", categoria],
        () => producstByCatId(categoria),
        {
            refetchOnWindowFocus: false,
        }
    );
    const [producto, setProducto] = useState(0)

    const [selectProd, setSelectProd] = useState(false)

    const [nextStep, setNextStep] = useState(false)


    useEffect(() => {
        setProductos(array.filter((element: any) => element.CAT_ID == categoria))
    }, [categoria])
    useEffect(() => {
        setProductos(array.filter((element: any) => element.PRO_ID == producto))
    }, [producto])

    useEffect(() => {
        if (array && !array.message) {
            setProductos(array.filter((element: any) => element.CAT_ID == categoria))
        }
    }, [array])

    if (errorCat) {
        return <h1>Error</h1>;
    }
    //@ts-ignore
    if (data && data.message) {
        return <h1>No hay data</h1>;
    }
    return (
        <>
            {!nextStep ?
                <Box>
                    <Grid templateColumns="repeat(6, 16.6%)" >
                        {!selectProd ? <>


                            {loadingCat || isFetching ?
                                <>
                                    <Skeleton h={"70px"} w={"100%"} />
                                </> :
                                <>
                                    {data.map((val: any, idx: number) => (
                                        <GridItem
                                            key={idx}
                                            colSpan={2}
                                            transition="box-shadow .5s"
                                            padding="10px"
                                            position="relative"
                                            boxSize={"130px"}
                                            display="flex"
                                            justifyContent="center"
                                            cursor="pointer"
                                            alignItems="center"
                                            borderRadius="20px"
                                            _hover={{
                                                color: "#2796ff",
                                                boxShadow: "0 0 20px rgba(33, 33, 33, .2)"
                                            }}
                                            className="other__cat"
                                            onClick={() => {
                                                setCategoria(val.CAT_ID);
                                                setSelectProd(true);
                                            }}
                                        >
                                            <Image
                                                src={val.CAT_IMAGE}
                                                alt={val.CAT_NAME}
                                                /* width={{ base: "125px", md: "250px" }} */
                                                height={"auto"}
                                                objectFit="cover"
                                            />
                                            <div className="button__cat">
                                                <Text fontWeight={"150px"} fontSize={"1.2rem"}>
                                                    {val.CAT_NAME}
                                                </Text>
                                            </div>
                                        </GridItem>
                                    ))

                                    }
                                </>
                            }
                        </> : <>
                            {!loadingProd
                                &&
                                //@ts-ignore
                                Prod.map((val: any, idx: number) => (
                                    <GridItem
                                        key={idx}
                                        colSpan={2}
                                        transition="box-shadow .5s"
                                        padding="10px"
                                        position="relative"
                                        boxSize={"130px"}
                                        display="flex"
                                        justifyContent="center"
                                        cursor="pointer"
                                        alignItems="center"
                                        borderRadius="20px"
                                        _hover={{
                                            color: "#2796ff",
                                            boxShadow: "0 0 20px rgba(33, 33, 33, .2)"
                                        }}
                                        className="other__cat"
                                        onClick={() => {
                                            //algoritmo para filtrar segun el codigo de barras
                                            setProducto(val.PRO_ID)

                                            setNextStep(true);
                                        }}
                                    >
                                        <Image
                                            src={val.PRO_IMAGE}
                                            alt={val.PRO_NAME}
                                            /* width={{ base: "125px", md: "250px" }} */
                                            height={"auto"}
                                            objectFit="cover"
                                        />
                                        <div className="button__cat">
                                            <Text fontWeight={"150px"} fontSize={"1.2rem"}>
                                                {val.PRO_NAME}
                                            </Text>
                                        </div>
                                    </GridItem>
                                ))

                            }

                        </>
                        }


                    </Grid >
                </Box > :
                <Box>
                    <Flex>
                        <IconButton aria-label='Search Product' icon={<IoReturnDownBack />} onClick={() => { setNextStep(false); setSelectProd(false) }} />
                         <Input type={"text"} placeholder="Ingrese un Precio" value={price}
                            onKeyDown={(e: any) => {
                                if (e.keyCode === 13) {
                                    console.log(e.target.value);
                                    setProductos(array.filter((d: any) => {
                                        console.log(d);
                                        return d.RDT_PRICE == e.target.value && d.CAT_ID == categoria
                                    }))
                                }
                            }}
                            //display={{ base: "block", lg: "none" }}

                        />
                        {/* <Input type={"text"} placeholder="Ingrese un Precio"
                            onKeyDown={(e: any) => {
                                if (e.keyCode === 13) {
                                    console.log(e.target.value);
                                    setProductos(array.filter((d: any) => {
                                        console.log(d);
                                        return d.RDT_PRICE == e.target.value && d.CAT_ID == categoria
                                    }))
                                }
                            }}
                        /> */}
                    </Flex>
                    {loadingCat || isFetching ?
                        <>
                            <Skeleton h={"70px"} w={"100%"} />
                        </> :

                        <Select
                            placeholder="Seleccione un Producto"
                            onChange={(e) => {
                                console.log(e.target.value, JSON.parse(e.target.value));
                                setListProd((old: any) => [...old,
                                {
                                    ...(JSON.parse(e.target.value)),
                                    STK_TODAY: JSON.parse(e.target.value).stock,
                                    cantidad: JSON.parse(e.target.value).RDT_AMOUNT,
                                    descuento: 0,
                                    precio: JSON.parse(e.target.value).RDT_PRICE,
                                    subtotal: JSON.parse(e.target.value).RDT_PRICE,
                                    total: JSON.parse(e.target.value).RDT_PRICE
                                }])
                                setArray((old: any) => old.filter((d: any) => d.RDT_ID !== JSON.parse(e.target.value).RDT_ID))
                            }}>
                            {productos.map((val: any, idx: number) => (
                                <option value={JSON.stringify(val)} style={{ backgroundImage: "url(https://aprendiendoadministracion.com/wp-content/uploads/2016/04/Nunca-hagas-un-proyecto-sin-planeaci%C3%B3n-1.jpg)" }}>
                                    {val.PRO_NAME}
                                </option>
                            ))}
                        </Select>
                    }

                </Box >}
        </>
    )
} 