import { Modal, GridItem, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, Button, Grid, Skeleton, IconButton, Box, Text } from '@chakra-ui/react'
import React, { ReactNode, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { Form, Formik } from 'formik';
import * as yup from 'yup'
import { MyCheckbox, MyImageInput, MySelect, MyTextArea, MyTextInput } from '../../../../GlobalUI/Forms/MyInputs';
import { getCategories } from '../../../../Service/CategoryAdminService';
import { ListClientes } from '../../../../Service/ClienteService';
import { BsPlusLg } from 'react-icons/bs';
import { MyReactTable } from '../../../../GlobalUI/Table/MyReactTable';
import { TableChargeListProduct } from '../../../UI/Components/TableCharge/tablecharge';
import { createProductChildren, getProductsByFather, getUnitMean } from '../../../../Service/ProductAdminService';

export const EditeProdModal = ({ children, product }: { children: ReactNode, product: any }) => {

    const { data: catOptions, isLoading: catLoading, isError: catIsError } = useQuery('catOptions', getCategories, { refetchOnWindowFocus: false })
    const { data: meanOptions, isLoading: meanLoading, isError: meanIsError } = useQuery('unitMean', getUnitMean, { refetchOnWindowFocus: false })
    console.log(product);
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [file, setFile] = useState([])
    const [image, setImage] = useState(product.PRO_IMAGE || 'https://ayjoe.engrave.site/img/default.jpg')

    const { mutateAsync, isLoading } = useMutation('editeProduct')

    const validate = yup.object().shape({
        PRO_NAME: yup.string().required("Debe ingresar un nombre"),
        //PRO_DESCRIPTION: yup.string().required("Debe ingresar una descripción"),
        PRO_BRAND: yup.string().required("Debe ingresar un nombre secundario"),
        PRO_CODE: yup.string().required("Debe ingresar un código"),
        //PRO_BARCODE: yup.string().required("Debe scanear un código  de barras"),
        PRO_CREATE_DATE: yup.date().required("Debe ingresar una fecha"),
        CAT_ID: yup.string().required("Debe seleccionar una categoría"),
    })

    return (
        <>
            <div onClick={onOpen}>
                {children}
            </div>
            <Modal
                size="xl"
                closeOnOverlayClick={false}
                isOpen={isOpen}
                onClose={onClose}
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Editar Insumo</ModalHeader>
                    <ModalCloseButton />
                    <Formik
                        initialValues={product}
                        validationSchema={validate}
                        onSubmit={async (values: any) => {
                            /* const { TDK_NAME, CAT_NAME, ...rest } = values */
                            let formData = new FormData();
                            values = {
                                ...values,
                                PRO_BARCODE:values.PRO_CODE,
                                PRO_REMISION: values.PRO_REMISION ? "1" : "0",
                                PRO_INAFECT: values.PRO_INAFECT ? "1" : "0",
                                PRO_FATHER: values.PRO_FATHER ? "1" : "0"
                            }

                            /* append input field values to formData */
                            for (let value in values) {
                                if (values[value]) {
                                    formData.append(value, values[value]);
                                } else if (value == "PRO_DESCRIPTION") {
                                    formData.append("PRO_DESCRIPTION", "");
                                }
                            }

                            /* FormData requires name: id */
                            formData.append("IMAGE", file[0]);
                            console.log(values);
                            onClose()

                            //@ts-ignore
                            await mutateAsync({ formData: formData, PRO_ID: product.PRO_ID })
                        }}
                    >
                        <Form>
                            <ModalBody pb={6}>
                                <Grid
                                    h="auto"
                                    templateRows="repeat(6, auto)"
                                    templateColumns="repeat(6, 16.6%)"
                                    w="full"
                                >
                                    <GridItem mx={2} colSpan={3}>
                                        <MyTextInput
                                            label="Nombre"
                                            name="PRO_NAME"
                                            placeholder="Nombre de producto"
                                        />
                                    </GridItem>
                                    <GridItem mx={2} colSpan={3}>
                                        <MyTextInput
                                            label="Nombre secundario"
                                            name="PRO_BRAND"
                                            placeholder="Nombre secundario / brand"
                                        />
                                    </GridItem>
                                    <GridItem mx={2} colSpan={3}>
                                        <MyTextInput
                                            type="number"
                                            label="Cantidad minima de producto"
                                            name="PRO_MIN"
                                            placeholder="10"
                                        />
                                    </GridItem>
                                    <GridItem mx={2} colSpan={3}>
                                        <MyTextInput
                                            type="number"
                                            label="Cantidad maxima de producto"
                                            name="PRO_MAX"
                                            placeholder="50"
                                        />
                                    </GridItem>
                                    <GridItem mx={2} colSpan={3}>
                                        <MyTextInput
                                            label="Fecha de Registro"
                                            name="PRO_CREATE_DATE"
                                            type="datetime-local"
                                        />
                                    </GridItem>
                                    <GridItem mx={2} colSpan={3} rowSpan={2}>
                                        <MyTextArea
                                            label="Descripción"
                                            name="PRO_DESCRIPTION"
                                            placeholder="Descripción del producto"
                                        />
                                    </GridItem>
                                    <GridItem mx={2} colSpan={3}>
                                        <MyTextInput
                                            label="Código"
                                            name="PRO_CODE"
                                            placeholder="Ingrese código de barras"
                                        />
                                    </GridItem>
                                    
                                    <GridItem mx={2} colSpan={3} rowSpan={3} >
                                        <MyImageInput setFile={setFile} image={image} setImage={setImage} />
                                    </GridItem>
                                    <GridItem mx={2} colSpan={3} >
                                        {
                                            catLoading || catIsError ?
                                                <Skeleton height="35%" borderRadius="5px" />
                                                :
                                                <MySelect
                                                    label="Categoría"
                                                    name="CAT_ID"
                                                >
                                                    <option value=""></option>
                                                    {
                                                        // @ts-ignore
                                                        catOptions.map((cat, idx) =>
                                                            <option key={idx} value={cat.CAT_ID} >{cat.CAT_NAME}</option>
                                                        )
                                                    }
                                                </MySelect>
                                        }
                                    </GridItem>
                                    <GridItem mx={2} colSpan={3}>
                                            <MySelect
                                                label="Unidad de Medida"
                                                name="UOF_ID"
                                            >
                                                <option value=""></option>
                                                {
                                                    meanLoading || meanIsError ?
                                                        <Skeleton height="35%" borderRadius="5px" />

                                                        :
                                                        // @ts-ignore
                                                        meanOptions.map((mean, idx) =>
                                                            <option key={idx} value={mean.UOF_ID} >{mean.UOF_NAME} - {mean.UOF_ABREV}</option>
                                                        )

                                                }
                                            </MySelect>
                                        </GridItem> 
                                    <GridItem mx={2} colSpan={3}>
                                        <MyCheckbox
                                            name="PRO_REMISION"
                                        >
                                            Insumo para Remision
                                        </MyCheckbox>
                                        <MyCheckbox
                                            name="PRO_INAFECT"
                                        >
                                            Insumo Inafecto
                                        </MyCheckbox>
                                        <MyCheckbox
                                            name="PRO_FATHER"
                                        >
                                            ¿Tiene contrato con cliente?
                                        </MyCheckbox>
                                    </GridItem>
                                </Grid>
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    type="submit"
                                    isLoading={isLoading}
                                    isDisabled={isLoading}
                                    colorScheme="green"
                                    mr={3}
                                >
                                    Guardar
                                </Button>
                                <Button onClick={onClose}>Cancelar</Button>
                            </ModalFooter>
                        </Form>
                    </Formik>
                </ModalContent>
            </Modal>
        </>
    )
}
export const CreateProdHijoModal = ({ children, product }: { children: ReactNode, product: any }) => {

    const { data: cliOptions, isLoading: cliLoading, isError: cliIsError } = useQuery('cliOptions', ListClientes, { refetchOnWindowFocus: false })
    const queryClient = useQueryClient();
    const { mutateAsync, isLoading } = useMutation(createProductChildren)
    const { isOpen, onOpen, onClose } = useDisclosure()

    return (
        <>
            <div onClick={onOpen}>
                {children}
            </div>
            <Modal
                size="2xl"
                closeOnOverlayClick={false}
                isOpen={isOpen}
                onClose={onClose}
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Registrar Cliente con Insumo</ModalHeader>
                    <ModalCloseButton />
                    <Formik
                        initialValues={{}}
                        /* validationSchema={validate} */
                        onSubmit={async (values: any) => {
                            /* const { TDK_NAME, CAT_NAME, ...rest } = values */

                            values = {
                                ...values,
                                PRO_FATHER_ID: product.PRO_ID,
                                PRO_INAFECT: product.PRO_INAFECT,
                                CAT_ID: product.CAT_ID,
                                PRO_IMAGE: product.PRO_IMAGE,
                                PRO_ONLINE: product.PRO_ONLINE,
                                PRO_DESCRIPTION: values.PRO_NAME,
                            }

                            console.log(values);

                            //@ts-ignore
                            await mutateAsync(values)
                            queryClient.invalidateQueries("childrensProduct")
                            //onClose()
                        }}
                    >
                        <Form>
                            <ModalBody pb={6}>
                                <Grid
                                    h="auto"
                                    templateRows="repeat(6, auto)"
                                    templateColumns="repeat(6, 16.6%)"
                                    w="full"
                                >
                                    <GridItem mx={2} colSpan={3}>
                                        <MyTextInput
                                            label="Nombre"
                                            name="PRO_NAME"
                                            placeholder="Nombre de producto"
                                        />
                                    </GridItem>
                                    <GridItem mx={2} colSpan={3}>
                                        <MyTextInput
                                            label="Fecha de Registro"
                                            name="PRO_CREATE_DATE"
                                            type="datetime-local"
                                        />
                                    </GridItem>
                                    <GridItem mx={2} colSpan={5} >
                                        {
                                            cliLoading || cliIsError ?
                                                <Skeleton height="35%" borderRadius="5px" />
                                                :
                                                <MySelect
                                                    label="Cliente"
                                                    name="CLI_ID"
                                                >
                                                    <option value=""></option>
                                                    {
                                                        // @ts-ignore
                                                        cliOptions.map((cli, idx) =>
                                                            <option key={idx} value={cli.CLI_ID} >{cli.PER_NAME || cli.PER_TRADENAME}</option>
                                                        )
                                                    }
                                                </MySelect>
                                        }
                                    </GridItem>
                                    <GridItem mx={2} colSpan={1} display={"flex"} justifyContent={"center"} alignItems={"end"}>
                                        <IconButton
                                            type='submit'
                                            borderRadius={"full"}
                                            icon={<BsPlusLg />}
                                            aria-label="Editar"
                                            isLoading={isLoading}
                                            isDisabled={isLoading}
                                            colorScheme="blue" />
                                    </GridItem>
                                </Grid>
                            </ModalBody>
                        </Form>
                    </Formik>
                    <ProClientTable idProducto={product.PRO_ID} />
                    <ModalFooter>
                        {/* <Button
                                    type="submit"
                                    isLoading={isLoading}
                                    isDisabled={isLoading}
                                    colorScheme="green"
                                    mr={3}
                                >
                                    Guardar
                                </Button> */}
                        <Button onClick={onClose}>Cerrar</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>)
}
export const ProClientTable = ({ idProducto }: { idProducto: any }) => {

    const { data, isLoading, isFetching, isError } = useQuery('childrensProduct', () => { return getProductsByFather(idProducto) }, { refetchOnWindowFocus: false })

    const columns = [
        {
            Header: 'Nombre',
            accessor: 'PRO_NAME'
        },
        {
            Header: 'Cliente',
            // @ts-ignore
            Cell: ({ row }) => <ClienteName pro={row.original} />
        },/* 
        {
            Header: 'Fecha de Registro',
            accessor: 'PRO_CREATE_DATE2'
        }, */
        {
            Header: 'Acciones',
            // @ts-ignore
            Cell: ({ row }) => <ActionCell pro={row.original} />
        },

    ]
    // @ts-ignore
    if (isLoading || isFetching) return (<TableChargeListProduct />)

    //@ts-ignore
    if (isError) return <h1>{error.message}</h1>;

    //@ts-ignore
    if (data.message) return <Box mx={2}>{data.message}</Box>;
    return (< MyReactTable
        columns={columns}
        data={data}
        isPaginated
        pagesOptions={[3, 5]} />)
}

const ActionCell = ({ pro }: { pro: any }) => {

    const status = pro.PRO_STATUS === '1'

    const { mutate, isLoading } = useMutation('editeProduct')
    pro = { ...pro, PRO_STATUS: pro.PRO_STATUS === '1' ? '0' : '1' }

    function handleStatus() {
        let formData = new FormData();

        delete pro.PRO_CREATE_DATE2
        delete pro.PER_NAME
        delete pro.PER_LASTNAME
        delete pro.PER_TRADENAME

        for (let value in pro) {
            if (pro[value]) {
                formData.append(value, pro[value]);
            }
        }
        console.log(pro);
        //@ts-ignore
        mutate({ formData: formData, PRO_ID: pro.PRO_ID })
    }
    return (
        <>
            {status ? <Button onClick={handleStatus}>Anular</Button> : <Button onClick={handleStatus}>Anulado</Button>}
        </>
    )
}
const ClienteName = ({ pro }: { pro: any }) => {
    return (<Text>{pro.PER_NAME || pro.PER_TRADENAME}</Text>)
}