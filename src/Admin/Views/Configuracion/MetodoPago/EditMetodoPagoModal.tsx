import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, Button, useToast } from '@chakra-ui/react'
import React, { ReactNode, useState } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import { Form, Formik } from 'formik';
import * as yup from 'yup'
import { MyImageInput, MyTextArea, MyTextInput } from '../../../../GlobalUI/Forms/MyInputs';
import { EditPromotion } from '../../../../Service/PromotionAdminService';
import { IPromocion } from '../../../../Model/Promotion';
import { EditMetodoPago } from '../../../../Service/MetodoPagoService';

export const EditMetPagoModal = ({ children, metodopago }: { children: ReactNode, metodopago: any }) => {

    const { isOpen, onOpen, onClose } = useDisclosure()
    const toast = useToast();
    const [image, setImage] = useState(metodopago.MPG_IMAGE || 'https://ayjoe.engrave.site/img/default.jpg')
    const [file, setFile] = useState([])
    const queryClient = useQueryClient();
    const { mutate, isLoading } = useMutation(EditMetodoPago, {
        onSuccess: (res) => {
            queryClient.invalidateQueries('metodo_pago')
            //@ts-ignore
            if (res.status == 500) {
                throw new Error("error intentar mas adelante");
            }
            if (res.status == 300) {
                toast({
                    title: "limite excedido",
                    description: "excediste el limite para la imagen",
                    duration: 8000,
                    isClosable: true,
                });
            }
        },
        onError: (e) => {
            console.log(e);
            alert("error intentarlo luego")
        }
    })

    const validate = yup.object().shape({
        MPG_NAME: yup.string().required("Debe ingresar un nombre"),
        MPG_DESCRIPTION: yup.string().required("Debe ingresar una descripción"),
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
                        initialValues={metodopago}
                        validationSchema={validate}
                        onSubmit={async (values: any) => {
                            let metodopagos = {
                                MPG_DESCRIPTION: values.MPG_DESCRIPTION,
                                MPG_NAME: values.MPG_NAME,
                            }

                            /* Then create a new FormData obj */
                            let formData = new FormData();

                            /* append input field values to formData */
                            for (let value in metodopagos) {
                                formData.append(value, values[value]);

                            }
                            formData.append("IMAGE", file[0]);
                            console.log(formData);
                            

                            mutate({ formData: formData, MPG_ID: metodopago.MPG_ID })
                            onClose()
                        }
                        }
                    >
                        <Form>
                            <ModalBody pb={6}>
                                <MyTextInput
                                    label="Titulo"
                                    name="MPG_NAME"
                                    type="text"
                                    placeholder="Titulo de la Promoción"
                                />
                                <MyTextArea
                                    label="Descripción"
                                    name="MPG_DESCRIPTION"
                                    placeholder="Descripción de la Promoción"
                                />
                                <MyImageInput image={image} setFile={setFile} setImage={setImage} />
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    type="submit"
                                    isLoading={isLoading}
                                    isDisabled={isLoading}
                                    colorScheme="blue"
                                    mr={3}
                                >
                                    Actualizar
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