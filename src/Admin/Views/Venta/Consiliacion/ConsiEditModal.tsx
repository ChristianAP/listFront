import React, { ReactNode } from 'react'
import { Button } from '@chakra-ui/button'
import { useDisclosure } from '@chakra-ui/hooks'
import { Grid, GridItem } from '@chakra-ui/layout'
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from '@chakra-ui/modal'
import { MyTextInput } from '../../../../GlobalUI/Forms/MyInputs'
import { Form, Formik } from 'formik';
import * as yup from 'yup'
import { useMutation } from 'react-query'
import { ChangeStatePay } from '../../../../Service/Sales'

export const ConsiEditModal = ({ children, document }: { children: ReactNode, document: any }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { mutateAsync, isLoading } = useMutation(ChangeStatePay, {})

    /*.toDateString()
DCT_NAME: "BOLETA"
DOC_BUSINESS_NAME: "CLIENTES VARIOS"
DOC_DATE_PAGO: "2022-04-28T04:00:00.000Z"
DOC_ESTADO: "0"
DOC_ID_CLIENT: "00000000"
PMT_NAME: "7 DIAS"
    */
    const validate = yup.object().shape({
        DCT_NAME: yup.string().required("invalido"),
        DOC_BUSINESS_NAME: yup.string().required("invalido"),
        DOC_DATE_PAGO: yup.string().required("invalido"),
        DOC_ESTADO: yup.string().required("invalido"),
        DOC_ID_CLIENT: yup.string().required("invalido"),
        PMT_NAME: yup.string().required("invalido"),
    })

    return (
        <>
            <div onClick={onOpen}>
                {children}
            </div>
            <Modal
                closeOnOverlayClick={false}
                closeOnEsc={false}
                isOpen={isOpen}
                onClose={onClose}
            >
                <ModalOverlay />
                <ModalContent maxW={{ base: "95%", md: "40%" }}>
                    <ModalHeader>Indicar Fecha de Pago</ModalHeader>
                    <ModalCloseButton />
                    <Formik
                        enableReinitialize={true}
                        initialValues={{
                            ...document,
                            DOC_ESTADO: (document.DOC_ESTADO == 1 ? "Pagado" : "Emitido"),
                            DOC_ID_CLIENT: (document.DOC_ID_CLIENT == "00000000" ? "No Guardado" : document.DOC_ID_CLIENT),
                            DOC_DATE_PAGO: document.DOC_DATE.split('T')[0]
                            /* new Date().toISOString().split('T')[0] */
                        }}
                        validationSchema={validate}
                        onSubmit={async (values: any) => {

                            const DOC_DATE_PAGO = new Date(values.DOC_DATE_PAGO).toISOString().substring(0, 10)
                            console.log(values);
                            console.log(DOC_DATE_PAGO);
                            await mutateAsync({
                                DOC_ID: document.DOC_ID,
                                DOC_ESTADO: document.DOC_ESTADO,
                                DOC_DATE_PAGO: DOC_DATE_PAGO
                            });
                            onClose()
                        }}
                    >
                        <Form>
                            <ModalBody pb={6}>
                                <Grid
                                    h="auto"
                                    templateColumns={{ base: "repeat(3, 33.3%)", sm: "repeat(6, 16.6%)" }}
                                    w="full"
                                >
                                    <GridItem mx={2} colSpan={3}>
                                        <MyTextInput
                                            label="Tipo de Comprobante"
                                            name="DCT_NAME"
                                            placeholder="Ej. 58758.."
                                            disabled
                                        />
                                    </GridItem>
                                    <GridItem mx={2} colSpan={3}>
                                        <MyTextInput
                                            label="Nombre del Clietne"
                                            name="DOC_BUSINESS_NAME"
                                            placeholder="Nombre de proveedor"
                                            disabled
                                        />
                                    </GridItem>
                                    <GridItem mx={2} colSpan={3}>
                                        <MyTextInput
                                            label="Fecha de Pago"
                                            name="DOC_DATE_PAGO"
                                            type="date"
                                        />
                                    </GridItem>
                                    <GridItem mx={2} colSpan={3}>
                                        <MyTextInput
                                            label="Estado del Documento"
                                            name="DOC_ESTADO"
                                            placeholder="Nombre de Departamento"
                                            disabled
                                        />
                                    </GridItem>
                                    <GridItem mx={2} colSpan={3}>
                                        <MyTextInput
                                            label="Identificacion del Cliente"
                                            name="DOC_ID_CLIENT"
                                            placeholder="Nombre de Provincia"
                                            disabled
                                        />
                                    </GridItem>
                                    <GridItem mx={2} colSpan={3}>
                                        <MyTextInput
                                            label="Forma de Pago"
                                            name="PMT_NAME"
                                            placeholder="Nombre de Distrito"
                                            disabled
                                        />
                                    </GridItem>

                                </Grid>
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    type="submit"
                                    // isLoading={isLoading}
                                    // isDisabled={isLoading}
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
