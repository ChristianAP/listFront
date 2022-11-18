import { Box, Button, Center, Flex, Grid, GridItem, IconButton, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, Text, useDisclosure, useToast } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import React, { ReactNode, useState } from "react";
import { FiShoppingCart } from "react-icons/fi";
import { RiUserAddFill } from "react-icons/ri";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { MySelect, MyTextInput, ProviderSearchInput } from "../../../../GlobalUI/Forms/MyInputs";
import { createExternalProducts, listAlertsType, listPaymenthMetod, listProductType } from "../../../../Service/ExternalProductsService";
import { getProviders } from "../../../../Service/ProviderService";
import { RegProvModal } from "../../Compra/ListarProveedor/RegProvModal";

export const RegistrarCompraExterna = () => {
    const { isOpen, onClose, onOpen } = useDisclosure()
    const [provPerson, setProvPerson] = useState<any>();

    const [type, setType] = useState('5')
    const [numberParts, setNumberParts] = useState('')
    // const { mutateAsync, data, error, isLoading, status, isSuccess} = useMutation(createExternalProducts)
    const queryClient = useQueryClient()

    const { data: alertData, isLoading: loadingAlert, isError: errorAlert } = useQuery('alerts', listAlertsType, { refetchOnWindowFocus: false })
    const { data: productData, isLoading: loadingProduct, isError: errorProduct } = useQuery('product_types', listProductType, { refetchOnWindowFocus: false })

    const { data: proveedores, error: provError, isLoading: provLoading, refetch } = useQuery('providers', getProviders)
    const { data: metod, error: metodError, isLoading: metodLoading } = useQuery('metod', listPaymenthMetod)
    const toast = useToast()
    function sumarDias(fecha: any, dias: any) {
        fecha.setDate(fecha.getDate() + dias);
        return fecha;
    }
    return (
        <>
            <Button color={'white'} backgroundColor={'#a62f46'} leftIcon={<FiShoppingCart />} _hover={{ 'backgroundColor': '#a62f46' }} onClick={onOpen}> &nbsp; REGISTRAR COMPRA EXTERNA</Button>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent maxW={'50%'}>
                    <ModalHeader>REGISTRO DE COMPRAS EXTERNAS </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Formik
                            initialValues={{ ETP_NUMBER_PARTS: 2 }}
                            // validationSchema={validate}
                            onSubmit={async (values: any) => {
                                // console.log({ ...values, PER_ID: values.PER_ID.split('-')[1] })
                                let now = new Date()
                                let day = now.getDate()
                                let month = now.getMonth() + 1
                                let year = now.getFullYear()
                                let total_pagar = Number(values.ETP_AMOUNT) * Number(values.ETP_PRODUCT_PRICE)
                                const obj = {
                                    ETP_NAME: values.ETP_NAME,
                                    PER_ID: values.PER_ID.split('-')[1],
                                    ETP_AMOUNT: values.ETP_AMOUNT,
                                    ETP_BUY_DATE: (year + '-' + (month < 10 ? '0' + month : month) + '-' + (day < 10 ? '0' + day : day)),
                                    PMT_ID: type,
                                    ETP_NUMBER_PARTS: type == '5' ? null : values.ETP_NUMBER_PARTS,
                                    // ETP_DAYS_NEXT_PART: type == '1' ? null : values.ETP_DAYS_NEXT_PART,
                                    ETP_DAYS_NEXT_PART: numberParts,
                                    ALT_ID: type == '5' ? null : values.ALT_ID,
                                    ETP_ALERT: type == '5' ? null : values.ETP_ALERT,
                                    PRT_ID: values.PRT_ID,
                                    ETP_OBSERVATIONS: values.ETP_OBSERVATIONS,
                                    ETP_PRODUCT_PRICE: values.ETP_PRODUCT_PRICE,
                                    ETP_TOTAL: Number(values.ETP_AMOUNT) * Number(values.ETP_PRODUCT_PRICE),
                                    ETP_STATUS: values.ETP_STATUS,
                                }
                                let external = await createExternalProducts(obj)

                                // console.log(obj)

                                // if (external.status === 200) {

                                //     if (type == '2') {
                                //         for (let i = 1; i <= values.ETP_NUMBER_PARTS; i++) {
                                //             // const element = array[i];
                                //             let next_queota = await sumarDias(now, (Number(values.ETP_DAYS_NEXT_PART) ))
                                //             let day_quota = next_queota.getDate()
                                //             let month_quota = next_queota.getMonth() + 1
                                //             let year_quota = next_queota.getFullYear()
                                //             // console.log(next_queota);                                            
                                //             let quotas = {
                                //                 QB_PAYMENT_DATE: year_quota + '-' + month_quota + '-' + day_quota,
                                //                 QB_AMOUNT: (Number(total_pagar) / Number(values.ETP_NUMBER_PARTS)).toFixed(2),
                                //                 QB_STATUS: i == 1 ? '1' : '0',
                                //                 ETP_ID: '1',
                                //             }

                                //             console.log(quotas);

                                //         }
                                //     }


                                //     // console.log('SE CREO SATISFACTOREIAMENTE');
                                //     // toast({
                                //     //     title: 'Account created.',
                                //     //     description: "We've created your account for you.",
                                //     //     status: 'success',
                                //     //     duration: 9000,
                                //     //     isClosable: true,
                                //     //   })
                                //     // queryClient.invalidateQueries('externalProducts')

                                // } else {
                                //     // console.log('HUBO UN ERROR');

                                // }
                                await queryClient.invalidateQueries('externalProducts')
                                onClose()

                            }}>
                            <Form>
                                <Grid templateColumns='repeat(2, 1fr)' gap={'10px'} justifyItems='center' justifySelf={'center'} justifyContent='center'>
                                    <GridItem w='100%'>
                                        <ProviderSearchInput
                                            loading={provLoading}
                                            data={proveedores}
                                            placeholder="Buscar Proveedor"
                                            label="Seleccione el Proveedor: "
                                            name="PER_ID"
                                            autocomplete="off"
                                            // @ts-ignore
                                            itemClick={(option, func) => {
                                                let { PER_ID, PER_RUC: DOC_ID_CLIENT, PER_TRADENAME: DOC_BUSINESS_NAME, PER_DIRECTION: DOC_DIRECTION_CLIENT, PER_NAME } = option
                                                func(DOC_ID_CLIENT + ' ' + DOC_BUSINESS_NAME + '-' + PER_ID)
                                                setProvPerson({
                                                    PER_ID,
                                                    DOC_ID_CLIENT,
                                                    DOC_BUSINESS_NAME,
                                                    DOC_DIRECTION_CLIENT
                                                })
                                            }}
                                        />
                                    </GridItem>
                                    <GridItem w='100%' justifyContent={'center'} justifyItems='center' justifySelf={'center'}>
                                        <RegProvModal>
                                            <Button aria-label="buton search proveedor" leftIcon={<RiUserAddFill />} colorScheme='red' > &nbsp; AGREGAR PROVEEDOR</Button>
                                        </RegProvModal>
                                    </GridItem>
                                    <GridItem w='100%'>
                                        <MyTextInput autocomplete="off" label='Nombre Produto: ' name='ETP_NAME' placeholder='Ejm. Cocina' />
                                    </GridItem>
                                    <GridItem w='100%'>
                                        <MyTextInput autocomplete="off" label='Cantidad : ' name='ETP_AMOUNT' placeholder='Ejm. 10' />
                                    </GridItem>
                                    <GridItem w='100%'>
                                        <MyTextInput autocomplete="off" label='Precio del Producto : ' name='ETP_PRODUCT_PRICE' placeholder='Ejm. 10' />
                                    </GridItem>
                                    <GridItem w='100%'>
                                        <MySelect label='Tipo de Pago: ' name='PMT_ID' placeholder="Seleccione tipo de pago" onChange={(e: any) => {
                                            let buy_type = JSON.parse(e.target.value)
                                            console.log(buy_type);
                                            // console.log(((buy_type.PMT_NAME).toLowerCase().split('d')[0]).trim());

                                            setType(buy_type.PMT_ID)
                                            setNumberParts(buy_type.PMT_ID !== 5 ? (((buy_type.PMT_NAME).toLowerCase().split('d')[0]).trim()) : null)
                                        }}>
                                            {metod && !metod.message ?
                                                metod.map((e: any) => {
                                                    return <option value={JSON.stringify(e)}>{(e.PMT_NAME).toUpperCase()}</option>
                                                })
                                                :
                                                <option value="">NO DATA</option>}
                                        </MySelect>
                                    </GridItem>
                                    {type == '5' ?
                                        <></>
                                        :
                                        <>

                                            <GridItem w='100%'>
                                                <MyTextInput autocomplete="off" label='Cantidad de Partes' name='ETP_NUMBER_PARTS' placeholder='Ejm. 2' />
                                            </GridItem>
                                            <GridItem w='100%'>
                                                <MyTextInput autocomplete="off" label={'Días entre pagos:'} placeholder='2' name='ETP_DAYS_NEXT_PART' value={numberParts} disabled />
                                            </GridItem>
                                            <GridItem w='100%'>
                                                <MySelect label='Tipo de Alerta: ' name='ALT_ID' placeholder="Seleccione tipo de alerta">

                                                    {
                                                        alertData && !alertData.message ?
                                                            alertData.map((e: any) => {
                                                                return <option value={e.ALR_ID}>{e.ALR_NAME}</option>
                                                            })
                                                            :
                                                            <option value="">NO DATA</option>
                                                    }
                                                </MySelect>
                                            </GridItem>
                                            <GridItem w='100%'>
                                                <MyTextInput autocomplete="off" label={'Días de previo aviso antes del pago:'} placeholder='2' name='ETP_ALERT' />
                                            </GridItem>
                                        </>
                                    }
                                    <GridItem w='100%'>
                                        <MySelect label='Tipo de Producto: ' name='PRT_ID' placeholder="Seleccione tipo del Producto Adquirido">

                                            {
                                                productData && !productData.message ?
                                                    productData.map((e: any) => {
                                                        return <option value={e.PRT_ID}>{e.PRT_NAME}</option>
                                                    })
                                                    :
                                                    <option value="">NO DATA</option>
                                            }
                                        </MySelect>
                                    </GridItem>
                                    <GridItem w={'100%'}>
                                        <MyTextInput autocomplete="off" label={'Motivo de Compra: '} type='text' name='ETP_OBSERVATIONS' />
                                    </GridItem>
                                    <GridItem w='100%'>
                                        <MySelect label='Estado de Pago: ' name='ETP_STATUS' placeholder="Seleccione el estado de Pago de la Compra">
                                            <option value="0">PENDIENTE</option>
                                            <option value="1">CANCELADO</option>
                                        </MySelect>
                                    </GridItem>
                                </Grid>

                                <br />
                                <Box display={'flex'} justifyContent='center'>

                                <Button w={'50%'}  variant='solid' colorScheme={'telegram'} type="submit">REGISTRAR COMPRA</Button>
                                </Box>
                            </Form>
                        </Formik>

                    </ModalBody>

                    <ModalFooter>
                        <Button variant={'ghost'} mr={3} onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>


    )
}