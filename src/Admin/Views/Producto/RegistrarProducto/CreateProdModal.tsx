import { Modal, GridItem, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, Button, Grid, Skeleton, Flex, Spacer, Box, Input, Select } from '@chakra-ui/react'
import React, { ReactNode, useState } from 'react'
import { useMutation, useQuery } from 'react-query'
import { Form, Formik } from 'formik';
import * as yup from 'yup'
import { MyCheckbox, MyImageInput, MySelect, MyTextArea, MyTextInput } from '../../../../GlobalUI/Forms/MyInputs';
import { getCategories } from '../../../../Service/CategoryAdminService';
import { createStock, getUnitMean } from '../../../../Service/ProductAdminService';
import { ProductByCode } from '../../../../Service/RemisionAdminService';
import { getCodebars } from '../../../../Service/codebar_configService';

interface IProducto {
    PRO_NAME: string;
    PRO_DESCRIPTION: string;
    PRO_BRAND: string;
    PRO_CODE: string;
    PRO_BARCODE: string;
    PRO_CREATE_DATE: string;
    CAT_ID: string;
    PRO_PRICE?: number;
    PRO_WEIGHT?: number;
    PRO_MIN?: string;
    PRO_MAX?: string;
    PRO_INAFECT?: boolean;
    PRO_EXPIRATION_DATE?: string;
}
export const CreateProdModal = ({ children, online }: { children: ReactNode, online: boolean }) => {

    const { data: catOptions, isLoading: catLoading, isError: catIsError } = useQuery('catOptions', getCategories, { refetchOnWindowFocus: false })
    const { data: meanOptions, isLoading: meanLoading, isError: meanIsError } = useQuery('unitMean', getUnitMean, { refetchOnWindowFocus: false })

    const { isOpen, onOpen, onClose } = useDisclosure()
    const [file, setFile] = useState([])
    const [image, setImage] = useState('https://ayjoe.engrave.site/img/default.jpg')
    const [values, setValues] = useState<IProducto>({
        PRO_NAME: '',
        PRO_DESCRIPTION: '',
        PRO_BRAND: '',
        PRO_CODE: '',
        PRO_BARCODE: '',
        PRO_CREATE_DATE: '',
        CAT_ID: '',
        PRO_PRICE: 0,
        PRO_WEIGHT: 0,
        PRO_EXPIRATION_DATE: "",
        PRO_INAFECT: false

    })
    const { mutateAsync, isLoading } = useMutation('createProduct')
    const { mutateAsync: mutateStock, isLoading: loadingStock } = useMutation(createStock)
    const { data: dataCodebar, isLoading: loadingCodebar, isFetched: fetchedCodebar, isError: isErrorCodebar, error: errorCodebar } = useQuery('codebarConf', getCodebars)


    const validate = yup.object().shape(
        online ?
            {
                PRO_NAME: yup.string().required("Debe ingresar un nombre"),
                //PRO_DESCRIPTION: yup.string().required("Debe ingresar una descripción"),
                PRO_BRAND: yup.string().required("Debe ingresar un nombre secundario"),
                PRO_CODE: yup.string().required("Debe ingresar un código"),
                //PRO_BARCODE: yup.string().required("Debe scanear un código  de barras"),
                //PRO_CREATE_DATE: yup.date().required("Debe ingresar una fecha"),
                CAT_ID: yup.string().required("Debe seleccionar una categoría"),
                PRO_PRICE: yup.string().required("Dene ser un número válido"),
                PRO_WEIGHT: yup.string().required("Dene ser un número válido"),
                PRO_EXPIRATION_DATE: yup.date().required("Debe ingresar una fecha"),
            }
            :
            {
                PRO_NAME: yup.string().required("Debe ingresar un nombre"),
                //PRO_DESCRIPTION: yup.string().required("Debe ingresar una descripción"),
                PRO_BRAND: yup.string().required("Debe ingresar un nombre secundario"),
                PRO_CODE: yup.string().required("Debe ingresar un código"),
                //PRO_BARCODE: yup.string().required("Debe scanear un código  de barras"),
                //PRO_CREATE_DATE: yup.date().required("Debe ingresar una fecha"),
                CAT_ID: yup.string().required("Debe seleccionar una categoría"),
                PRO_MIN: yup.string().required("Dene ser un número válido"),
                PRO_MAX: yup.string().required("Dene ser un número válido"),
            })
    async function handleClick(producto: string) {
        //@ts-ignore
        document.getElementById("codebar").value = ""
        let codigo = (dataCodebar[0].CDC_DISTANCE).split(',')
        let pesoEntero = (dataCodebar[1].CDC_DISTANCE).split(',')
        let pesoDecimal = (dataCodebar[2].CDC_DISTANCE).split(',')
        console.log('ESTE ES EL CODIGO ENCONTRADO ...', producto.substring(Number(codigo[0]), Number(codigo[1])));

        let productoEncontrado = await ProductByCode(dataCodebar ? producto.substring(Number(codigo[0]), Number(codigo[1])) : '0')

        /// ANTERIOR
        // let productoEncontrado = await ProductByCode(producto.substring(1, 6))

        let peso = (codigo[0] == '0' && codigo[1] == dataCodebar[0].CDC_LENGTH) ?
                Number(productoEncontrado[0].PRO_WEIGHT)
                :
                Number(producto.substring(pesoEntero[0], pesoEntero[1]) + "." + producto.substring(pesoDecimal[0], pesoDecimal[1]))
        
        /// ANTERIOR
        // let peso = Number(producto.substring(6, 8) + "." + producto.substring(8, 11))


        console.log(productoEncontrado);
        setValues(online ? {
            ...values,
            PRO_NAME: productoEncontrado[0].PRO_NAME,
            PRO_DESCRIPTION: productoEncontrado[0].PRO_DESCRIPTION,
            PRO_BRAND: productoEncontrado[0].PRO_BRAND,
            PRO_CODE: producto,
            PRO_BARCODE: producto,
            PRO_CREATE_DATE: productoEncontrado[0].PRO_CREATE_DATE,
            CAT_ID: productoEncontrado[0].CAT_ID,
            PRO_WEIGHT: peso,
            PRO_PRICE: +Number((productoEncontrado[0].PRD_UNIT_PRICE * peso)).toFixed(1),
        } : {
            PRO_NAME: '',
            PRO_DESCRIPTION: '',
            PRO_BRAND: '',
            PRO_CODE: '',
            PRO_BARCODE: '',
            PRO_CREATE_DATE: '',
            CAT_ID: '',
            PRO_MIN: '',
            PRO_MAX: ''
            ,
        })
    }


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
                    <ModalHeader>Crear Insumo</ModalHeader>
                    <ModalCloseButton />
                    {online && <Flex borderRadius="5px" borderWidth="2px" p="5px" alignItems={"end"}>
                        <Spacer />
                        <Box w="80%" >
                            <label htmlFor="codebar">{"Codigo de Barras"}</label>
                            <Input
                                name="PRO_CODEBAR"
                                type="text"
                                id="codebar"
                                onKeyDown={(e: any) => {
                                    if (e.key === 'Enter') {
                                        /* handleClick() */
                                        handleClick(e.target.value)
                                    }
                                    console.log(e.target.value);
                                }}
                                onKeyUp={(e: any) => {
                                    if ((e.target.value as string).length > 6) {
                                        /* setProducto(e.target.value)
                                        console.log(form) */
                                    }
                                    console.log(e.target.value);
                                }} />
                        </Box>
                        <Spacer />
                    </Flex>}

                    <Formik
                        enableReinitialize={true}
                        initialValues={values}
                        validationSchema={validate}
                        onSubmit={async (values: any) => {
                            /* Then create a new FormData obj */
                            values.PRO_BARCODE=values.PRO_CODE

                            values.PRO_INAFECT = values.PRO_INAFECT ? "1" : "0"
                            values.PRO_REMISION = values.PRO_REMISION ? "1" : "0"
                            values.PRO_FATHER = values.PRO_FATHER ? "1" : "0"
                            if (online) {
                                values.PRO_AGOTADO = "1"
                            }
                            let formData = new FormData();
                            /* append input field values to formData */
                            for (let value in values) {
                                formData.append(value, values[value]);
                            }
                            //Saber si es para la tienda online o tienda fisica
                            formData.append("PRO_ONLINE", online ? "1" : "0");
                            /* FormData requires name: id */
                            formData.append("IMAGE", file[0]);
                            //@ts-ignore
                            const productoId = await mutateAsync(formData)
                            await mutateStock({
                                //@ts-ignore
                                PRO_ID: productoId.data,
                                STK_INITIAL_STOCK: online ? values.PRO_WEIGHT : 0,
                                STK_TODAY: online ? values.PRO_WEIGHT : 0,
                                STK_STATUS: 1,
                            })
                            onClose()
                        }}
                    >
                        <Form>
                            <ModalBody pb={6}>

                                {online ?
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
                                                placeholder="Nombre secundario/brand"
                                            />
                                        </GridItem>
                                        <GridItem mx={2} colSpan={3}>
                                            <MyTextInput
                                                type="number"
                                                label="Precio del Producto"
                                                name="PRO_PRICE"
                                                /* disabled={true} */
                                                placeholder="10"
                                            />
                                        </GridItem>
                                        <GridItem mx={2} colSpan={3}>
                                            <MyTextInput
                                                type="number"
                                                label="Peso de de Producto"
                                                name="PRO_WEIGHT"
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
                                        <GridItem mx={2} colSpan={3}>
                                            <MyTextInput
                                                label="Fecha de Vencimiento"
                                                name="PRO_EXPIRATION_DATE"
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
                                            <MyCheckbox
                                                name="PRO_INAFECT"
                                            >
                                                Insumo Inafecto
                                            </MyCheckbox>
                                        </GridItem>
                                    </Grid>
                                    :
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
                                        
                                        <GridItem mx={2} colSpan={3}>
                                            <MyTextInput
                                                type="number"
                                                label="Peso de de Producto"
                                                name="PRO_WEIGHT"
                                                placeholder="50"
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
                                            <MyCheckbox
                                                name="PRO_REMISION"
                                            >
                                                Insumo para Remision
                                            </MyCheckbox>
                                            <GridItem mx={2} colSpan={3}>
                                                <MyCheckbox
                                                    name="PRO_FATHER"
                                                >
                                                    ¿Tiene contrato con cliente?
                                                </MyCheckbox>
                                            </GridItem>
                                            <MyCheckbox
                                                name="PRO_INAFECT"
                                            >
                                                Insumo Inafecto
                                            </MyCheckbox>
                                        </GridItem>
                                    </Grid>
                                }
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    type="submit"
                                    isLoading={isLoading || loadingStock}
                                    isDisabled={isLoading || loadingStock}
                                    colorScheme="green"
                                    mr={3}
                                >
                                    Agregar
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