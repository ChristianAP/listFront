import { Stack, Skeleton, Img, IconButton, Tooltip } from '@chakra-ui/react'
import React from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { AiFillEdit } from 'react-icons/ai';
import { MyReactTable } from '../../../../GlobalUI/Table/MyReactTable';
import { EditPromotionStatus } from '../../../../Service/PromotionAdminService';
import { ListMetodoPago } from '../../../../Service/MetodoPagoService';
import { EditFormaVentaModal } from './EditFormaVentaModal';
import { ListFormaVenta } from '../../../../Service/FormaVentaService';

export const FormaVentaTable = () => {
    const { isLoading, isError, data, error, isFetching, refetch } = useQuery('order_type', ListFormaVenta, { refetchOnWindowFocus: false })

    const columns = [
        {
            Header: 'Nombre',
            Footer: 'Nombre',
            accessor: 'ORT_NAME',
        },
        {
            Header: 'Detalle',
            Footer: 'Detalle',
            accessor: 'ORT_DETAIL',
        },
        {
            Header: 'Acciones',
            Footer: 'Acciones',
            id: 'actions',
            // @ts-ignore
            Cell: ({ row }) => (
                <ActionCell formaveta={row.original} />
            ),
        },
    ]

    if (isLoading || isFetching) return (
        <Stack>
            <Skeleton height="70px" />
            <Skeleton height="70px" />
            <Skeleton height="70px" />
            <Skeleton height="70px" />
        </Stack>
    )

    // @ts-ignore
    if (isError) return <h1>{error.message} {':('}</h1>
    // @ts-ignore
    if (data.message) return <h1>{data.message}</h1>
    return (
        <>
            {/* <IconButton m="2" onClick={() => refetch()} aria-label="Recargar" icon={<IoReload />} /> */}
            <MyReactTable columns={columns} data={data || []} isPaginated hasFilters pagesOptions={[50, 75, 100]} />
        </>
    )
}

const ActionCell = ({ formaveta }: { formaveta: any }) => {

    return (
        <Stack direction={{ base: "column", md: "row" }}>
            // * MODAL PARA EDITAR
            {<EditFormaVentaModal formaveta={formaveta}>
                <Tooltip label='Editar'>
                    <IconButton icon={<AiFillEdit />} aria-label="Editar" colorScheme="blue" />
                </Tooltip>
            </EditFormaVentaModal>}
        </Stack>)
}