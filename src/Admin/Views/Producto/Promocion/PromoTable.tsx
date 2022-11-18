import { Button, Text, Stack, Skeleton, Img, IconButton, HStack, Spacer, useToast, Tooltip } from '@chakra-ui/react'
import React from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { AiFillDelete, AiFillEdit } from 'react-icons/ai';
import { MyReactTable } from '../../../../GlobalUI/Table/MyReactTable';
import { EditPromotionStatus, ListPromotion } from '../../../../Service/PromotionAdminService';
import { DeletePromoDialog } from './DeletePromoDialog';
import { EditPromoModal } from './EditPromoModal';
import { FaPlus } from 'react-icons/fa';
import { MyContain } from '../../../UI/Components/MyContain';
import { CreatePromoModal } from './CreatePromoModal';
import { ButtonRefetch } from '../../../UI/Components/ButtonRefetch';
import { TableCharge } from '../../../UI/Components/TableCharge/tablecharge';

export const PromoTable = () => {

    // ? QUERY PARA OBTENER LA DATA DEL BACKEND
    const { isLoading, isError, data, error, isFetching, refetch } = useQuery('promociones', ListPromotion, { refetchOnWindowFocus: false })

    const columns = [
        {
            // ? TEXTO PARA RENDERIZAR EN LOS THead
            Header: 'ID',
            // ? TEXTO PARA RENDERIZAR EN LOS TFooter
            Footer: 'ID',
            // ? EN EL ACCESOR SE INDICA EL KEY DE LA DATA
            accessor: 'PRT_ID',
            // ? SE DESHABILITA LOS FILTROS PARA ESTA COLUMNA
            disableFilters: true
        },

        {
            Header: 'Imagen',
            Footer: 'Imagen',
            accessor: 'PRT_IMAGE',
            // @ts-ignore
            Cell: ({ row }) => (
                <Img boxSize="200px" style={{ objectFit: "cover" }} src={row.original.PRT_IMAGE} />
            ),
        },
        {
            Header: 'Titulo',
            Footer: 'Titulo',
            accessor: 'PRT_TITLE',
        },
        {
            Header: 'Descripción',
            Footer: 'Descripción',
            accessor: 'PRT_DESCRIPTION',
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
                <ActionCell promotion={row.original} />
            ),
        },
    ]

    if (isLoading || isFetching) return (<TableCharge />)

    // @ts-ignore
    if (isError) return <h1>{error.message} {':('}</h1>

    // @ts-ignore
    if (data.message) return <h1>{data.message}</h1>

    return (
        <>
            <MyContain mb={3}  >
                <HStack>
                    <CreatePromoModal>
                        <Button leftIcon={<FaPlus />} colorScheme="green" >Agregar</Button>
                    </CreatePromoModal>
                    <Spacer />
                    <ButtonRefetch refetch={refetch} />
                </HStack>
            </MyContain>
            <MyContain>
                <MyReactTable columns={columns} data={data || []} isPaginated hasFilters pagesOptions={[50, 75, 100]} />
            </MyContain>
        </>
    )
}

/*
* SUBCOMPONENTE PARA LAS CELDAS DE 'Acciones'
? EN ESTE CASO USAMOS EL SUBCOMPONENTE PARA LOS BOTONES DE 'Eliminar', 'Editar' y EL BOTON PARA CAMBIAR ESTADO
? LOS HOOKS Y VARIABLES USADOS SON ENFOCADOS A ESTAS FUNCIONALIDADES
*/
const ActionCell = ({ promotion }: { promotion: any }) => {

    const status = promotion.PRT_STATUS === '1'
    const queryClient = useQueryClient();
    const toast = useToast();
    const { mutate, isLoading } = useMutation(EditPromotionStatus, {
        onSuccess: (res) => {
            queryClient.invalidateQueries('promociones')
            if (res.status == 500) {
                //@ts-ignore
                if (res.error.errno == 1062) {
                    toast({
                        title: "Acción no valida",
                        description: "Nombre de Banner ya Existente",
                        status: "warning",
                        duration: 5000,
                        isClosable: true,
                    })
                }
                throw new Error("error intentar mas adelante");
            }

        },
        onError: () => {
            toast({
                title: "Acción no valida",
                description: "Intentarlo más tarde",
                status: "warning",
                duration: 5000,
                isClosable: true,
            })
        }
    })

    function handleStatus() {
        mutate({ ...promotion, PRT_STATUS: promotion.PRT_STATUS === '1' ? '2' : '1' })
    }

    return (
        <Stack direction={{ base: "column", md: "row" }}>
            // * MODAL PARA EDITAR

            {<EditPromoModal promotion={promotion}>
                <Tooltip label='Editar'>
                    <IconButton icon={<AiFillEdit />} aria-label="Editar" colorScheme="blue" />
                </Tooltip>
            </EditPromoModal>}
            // ! MODAL PARA ELIMINAR
            {<DeletePromoDialog promoID={promotion.PRT_ID}>
                <Tooltip label='Eliminar'>
                    <IconButton icon={<AiFillDelete />} aria-label="Eliminar" colorScheme="red" />
                </Tooltip>
            </DeletePromoDialog>}
            <Button size="sm"
                colorScheme={status ? "green" : "yellow"}
                onClick={handleStatus}
                isLoading={isLoading}
            >
                <Text fontSize={{ base: "sm", md: "lg" }}>{status ? 'Activado' : 'Desactivado'}</Text>
            </Button>
        </Stack>)
}