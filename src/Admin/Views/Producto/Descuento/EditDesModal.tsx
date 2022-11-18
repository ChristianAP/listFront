import { Modal, ModalBody, Text, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, IconButton, Stack, Skeleton, Image, Button } from '@chakra-ui/react'
import { MyReactTable } from '../../../../GlobalUI/Table/MyReactTable';
import React, { ReactNode, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { deleteDiscountDetail, getDiscountDetail } from '../../../../Service/DescuentoAdminService';
import { AiFillDelete } from 'react-icons/ai';

export const EditDesModal = ({ children, discount }: { children: ReactNode, discount: any }) => {

    const { isOpen, onOpen, onClose } = useDisclosure()

    return (
        <>
            <div onClick={onOpen}>
                {children}
            </div>
            <Modal
                closeOnOverlayClick={false}
                isOpen={isOpen}
                onClose={onClose}
                size="3xl"
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Editar Productos de esta Lista de Descuento</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <ProductByIdDiscountTable DIS_ID={discount.DIS_ID} />
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={onClose}>Cancelar</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}
const ProductByIdDiscountTable = ({ DIS_ID }: { DIS_ID: any }) => {
    const { isLoading, isError, data, error, isFetching, refetch } = useQuery('productswithdicount', () => getDiscountDetail(DIS_ID), { refetchOnWindowFocus: false })
    const columns = [
        {
            // ? TEXTO PARA RENDERIZAR EN LOS THead
            Header: 'ID',
            // ? TEXTO PARA RENDERIZAR EN LOS TFooter
            Footer: 'ID',
            // ? EN EL ACCESOR SE INDICA EL KEY DE LA DATA
            accessor: 'PRO_ID',
            // ? SE DESHABILITA LOS FILTROS PARA ESTA COLUMNA
            disableFilters: true
        },
        {
            Header: 'Acciones',
            Footer: 'Acciones',
            id: 'imagen',
            // @ts-ignore
            Cell: ({ row }) => (
                <Image width="80%" src={row.original.PRO_IMAGE} />
            ),
        },
        {
            Header: 'Nombre',
            Footer: 'Nombre',
            accessor: 'PRO_NAME',
            filter: 'fuzzyText',
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
    if (data.message) return (
        <Stack>
            <Text>{data.message}</Text>
        </Stack>
    )
    // @ts-ignore
    if (isError) return <h1>{error.message} {':('}</h1>

    return (
        <>
            {/* <IconButton m="2" onClick={() => refetch()} aria-label="Recargar" icon={<IoReload />} /> */}
            <MyReactTable columns={columns} data={data} isPaginated hasFilters pagesOptions={[50, 75, 100]} />
        </>
    )
}
const ActionCell = ({ discount }: { discount: any }) => {
    const queryClient = useQueryClient()
    const { mutate, isLoading } = useMutation(deleteDiscountDetail, {
        onSuccess: () => {
            queryClient.invalidateQueries('productswithdicount')
        }
    })
    function delteDiscountDetail() {
        mutate(discount.DSP_ID)
    }
    return (
        <Stack direction={{ base: "column", md: "row" }}>
            <IconButton onClick={delteDiscountDetail} isLoading={isLoading} icon={<AiFillDelete />} aria-label="Eliminar" colorScheme="red" />
        </Stack>)
}