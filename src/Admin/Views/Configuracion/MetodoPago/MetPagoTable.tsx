import { Stack, Skeleton, Img, IconButton, Tooltip, Box, Flex, FormLabel, Switch } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { AiFillEdit } from 'react-icons/ai';
import { MyReactTable } from '../../../../GlobalUI/Table/MyReactTable';
import { EditPromotionStatus } from '../../../../Service/PromotionAdminService';
import { EditStatus, ListMetodoPago } from '../../../../Service/MetodoPagoService';
import { EditMetPagoModal } from './EditMetodoPagoModal';
import { MyContain } from '../../../UI/Components/MyContain';
import { AddPlaLice } from '../../../../Service/PersonService';

export const MetodoPagoTable = () => {

    const { isLoading, isError, data, error, isFetching, refetch } = useQuery('metodo_pago', ListMetodoPago, { refetchOnWindowFocus: false })

    const columns = [
        {
            Header: 'ID',
            Footer: 'ID',
            accessor: 'MPG_ID',
            disableFilters: true
        },

        {
            Header: 'Imagen',
            Footer: 'Imagen',
            accessor: 'MPG_IMAGE',
            // @ts-ignore
            Cell: ({ row }) => (
                <Img src={row.original.MPG_IMAGE} />
            ),
        },
        {
            Header: 'Titulo',
            Footer: 'Titulo',
            accessor: 'MPG_NAME',
        },
        {
            Header: 'Descripción',
            Footer: 'Descripción',
            accessor: 'MPG_DESCRIPTION',
        },
        {
            Header: 'Acciones',
            Footer: 'Acciones',
            id: 'actions',
            // @ts-ignore
            Cell: ({ row }) => (
                <ActionCell metodopago={row.original} />
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

const ActionCell = ({ metodopago }: { metodopago: any }) => {

    const status = metodopago.PRT_STATUS === '1'
    const queryClient = useQueryClient();

    const [state, setState] = useState(metodopago.MPG_STATUS)

    const { mutateAsync } = useMutation(EditStatus)

    const { mutate, isLoading } = useMutation(EditPromotionStatus, {
        onSuccess: (res) => {
            queryClient.invalidateQueries('promociones')
            if (res.status == 500) {
                throw new Error("error intentar mas adelante");
            }
        },
        onError: () => alert("error intentarlo luego")
    })
    return (
        <Stack direction={{ base: "column", md: "row" }}>
            // * MODAL PARA EDITAR
            {<EditMetPagoModal metodopago={metodopago}>
                <Tooltip label='Editar'>
                    <IconButton icon={<AiFillEdit />} aria-label="Editar" colorScheme="blue" />
                </Tooltip>
            </EditMetPagoModal>}
            <Box>
                <MyContain>
                    <Flex flexDirection={'row'} justifyContent={'center'}>
                        {
                            state == '1' ?
                                <>
                                    <FormLabel htmlFor="ESTADO" mb="0" color={'green.300'}>
                                        ACTIVO
                                    </FormLabel>
                                    <Switch isChecked={state == '1' ? true : false} size='lg' colorScheme={'green'} onChange={async (e) => {
                                        setState('0');
                                        await mutateAsync({MPG_ID : metodopago.MPG_ID, MPG_STATUS : 0})
                                    }}

                                    />
                                </>

                                :

                                <>
                                    <FormLabel htmlFor="ESTADO" mb="0" color={'red.300'}>
                                        INACTIVO
                                    </FormLabel>
                                    <Switch isChecked={state == '1' ? true : false} size='lg' onChange={async(e) => {
                                        setState('1');
                                        await mutateAsync({MPG_ID : metodopago.MPG_ID, MPG_STATUS : 1})

                                    }}

                                    />
                                </>

                        }
                    </Flex>
                </MyContain>
            </Box>
        </Stack>)
}