import React, { ReactNode, useRef, useState } from 'react'
import {
    Modal, Stack, Skeleton, IconButton, ModalCloseButton, ModalContent,
    ModalFooter, ModalHeader, ModalOverlay, useDisclosure, Button,
    AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter,
    AlertDialogHeader, AlertDialogOverlay, Flex, Box, Tabs, TabList, Tab, TabPanels, TabPanel
} from '@chakra-ui/react'
import { Form, Formik } from 'formik';
import * as yup from 'yup'
import { MyImageInput, MyTextArea, MyTextInput } from '../../../../GlobalUI/Forms/MyInputs';
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { AiFillDelete } from 'react-icons/ai';
import { MyReactTable } from '../../../../GlobalUI/Table/MyReactTable';
import { DeletePriceLisDialog } from './DeletePricelistDialog';
import { IoMdCheckmark } from 'react-icons/io';
import { editePriceList, getPriceByPL_ID, getProducsWithoutPriceList } from '../../../../Service/PriceListAdminService';
import { FaPlus } from 'react-icons/fa';

export const ProductList = ({ children, prlid }: { children: ReactNode, prlid: number }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()

    return (
        <>
            <div onClick={onOpen}>
                {children}
            </div>
            <Modal
                closeOnOverlayClick={false}
                size="6xl"
                isOpen={isOpen}
                onClose={onClose}
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Lista de Insumos</ModalHeader>
                    <ModalCloseButton />
                    {/* <CreateProdListModal>
                        <Button leftIcon={<FaPlus />} colorScheme="green" >Agregar</Button>
                    </CreateProdListModal> */}
                    <Tabs>
                        <TabList>
                            <Tab>Lista de Insumos Sin Precio</Tab>
                            <Tab>Lista de Insumos</Tab>
                        </TabList>
                        <TabPanels>
                            <TabPanel><TableProduct prlid={prlid} tipo="productoutprice" /></TabPanel>
                            <TabPanel><TableProduct prlid={prlid} tipo="productprice" /></TabPanel>
                        </TabPanels>
                    </Tabs>
                </ModalContent>
            </Modal>

        </>
    )
}

