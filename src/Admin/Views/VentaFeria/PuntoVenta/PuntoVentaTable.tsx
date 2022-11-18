import { Button, Flex, Grid, Text } from '@chakra-ui/react'
import React from 'react'
import { useQuery } from 'react-query'
import { MyReactTable } from '../../../../GlobalUI/Table/MyReactTable'
import { getPointSales } from '../../../../Service/PoaintSaleService'
import { TableCharge } from '../../../UI/Components/TableCharge/tablecharge'
import { DeletePosModal } from './DeletePosModal'
import { UpdatePosModal } from './UpdatePosModal'
import { IconButton } from '@chakra-ui/react'
import { AiTwotoneDelete } from 'react-icons/ai'
import { BsPencilFill } from 'react-icons/bs'

export const PuntoVentaTable = () => {
    const { data, isError, isLoading, isFetching, refetch } = useQuery("PointSales", getPointSales, { refetchOnWindowFocus: false })

    const columns = [
        {
            Header: "Nombre",
            accessor: "POS_NAME",
            filter: "fuzzyText",
        },
        {
            Header: "Descripción",
            accessor: "POS_DESCRIPTION",
            filter: "fuzzyText",
        },
        {
            Header: "Dirección",
            accessor: "POS_DIRECTION",
            disableFilters: true,
        },
        {
            Header: "Acciones",
            id: "actions",

            // @ts-ignore
            Cell: ({ row }) => <ActionCell ven={row.original} />,
        },
    ];

    // @ts-ignore
    if (isLoading || isFetching) return (<TableCharge />)

    // @ts-ignore
    if (isError) return <h1>{error.message} </h1>;
    return (
        <>
            <MyReactTable 
             columns={columns}
             data={data}
             isPaginated
             hasFilters/>           
        </>
    )
}
const ActionCell = (ven : any) => (
    <>
    <Flex gap={'10px'} justifyContent={'center'}>
        <DeletePosModal pointSale = {ven["ven"]}>
            <IconButton aria-label='Delete Point Sale' bg={'red.600'} color={'white'} icon={<AiTwotoneDelete />} />
        </DeletePosModal>
        <UpdatePosModal pointSale={ven["ven"]}>
            <IconButton aria-label='Delete Point Sale' bg={'blue.600'} color={'white'} icon={<BsPencilFill />} />
        </UpdatePosModal>
    </Flex>
    </>
)