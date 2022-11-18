import { Stack, Skeleton, Img, IconButton } from '@chakra-ui/react'
import React from 'react'
import { useQuery } from 'react-query'
import { AiOutlineEye } from 'react-icons/ai';
import { MyReactTable } from '../../../../GlobalUI/Table/MyReactTable';
import { ViewKarxModal } from './ViewKarxModal';
import { getKardex } from '../../../../Service/kardexAdminService';
import { TableCharge } from '../../../UI/Components/TableCharge/tablecharge';

export const KarxTable = () => {
    const { isLoading, isError, data, error, isFetching, refetch } = useQuery('kardex', () => getKardex(), { refetchOnWindowFocus: false })

    const columns = [
        {
            Header: 'ID',
            accessor: 'PRO_ID',
            disableFilters: true
        },
        {
            Header: 'Imagen',
            // @ts-ignore
            Cell: ({ row }) => (
                <Img w='150px' src={ row.original.PRO_IMAGE } />
            ),
        },
        {
            Header: 'Nombre de producto',
            accessor: 'PRO_NAME',
        },
        {
            Header: 'Stock',
            accessor: 'STK_TODAY',
            disableFilters: true
        },
        {
            Header: 'Ver',
            id: 'actions',

            // @ts-ignore
            Cell: ({ row }) => (
                <ActionCell listKardex={ row.original } />
            ),
        }
    ]

    if (isLoading || isFetching) return (<TableCharge />)

    // @ts-ignore
    if (isError) return <h1>{ error.message } { ':(' }</h1>

    return (
        <>
            <MyReactTable columns={ columns } data={ data } isPaginated hasFilters pagesOptions={ [15, 25, 50] } />
        </>
    )
}

const ActionCell = ({ listKardex }: { listKardex: any }) => {

    return (
        <Stack direction={ { base: "column", md: "row" } }>
            { <ViewKarxModal kardex={ listKardex }>
                <IconButton icon={ <AiOutlineEye /> } aria-label="Editar" colorScheme="gray" />
            </ViewKarxModal> }
        </Stack>)
}