import { Box, Button, Grid, GridItem, Input, Skeleton } from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";
import { MyReactTable } from "../../../../GlobalUI/Table/MyReactTable";
import { getPointSaleById, getSaleByPOS } from "../../../../Service/PoaintSaleService";
import { MyContain } from "../../../UI/Components/MyContain";
import { DeletePosModal } from "../PuntoVenta/DeletePosModal";
import { IconButton } from '@chakra-ui/react'
import { BsFillTrashFill } from "react-icons/bs";
import { TableCharge } from "../../../UI/Components/TableCharge/tablecharge";
import { CalculadorTotal } from "../../Venta/RealizarVenta/CalculadoraTotal";
import { BiSearch } from "react-icons/bi";
import { FiDelete } from "react-icons/fi";

export const VentaPosTable = ({
    POS_ID,
    array,
    setArray,
    listProd,
    setListProd,
    cambio,
    vuelto,
    descuento,
    total,
    subtotalGeneral,
    descuentoGeneral,
    totalMontoInafecto,
    totalIGVInafecto,
    totalIGV,
    totalGravada,
    totalSubTotal,
    SetCambio,
    SetVuelto,
    SetDescuento,
    SetTotal,
    SetSubtotalGeneral,
    SetDescuentoGeneral,
    SetTotalMontoInafecto,
    SetTotalIGVInafecto,
    SetTotalIGV,
    SetTotalGravada,
    SetTotalSubTotal,
    formDetalle,
    SetFormDetalle,
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
    POS_ID: any,
    array: any,
    setArray: any,
    listProd: any,
    setListProd: any,
    cambio: any,
    vuelto: any,
    descuento: any,
    total: any,
    subtotalGeneral: any,
    descuentoGeneral: any,
    totalMontoInafecto: any,
    totalIGVInafecto: any,
    totalIGV: any,
    totalGravada: any,
    totalSubTotal: any,
    SetCambio: any,
    SetVuelto: any,
    SetDescuento: any,
    SetTotal: any,
    SetSubtotalGeneral: any,
    SetDescuentoGeneral: any,
    SetTotalMontoInafecto: any,
    SetTotalIGVInafecto: any,
    SetTotalIGV: any,
    SetTotalGravada: any,
    SetTotalSubTotal: any,
    formDetalle: any,
    SetFormDetalle: any
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
    const { data, isError, isFetching, isLoading, refetch } = useQuery(['VentaByPOS', POS_ID], () => getSaleByPOS(POS_ID), { refetchOnWindowFocus: false })
    const valorcito = useRef(null)

    const [skipPageReset, setSkipPageReset] = useState(false);
    const columns = [
        {
            Header: "Nombre Producto",
            accessor: "PRO_NAME",
        },
        {
            Header: "Precio",
            accessor: "RDT_PRICE",
        },
        {
            Header: "Peso",
            accessor: "RDT_AMOUNT",
        },
        {
            Header: "Codigo de Barra",
            accessor: "RDT_CODEBAR",
        },
        {
            Header: "Acciones",
            id: "actions",

            // @ts-ignore
            Cell: ({ row }) => <ActionCell setArray={setArray} setListProd={setListProd} row={row.original} array={array} />,
        },
    ];
    const [listCode, setListCode] = useState<Array<any>>([])
    function searchCodebar(event: any) {
        // busca para agregar la tabla :D
        setListCode(array.filter((element: any) => {
            return element.RDT_CODEBAR == event.target.value
        }))
    }

    function handleEnter(event: any) {
        // esto atualiza la tabla :D
        if (event.keyCode === 13) {
            if (listCode[0]) {
                setListProd((old: any) => [...old, {
                    ...(listCode[0]),
                    STK_TODAY: listCode[0].stock,
                    cantidad: listCode[0].RDT_AMOUNT,
                    descuento: 0,
                    precio: listCode[0].RDT_PRICE,
                    subtotal: listCode[0].RDT_PRICE,
                    total: listCode[0].RDT_PRICE
                }])
                // @ts-ignore
                setArray((old) => old.filter((d: any) => d.RDT_ID !== listCode[0].RDT_ID))
                // @ts-ignore
                valorcito.current.value = ''
                console.log(array);

            } else {
                alert("NO HAY REGISTROS DE ESTE CÓDIGO")
            }
        }

    }
    function updateMyData(row: any) {
        setSkipPageReset(true);
        console.log(row.index);

        // @ts-ignore
        setProds((old: any) => {
            // @ts-ignore
            return old.filter((val, idx) => idx !== row.index);
        });
    }

    useEffect(() => {
        setSkipPageReset(false);
    }, [listProd]);

    useEffect(() => {
        setArray(data)
    }, [data])
    console.log(categoria);

    // @ts-ignore
    /* if (isLoading || isFetching) return (<TableCharge />) */

    // @ts-ignore
    if (isError) return <h1>{error.message} </h1>;

    return (
        <Box w={{ base: '100%', md: '60%' }}>
            <MyContain>
                <Input placeholder='Codigo de Barras' onKeyUp={searchCodebar} onKeyDown={handleEnter} ref={valorcito} />
                {(isLoading || isFetching) ?
                    <TableCharge />
                    : <Box w={"100%"} overflow={"auto"} maxH={"280px"}>
                        <MyReactTable
                            columns={columns}
                            // @ts-ignore
                            data={listProd}
                            skipPageReset={skipPageReset}
                            updateMyData={updateMyData} />
                    </Box>
                }
                <CalculadorTotal
                    totalIGV={totalIGV}
                    SetTotal={SetTotal}
                    total={total}
                    subtotalGeneral={subtotalGeneral}
                    descuentoGeneral={descuentoGeneral}
                    SetDescuentoGeneral={SetDescuentoGeneral}
                    SetFormDetalle={SetFormDetalle}
                    numeros={numeros}
                    price={price}
                    setPrice={setPrice}
                />
            </MyContain>
            <Box h={"10px"}></Box>
            <MyContain>
                {numeros &&
                    <Box>
                        <Grid
                            marginY="8px" templateColumns={"repeat(3,1fr)"} gap="8px">{
                                numeros.map((val: any, idx: number) =>
                                    <GridItem>
                                        <Button h={"60px"} disabled={0 == categoria} onClick={() => handleButton(val)} key={idx} width={"100%"}>{val}</Button>
                                    </GridItem>)
                            }
                            <GridItem>
                                <IconButton h={"60px"} disabled={0 == categoria} width={"100%"} onClick={handleDelete} aria-label='delete' icon={<FiDelete />} />
                            </GridItem>
                            <GridItem>
                                <IconButton h={"60px"} disabled={0 == categoria} onClick={() => {
                                    setProductos(array.filter((d: any) => {
                                        console.log(d);
                                        return d.RDT_PRICE == price && d.CAT_ID == categoria
                                    }))
                                    const filtro = array.filter((d: any) => {
                                        console.log(d);
                                        return d.RDT_PRICE == price && d.CAT_ID == categoria
                                    })
                                    setArray((old: any) => old.filter((d: any) => d.RDT_ID !== (filtro[0] ? filtro[0].RDT_ID : 0)))
                                    setListProd((old: any) => filtro[0] ? [
                                        ...old,
                                        {
                                            ...(filtro[0]),
                                            STK_TODAY: filtro[0].stock,
                                            cantidad: filtro[0].RDT_AMOUNT,
                                            descuento: 0,
                                            precio: filtro[0].RDT_PRICE,
                                            subtotal: filtro[0].RDT_PRICE,
                                            total: filtro[0].RDT_PRICE
                                        }
                                    ] : [...old])
                                }} width={"100%"} aria-label='Search database' icon={<BiSearch />} />
                            </GridItem>
                        </Grid>
                    </Box>}
            </MyContain>
        </Box>
    )

}

const ActionCell = ({ setArray, setListProd, row, array }: { setArray: any, setListProd: any, row: any, array: any }) => {
    function handleDelete() {
        setListProd((old: any) => old.filter((d: any) => d.RDT_ID !== row.RDT_ID));
        setArray((old: any) => [...old, row]);
        console.log(array);

    }
    return (


        <IconButton aria-label="eliminar venta en punto de venta" onClick={handleDelete} icon={<BsFillTrashFill />} />

    )
}