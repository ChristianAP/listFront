import { Flex, Box, Stack, Skeleton, IconButton, HStack, Spacer, Text, Tooltip, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, Spinner, ModalFooter } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { AiFillDelete, AiOutlineEye } from 'react-icons/ai';
import { MyReactTable } from '../../../../GlobalUI/Table/MyReactTable';
import { DeletePriceLisDialog } from './DeletePricelistDialog';
import { IoMdCheckmark } from 'react-icons/io';
import { ProductList } from './ProductList';
import { editePriceList, getPriceList } from '../../../../Service/PriceListAdminService';
import { DescargarPriceList } from './ExportPriceList';
import { MyContain } from '../../../UI/Components/MyContain';
import { ImportPriceList } from './ImportPriceList';
import { TableCharge } from '../../../UI/Components/TableCharge/tablecharge';
import { ButtonRefetch } from '../../../UI/Components/ButtonRefetch';


export const PriceListTable = () => {

    // ? QUERY PARA OBTENER LA DATA DEL BACKEND
    const { isLoading, isError, data, error, isFetching, refetch } = useQuery(['PriceList', 1], () =>  getPriceList(1), { refetchOnWindowFocus: false })

    const [carganding, setCarganding] = useState(false)

    const{isOpen, onOpen, onClose} = useDisclosure()
    const columns = [
        {
            // ? TEXTO PARA RENDERIZAR EN LOS THead
            Header: 'ID',
            // ? TEXTO PARA RENDERIZAR EN LOS TFooter
            Footer: 'ID',
            // ? EN EL ACCESOR SE INDICA EL KEY DE LA DATA
            accessor: 'PRL_ID',
            // ? SE DESHABILITA LOS FILTROS PARA ESTA COLUMNA
            disableFilters: true
        },

        {
            Header: 'Fecha de creación',
            Footer: 'Fecha de creación',
            accessor: 'PRL_CREATED',
        },
        {
            Header: 'ESTADO',
            Footer: 'ESTADO',
            // @ts-ignore
            Cell: ({ row }) => (
                <Text color={row.original.PRL_STATUS == 1 ? "green" : "red"}> <b> {row.original.PRL_STATUS == 1 ? "Activo" : "Inactivo"} </b> </Text>
            ),
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
                <ActionCell promotion={row.original} />
            ),
        },
    ]

    if (isLoading || isFetching) return (<TableCharge />)

    // @ts-ignore
    if (isError) return <h1>{error.message} {' :('}</h1>

    if (data) { if (data.message) return <h1>{data.message}</h1> }

    return (
        <>
            {/* <div id="carga" style={{'border' : '2px solid black', 'display' : carganding ? 'block' : 'none'}}> */}
            <Modal closeOnOverlayClick={false} onClose={onClose} isOpen={carganding} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader textAlign={'center'}>IMPORTANDO DATOS</ModalHeader>
                    <ModalBody>

                        <Flex flexDirection={'column'} justifyContent={'center'} alignContent='center' alignSelf={'center'} alignItems={'center'} justifyItems='center' justifySelf={'center'}>
                            <Stack direction='row' spacing={4}>
                                <Spinner size='xl' />
                            </Stack>
                            <Text textTransform={'uppercase'} fontSize='20px' fontWeight={'bold'} marginTop='10px'> CARGANDO REGISTROS </Text>
                        </Flex>

                    </ModalBody>
                    <ModalFooter>
                    </ModalFooter>
                </ModalContent>
            </Modal>


            <MyContain>
                <HStack>
                    <Flex>
                        <Box>
                            <DescargarPriceList level={'1'}/>
                            <ImportPriceList level ={'1'} setCarganding = {setCarganding}/>
                        </Box>
                    </Flex>
                    <Spacer />
                    <ButtonRefetch refetch={refetch} />
                </HStack>
            </MyContain>
            <br />
            <MyContain>
                <MyReactTable columns={columns} data={data} isPaginated hasFilters pagesOptions={[50, 75, 100]} />
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

    const status = promotion.PRL_STATUS === '1'
    const queryClient = useQueryClient();
    const { mutate, isLoading } = useMutation(editePriceList, {
        onSuccess: (res) => {
            queryClient.invalidateQueries('PriceList')
            if (res.status == 500) {
                throw new Error("error intentar mas adelante");
            }
        },
        onError: (err: Error) => alert(err.message + "error manooo")
    })

    function handleStatus() {
        mutate({ ...promotion, PRL_STATUS: promotion.PRL_STATUS === '1' ? '0' : '1' })
    }

    return (
        <Stack direction={{ base: "column", md: "row" }} justifyContent="center">
            {<DeletePriceLisDialog priceListID={promotion.PRL_ID}>
                <Tooltip label='Eliminar'>
                    <IconButton icon={<AiFillDelete />} aria-label="Eliminar" colorScheme="red" />
                </Tooltip>
            </DeletePriceLisDialog>}
            {<ProductList prlid={promotion.PRL_ID}>
                <Tooltip label='Lista de Insumos'>
                    <IconButton icon={<AiOutlineEye />} aria-label="Ver" border="none" variant="outline" colorScheme="teal" />
                </Tooltip>
            </ProductList>}
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