/*
* SUBCOMPONENTE PARA LAS CELDAS DE 'Acciones'
? EN ESTE CASO USAMOS EL SUBCOMPONENTE PARA LOS BOTONES DE 'Eliminar', 'Editar' y EL BOTON PARA CAMBIAR ESTADO
? LOS HOOKS Y VARIABLES USADOS SON ENFOCADOS A ESTAS FUNCIONALIDADES
*/
const TableProduct = ({ prlid, tipo }: { prlid: number, tipo: string }) => {
    // ? QUERY PARA OBTENER LA DATA DEL BACKEND
    const { isLoading, isError, data, error, isFetching } = tipo == "productprice" ?
        useQuery('ProductPriceList', () => getPriceByPL_ID(prlid), { refetchOnWindowFocus: false })
        :
        useQuery('ProductOutPriceList', () => getProducsWithoutPriceList(prlid), { refetchOnWindowFocus: false });
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

    const columns = tipo == "productprice" ? [
        {
            // ? TEXTO PARA RENDERIZAR EN LOS THead
            Header: 'ID',
            // ? TEXTO PARA RENDERIZAR EN LOS TFooter
            Footer: 'ID',
            // ? EN EL ACCESOR SE INDICA EL KEY DE LA DATA
            accessor: 'PRD_ID',
            // ? SE DESHABILITA LOS FILTROS PARA ESTA COLUMNA
            disableFilters: true
        },
        {
            Header: 'Nombre',
            Footer: 'Nombre',
            accessor: 'PRO_NAME',
        },
        {
            Header: 'Precio Unitario',
            Footer: 'Precio Unitario',
            accessor: 'PRD_UNIT_PRICE',
        },
        {
            Header: 'Precio por Mayor',
            Footer: 'Precio por Mayor',
            accessor: 'PRD_PACKAGE_PRICE',
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
                <ActionCell productPriceList={row.original} />
            ),
        },
    ] : [
        {
            Header: 'Nombre',
            accessor: 'PRO_NAME',
        },
        {
            Header: 'Precio Unitario',
            id: 'actions',
            // @ts-ignore
            Cell: ({ row }) => (
                <CreatePriceByProduct productPriceList={row.original} PRL_ID={prlid} />
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
    if (data) { if (data.message) return <h1>{data.message}</h1> }
    return tipo == "productprice" ?
        <Box padding="2" margin="4" borderRadius="md" border="1px solid #E2E8F0"><MyReactTable columns={columns} data={data} isPaginated hasFilters pagesOptions={[50, 75, 100]} /></Box>
        :
        <Box padding="2" margin="4" borderRadius="md" border="1px solid #E2E8F0"><MyReactTable columns={columns} data={data} isPaginated pagesOptions={[50, 75, 100]} /></Box>
}
const ActionCell = ({ productPriceList }: { productPriceList: any }) => {

    return (
        <Stack direction={{ base: "column", md: "row" }} justifyContent="center">
            {/* // * MODAL PARA EDITAR
            {<EditPriceListModal productPriceList={productPriceList}>
                <IconButton icon={<AiFillEdit />} aria-label="Editar" colorScheme="blue" />
            </EditPriceListModal>} */}
            // ! MODAL PARA ELIMINAR
            {<DeleteProdListDialog priceListID={productPriceList.PRD_ID}>
                <IconButton icon={<AiFillDelete />} aria-label="Eliminar" colorScheme="red" />
            </DeleteProdListDialog>}
        </Stack>)
}
const CreatePriceByProduct = ({ productPriceList, PRL_ID }: { productPriceList: any, PRL_ID: number }) => {

    const queryClient = useQueryClient();
    const [UpdateState, setUpdateState] = useState(true)
    const validate = yup.object().shape({
        PRD_UNIT_PRICE: yup.number().required("Debe ingresar un número"),
        //PRD_PACKAGE_PRICE: yup.number().required("Debe ingresar un número"),
    })

    // ? OBJETO DE DEFINICIÓN DE VALORES INICIALES PARA EL FORMULARIO
    const values = {
        PRD_UNIT_PRICE: '',
        PRD_PACKAGE_PRICE: ''
    }
    const { mutateAsync, isLoading } = useMutation('createProductDetail')
    return (
        <Stack direction={{ base: "column", md: "row" }} justifyContent="center">
            <Formik
                // * VALORES INICIALES
                initialValues={values}
                // * VALIDADOR
                validationSchema={validate}
                // * ENVIAR
                onSubmit={async (values: any) => {
                    values.PRO_ID = productPriceList.PRO_ID
                    values.PRL_ID = PRL_ID
                    values.PRD_PACKAGE_PRICE = values.PRD_PACKAGE_PRICE.length > 0 ? values.PRD_PACKAGE_PRICE : values.PRD_UNIT_PRICE
                    mutateAsync(values)

                    console.log(values)

                }}
            >
                <Form>
                    <Flex onClick={() => { setUpdateState(false) }} width="100%" direction={{ base: "column", md: "row" }} gridGap="8" justifyContent="space-around" alignItems="center">
                        <MyTextInput
                            label="Precio por menor"
                            name="PRD_UNIT_PRICE"
                            type="text"
                            disabled={UpdateState}
                            placeholder="Precio por menor"
                        />
                        <MyTextInput
                            label="Precio por mayor"
                            name="PRD_PACKAGE_PRICE"
                            type="text"
                            disabled={UpdateState}
                            placeholder="Precio por mayor"
                        />
                        <Button
                            type="submit"
                            width="120px"
                            /* isLoading={isLoading} */
                            isDisabled={isLoading}
                            colorScheme="green"
                            mr={3}
                        >
                            Guardar
                        </Button>
                    </Flex>
                </Form>
            </Formik>
        </Stack>)
}
const DeleteProdListDialog = ({ children, priceListID }: { children: ReactNode, priceListID: string }) => {
    const [isOpen, setIsOpen] = useState(false)
    const cancelRef = useRef()
    const { mutateAsync, isLoading } = useMutation('deleteProductDetail')

    const onClose = () => setIsOpen(false)

    async function handleDelete() {
        // @ts-ignore
        await mutateAsync(priceListID);
        onClose()
    }

    return (
        <>
            <div onClick={() => setIsOpen(true)}>
                {children}
            </div>
            <AlertDialog
                isOpen={isOpen}
                //@ts-ignore
                leastDestructiveRef={cancelRef}
                onClose={onClose}
                closeOnOverlayClick={false}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Eliminar producto de esta lista de precios
                        </AlertDialogHeader>
                        <AlertDialogBody>
                            ¿Está seguro? No podrá deshacer esta acción después.
                        </AlertDialogBody>
                        <AlertDialogFooter>
                            <Button
                                // @ts-ignore
                                ref={cancelRef}
                                onClick={onClose}
                                isDisabled={isLoading}
                            >
                                Cancelar
                            </Button>
                            <Button
                                colorScheme="red"
                                ml={3}
                                onClick={handleDelete}
                                isLoading={isLoading}
                            >
                                Confirmar
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </>
    )
}
