import { Button, Text, Stack, Skeleton, Img, IconButton, Tooltip } from '@chakra-ui/react'
import React from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { AiFillDelete, AiFillEdit } from 'react-icons/ai';
import { IoReload } from 'react-icons/io5';
import { getCategories } from '../../../../Service/TiendaOnlineService';/* 
import { EditCatModal } from './EditeCatModal';
import { DeleteCatDialog } from './DeleteCatDialog'; */
import { MyReactTable, NumberRangeColumnFilter } from '../../../../GlobalUI/Table/MyReactTable';
import { EditPromotionStatus, ListPromotion } from '../../../../Service/PromotionAdminService';
import { EditTipPagoModal } from './EditTipoPagoModal';
import { EditTipoPago, ListTipoPago } from '../../../../Service/PayMetho';
import { IoMdCheckmark } from 'react-icons/io';

export const TipoPagoTable = () => {

    // ? QUERY PARA OBTENER LA DATA DEL BACKEND
    const { isLoading, isError, data, error, isFetching, refetch } = useQuery('tipo_pago', ListTipoPago, { refetchOnWindowFocus: false })

    /*
    ? SE DEFINE LOS TEXTOS A RENDERIZAR
    ? LOS KEY SERÁN USADOS PARA RENDERIZAR LA DATA
    PRT_ID: number,
    PRT_CREATED_AT: string,
    PRT_DESCRIPTION: string,
    PRT_IMAGE: string,
    PRT_STATUS: string,
    PRT_TITLE: string,
    PRT_UPDATED_AT: string,
    */

    const columns = [
        {
            // ? TEXTO PARA RENDERIZAR EN LOS THead
            Header: 'ID',
            // ? TEXTO PARA RENDERIZAR EN LOS TFooter
            Footer: 'ID',
            // ? EN EL ACCESOR SE INDICA EL KEY DE LA DATA
            accessor: 'PMT_ID',
            // ? SE DESHABILITA LOS FILTROS PARA ESTA COLUMNA
            disableFilters: true
        },
        {
            Header: 'Nombre',
            Footer: 'Nombre',
            accessor: 'PMT_NAME',
        },
        {
            Header: 'Descripción',
            Footer: 'Descripción',
            accessor: 'PMT_DESCRIPTION',
        },
        {
            Header: 'Precio',
            Footer: 'Precio',
            accessor: 'PMT_PRICE',
        },
        {
            Header: 'Acciones',
            Footer: 'Acciones',
            id: 'actions', // It needs an ID
            /*
            ? EL ELEMENTO 'row.original' REPRESENTA EL OBJETO DE LA DATA
            ? EN ESTE CASO 'row.original' EQUIVALE A '{CAT_ID:'1', CAT_NAME:'name', ...rest}'
            */
            // @ts-ignore
            Cell: ({ row }) => (
                <ActionCell tipopago={row.original} />
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

/*
* SUBCOMPONENTE PARA LAS CELDAS DE 'Acciones'
? EN ESTE CASO USAMOS EL SUBCOMPONENTE PARA LOS BOTONES DE 'Eliminar', 'Editar' y EL BOTON PARA CAMBIAR ESTADO
? LOS HOOKS Y VARIABLES USADOS SON ENFOCADOS A ESTAS FUNCIONALIDADES
*/
const ActionCell = ({ tipopago }: { tipopago: any }) => {

    const status = tipopago.PMT_STATUS === '1'
    const queryClient = useQueryClient();

    const { mutate, isLoading } = useMutation(EditTipoPago, {
        onSuccess: (res) => {
            queryClient.invalidateQueries('tipo_pago')
            if (res.status == 500) {
                throw new Error("error intentar mas adelante");
            }
        },
        onError: () => alert("error intentarlo luego")
    })
    function handleStatus() {
        mutate({ ...tipopago, PMT_STATUS: tipopago.PMT_STATUS === '1' ? '0' : '1' })
    }

    return (
        <Stack direction={{ base: "column", md: "row" }}>
            // * MODAL PARA EDITAR
            {<EditTipPagoModal tipopago={tipopago}>
                <Tooltip label='Editar'>
                    <IconButton icon={<AiFillEdit />} aria-label="Editar" colorScheme="blue" />
                </Tooltip>
            </EditTipPagoModal>}
            {status ?
                <Tooltip label='Desactivar'>
                    <IconButton
                        onClick={handleStatus}
                        variant="outline"
                        colorScheme="teal"
                        aria-label="Estado"
                        icon={<IoMdCheckmark />}
                    /></Tooltip>
                :
                <Tooltip label='Activar'>
                    <IconButton
                        onClick={handleStatus} border="none"
                        variant="outline"
                        colorScheme="gray"
                        aria-label="Estado"
                        icon={<IoMdCheckmark />}
                    /></Tooltip>
            }
        </Stack>)
}