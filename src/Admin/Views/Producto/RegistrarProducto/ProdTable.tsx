import { Image } from '@chakra-ui/image'
import { Stack, IconButton, Button, HStack, Spacer, Tabs, TabList, Tab, TabPanels, TabPanel, Box, Tooltip, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, Flex, Spinner, Text, ModalFooter } from '@chakra-ui/react'
import React, { useState } from 'react'
import { AiFillDelete, AiFillEdit } from 'react-icons/ai'
import { useQuery } from 'react-query'
import { MyReactTable } from '../../../../GlobalUI/Table/MyReactTable'
import { getProductswithTDandCat } from '../../../../Service/ProductAdminService'
import { TableCharge, TableChargeListProduct } from '../../../UI/Components/TableCharge/tablecharge'
import { DeleteProdDialog } from './DeleteProdDialog'
import { CreateProdHijoModal, EditeProdModal } from './EditeProdModal'
import { MyContain } from '../../../UI/Components/MyContain'
import { CreateProdModal } from './CreateProdModal'
import { ButtonRefetch } from '../../../UI/Components/ButtonRefetch'
import { CgAdd } from 'react-icons/cg'
import { BsPlusLg } from 'react-icons/bs'
import { ImportProd } from './ImportProd'
import { TablaSinDatos } from '../../../UI/Components/TablaSinDatos'

export const ProdTable = ({ online }: { online: boolean }) => {
    const [vendida, setVendida] = useState("1");
    const { data, isLoading, isError, isFetching, refetch } = useQuery('products', () => getProductswithTDandCat(online), { refetchOnWindowFocus: false })


    const [carganding, setCarganding] = useState(false)
    const { isOpen, onClose, onOpen } = useDisclosure()
    const columns = [
        {
            Header: 'Categoría',
            Footer: 'Categoría',
            accessor: 'CAT_NAME'
        },
        {
            Header: 'Nombre',
            Footer: 'Nombre',
            accessor: 'PRO_NAME'
        },
        {
            Header: 'Imagen',
            Footer: 'Imagen',
            id: 'pro_image',
            // @ts-ignore
            Cell: ({ row }) => <Image borderRadius={"full"} boxSize="80px" style={{ objectFit: "cover" }} src={row.original.PRO_IMAGE} />
        },
        {
            Header: 'Descripción',
            Footer: 'Descripción',
            accessor: 'PRO_DESCRIPTION'
        },
        {
            Header: 'Código',
            Footer: 'Código',
            accessor: 'PRO_CODE'
        },
        {
            Header: 'Acciones',
            Footer: 'Acciones',
            id: 'pro_acciones',
            // @ts-ignore
            Cell: ({ row }) => <ActionCell pro={row.original} />
        },
    ]

    //@ts-ignore
    if (isError) return <h1>{error.message}</h1>;

    return (
        <>
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
                    <CreateProdModal online={online}>
                        <Button colorScheme="green" >Agregar</Button>
                    </CreateProdModal>
                    {online && <ImportProd setCarganding={setCarganding} />}
                    <Spacer />
                    <ButtonRefetch refetch={refetch} />
                </HStack>
            </MyContain>
            {isLoading || isFetching ?
                <TableChargeListProduct /> :
                online
                    ?
                    <MyContain>
                        <Tabs variant='enclosed'>
                            <TabList>
                                <Tab onClick={() => { }}>Disponibles</Tab>
                                <Tab onClick={() => { }}>Vendidas</Tab>
                            </TabList>
                            <TabPanels>
                                <TabPanel>
                                    {(isLoading || isFetching) ? (<TableCharge />) : (data.length > 0) ?
                                        (
                                            <Box w="full">
                                                <MyReactTable columns={columns} data={data.status == 200 ? [] : data.filter((req: any) => {
                                                    return req.PRO_AGOTADO == "1";
                                                })} isPaginated hasFilters pagesOptions={[50, 75, 100]} />
                                            </Box>
                                        ) :
                                        (<TablaSinDatos message="No hay Ventas" />)}
                                </TabPanel>
                                <TabPanel>
                                    {(isLoading || isFetching) ? (<TableCharge />) : (data.length > 0) ?
                                        (
                                            <Box w="full">
                                                <MyReactTable columns={columns} data={data.status == 200 ? [] : data.filter((req: any) => {
                                                    return req.PRO_AGOTADO == "0";
                                                })} isPaginated hasFilters pagesOptions={[50, 75, 100]} />
                                            </Box>
                                        ) :
                                        (<TablaSinDatos message="No hay Ventas" />)}
                                </TabPanel>
                            </TabPanels>
                        </Tabs>
                    </MyContain>
                    : <MyContain>
                        <MyReactTable columns={columns} data={data.status == 200 ? [] : data} isPaginated hasFilters pagesOptions={[50, 75, 100]} />
                    </MyContain>}
        </>

    )

}

const ActionCell = ({ pro }: { pro: any }) =>
    <Stack direction={{ base: "column", md: "row" }}>
        {pro.PRO_FATHER == 1 && <CreateProdHijoModal product={{ ...pro, PRO_REMISION: (pro.PRO_REMISION == 1) }}>
            <Tooltip label='Registrar Cliente con Insumo'>
                <IconButton borderRadius={"full"} icon={<BsPlusLg />} aria-label="Editar" colorScheme="blue" />
            </Tooltip>
        </CreateProdHijoModal>}
        <EditeProdModal product={{ ...pro, PRO_REMISION: (pro.PRO_REMISION == 1), PRO_FATHER: (pro.PRO_FATHER == 1), PRO_INAFECT: (pro.PRO_INAFECT == "1") }}>
            <Tooltip label='Editar'>
                <IconButton icon={<AiFillEdit />} aria-label="Editar" colorScheme="blue" />
            </Tooltip>
        </EditeProdModal>
        <DeleteProdDialog proId={pro.PRO_ID}>
            <Tooltip label='Eliminar'>
                <IconButton icon={<AiFillDelete />} aria-label="Eliminar" colorScheme="red" />
            </Tooltip>
        </DeleteProdDialog>
    </Stack>