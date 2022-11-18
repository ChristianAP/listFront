//DescTable
import { Button, IconButton, Stack, Skeleton, Image, Tooltip } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { AiFillDelete, AiFillEdit } from 'react-icons/ai';
import { EditDesModal } from './EditDesModal';
import { DeleteDescDialog } from './DeleteDescDialog';
import { MyReactTable } from '../../../../GlobalUI/Table/MyReactTable';
import { editeDiscount, getDiscountHeader } from '../../../../Service/DescuentoAdminService';

export const DescTable = ({ online }: { online: boolean }) => {

    // ? QUERY PARA OBTENER LA DATA DEL BACKEND
    const { isLoading, isError, data, error, isFetching, refetch } = useQuery('discounts', () => getDiscountHeader(online), { refetchOnWindowFocus: false })
    /*
    ? SE DEFINE LOS TEXTOS A RENDERIZAR
    ? LOS KEY SERÁN USADOS PARA RENDERIZAR LA DATA
    */
    const columns = [
        {
            // ? TEXTO PARA RENDERIZAR EN LOS THead
            Header: 'ID',
            // ? TEXTO PARA RENDERIZAR EN LOS TFooter
            Footer: 'ID',
            // ? EN EL ACCESOR SE INDICA EL KEY DE LA DATA
            accessor: 'DIS_ID',
            // ? SE DESHABILITA LOS FILTROS PARA ESTA COLUMNA
            disableFilters: true
        },
        {
            Header: 'Nombre',
            Footer: 'Nombre',
            accessor: 'DIS_NAME',
            filter: 'fuzzyText',
        },
        {
            Header: 'Descripción',
            Footer: 'Descripción',
            accessor: 'DIS_DESCRIPTION',
        },
        {
            Header: 'Porcentaje(%)',
            Footer: 'Porcentaje(%)',
            accessor: 'DIS_PERCENTAGE',
        },

        /*
        ? SI QUEREMOS SUBCOMPONENTES EN NUESTRAS CELDAS
        ? DEBEMOS ASIGNAR UN ID A LA COLUMNA
        ? Y REEMPLAZAR EL 'accesor' POR LA PROPIEDAD 'Cell'
         */
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
                <ActionCell discount={row.original} />
            ),
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

    // @ts-ignore
    if (isError) return <h1>{error.message} {':('}</h1>
    if (data.status) return <h1>{data.message}</h1>

    return (
        <>
            {/* <IconButton m="2" onClick={() => refetch()} aria-label="Recargar" icon={<IoReload />} /> */}
            <MyReactTable columns={columns} data={data} isPaginated hasFilters pagesOptions={[50, 75, 100]} />
        </>
    )
}

/*
* SUBCOMPONENTE PARA LAS CELDAS DE 'Acciones'
? EN ESTE CASO USAMOS EL SUBCOMPONENTE PARA LOS BOTONES DE 'Eliminar', 'Editar' y EL BOTON PARA CAMBIAR ESTADO
? LOS HOOKS Y VARIABLES USADOS SON ENFOCADOS A ESTAS FUNCIONALIDADES
*/
const ActionCell = ({ discount }: { discount: any }) => {

    const status = discount.DIS_STATUS === '1'
    const queryClient = useQueryClient()
    const { mutate, isLoading } = useMutation(editeDiscount, {
        onSuccess: () => {
            queryClient.invalidateQueries('discounts')
        }
    })

    function handleStatus() {
        mutate({ ...discount, DIS_STATUS: discount.DIS_STATUS === '1' ? '2' : '1' })
    }

    return (
        <Stack direction={{ base: "column", md: "row" }}>
            // * MODAL PARA EDITAR
            <EditDesModal discount={discount}>
                <Tooltip label='Editar'>
                    <IconButton icon={<AiFillEdit />} aria-label="Editar" colorScheme="blue" />
                </Tooltip>
            </EditDesModal>
            // ! MODAL PARA ELIMINAR
            <DeleteDescDialog discountId={discount.DIS_ID}>
                <Tooltip label='Eliminar'>
                    <IconButton icon={<AiFillDelete />} aria-label="Eliminar" colorScheme="red" />
                </Tooltip>
            </DeleteDescDialog>
            <Button
                colorScheme={status ? "green" : "yellow"}
                onClick={handleStatus}
                isLoading={isLoading}
            >
                {status ? 'Activado' : 'Desactivado'}
            </Button>
        </Stack>)
}
export const DescDetailTable = ({ data, setProduct }: { data: any, setProduct: any }) => {
    const [skipPageReset, setSkipPageReset] = useState(false)
    const columns = [
        {
            Header: 'Acciones',
            id: 'imagen', // It needs an ID
            /*
            ? EL ELEMENTO 'row.original' REPRESENTA EL OBJETO DE LA DATA
            ? EN ESTE CASO 'row.original' EQUIVALE A '{CAT_ID:'1', CAT_NAME:'name', ...rest}'
            */
            // @ts-ignore
            Cell: ({ row }) => (
                <Image width="100px" src={row.original.PRO_IMAGE} />
            ),
        },
        {
            Header: 'Nombre',
            accessor: 'PRO_BARCODE',
        },
        {
            Header: 'Nombre',
            accessor: 'PRO_NAME',
        },

        /*
        ? SI QUEREMOS SUBCOMPONENTES EN NUESTRAS CELDAS
        ? DEBEMOS ASIGNAR UN ID A LA COLUMNA
        ? Y REEMPLAZAR EL 'accesor' POR LA PROPIEDAD 'Cell'
         */
        {
            Header: 'Acciones',
            id: 'actions', // It needs an ID
            /*
            ? EL ELEMENTO 'row.original' REPRESENTA EL OBJETO DE LA DATA
            ? EN ESTE CASO 'row.original' EQUIVALE A '{CAT_ID:'1', CAT_NAME:'name', ...rest}'
            */
            // @ts-ignore
            Cell: ({ row }) => (
                <IconButton onClick={() => { updateMyData(row.original.PRO_ID) }} icon={<AiFillDelete />} aria-label="Eliminar" colorScheme="red" />
            ),
        },
    ]

    const updateMyData = (PRO_ID: any) => {
        // We also turn on the flag to not reset the page
        setSkipPageReset(true)
        setProduct((old: any) =>
            old.filter((row: any) => row.PRO_ID != PRO_ID)
        )
    }

    // @ts-ignore
    //if (isError) return <h1>{error.message} {':('}</h1>
    useEffect(() => {
        setSkipPageReset(false)
    }, [data])
    return (
        <>
            {/* <IconButton m="2" onClick={() => refetch()} aria-label="Recargar" icon={<IoReload />} /> */}
            <MyReactTable columns={columns} data={data} skipPageReset={skipPageReset} updateMyData={updateMyData} />
        </>
    )
}