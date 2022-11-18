import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, Button } from '@chakra-ui/react'
import React, { ReactNode, useState } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import { Form, Formik } from 'formik';
import * as yup from 'yup'
import { MyTextArea, MyTextInput } from '../../../../GlobalUI/Forms/MyInputs';
import { CreateTipoPago } from '../../../../Service/PayMetho';

export const CrearTipPagoModal = ({ children }: { children: ReactNode }) => {

    const { isOpen, onOpen, onClose } = useDisclosure()

    const queryClient = useQueryClient();
    const { mutate, isLoading } = useMutation(CreateTipoPago, {
        onSuccess: (res) => {
            queryClient.invalidateQueries('tipo_pago')
            //@ts-ignore
            if (res.status == 500) {
                throw new Error("error intentar mas adelante");
            }
        },
        onError: () => alert("error intentarlo luego")
    })
    const tipopago = {
        PMT_NAME: "",
        PMT_PRICE: "",
        PMT_DESCRIPTION: "",
    }
    const validate = yup.object().shape({
        PMT_NAME: yup.string().required("Debe ingresar un nombre"),
        PMT_PRICE: yup.number().required("Debe ingresar un precio valido"),
        PMT_DESCRIPTION: yup.string().required("Debe ingresar una descripción"),
    })

    return (
        <>
            <div onClick={onOpen}>
                {children}
            </div>
            <Modal
                closeOnOverlayClick={false}
                isOpen={isOpen}
                onClose={onClose}
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Editar Promoción</ModalHeader>
                    <ModalCloseButton />
                    <Formik
                        initialValues={tipopago}
                        validationSchema={validate}
                        onSubmit={
                            async (values: any) => {
                                mutate({ ...values })
                                onClose()
                            }
                        }
                    >
                        <Form>
                            <ModalBody pb={6}>
                                <MyTextInput
                                    label="Titulo"
                                    name="PMT_NAME"
                                    type="text"
                                    placeholder="Nombre"
                                />
                                <MyTextArea
                                    label="Descripción"
                                    name="PMT_DESCRIPTION"
                                    placeholder="Descripción"
                                />
                                <MyTextInput
                                    label="Precio"
                                    name="PMT_PRICE"
                                    type="text"
                                    placeholder="Precio"
                                />
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    type="submit"
                                    isLoading={isLoading}
                                    isDisabled={isLoading}
                                    colorScheme="blue"
                                    mr={3}
                                >
                                    Crear
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