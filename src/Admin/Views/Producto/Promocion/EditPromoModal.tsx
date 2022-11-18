import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, Button, useToast } from '@chakra-ui/react'
import React, { ReactNode, useState } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import { Form, Formik } from 'formik';
import * as yup from 'yup'
import { MyImageInput, MyTextArea, MyTextInput } from '../../../../GlobalUI/Forms/MyInputs';
import { EditPromotion } from '../../../../Service/PromotionAdminService';
import { IPromocion } from '../../../../Model/Promotion';

export const EditPromoModal = ({ children, promotion }: { children: ReactNode, promotion: any }) => {

    const { isOpen, onOpen, onClose } = useDisclosure()

    const [image, setImage] = useState(promotion.PRT_IMAGE || 'https://ayjoe.engrave.site/img/default.jpg')
    const [file, setFile] = useState([])
    const toast = useToast();
    const queryClient = useQueryClient();
    const { mutate, isLoading } = useMutation(EditPromotion, {
        onSuccess: (res) => {
            queryClient.invalidateQueries('promociones')
            if (res.status == 500) {
                console.log(res)
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
                description: "Nombre de Banner ya Existente",
                status: "warning",
                duration: 5000,
                isClosable: true,
            })
        }
    })

    const validate = yup.object().shape({
        PRT_TITLE: yup.string().required("Debe ingresar un nombre"),
        PRT_DESCRIPTION: yup.string().required("Debe ingresar una descripción"),
        PRT_CREATED_AT: yup.date().required("Debe ingresar una fecha"),
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
                        initialValues={promotion}
                        validationSchema={validate}
                        onSubmit={async (values: any) => {
                            let promocion: IPromocion = {
                                //PRT_ID: 0,
                                PRT_CREATED_AT: values.PRT_CREATED_AT,
                                PRT_DESCRIPTION: values.PRT_DESCRIPTION,
                                //PRT_IMAGE: image,
                                //PRT_STATUS: "3",
                                PRT_TITLE: values.PRT_TITLE,
                                PRT_UPDATED_AT: ""
                            }

                            /* Then create a new FormData obj */
                            let formData = new FormData();


                            /* append input field values to formData */
                            for (let value in promocion) {
                                formData.append(value, values[value]);

                            }
                            /* FormData requires name: id */
                            formData.append("IMAGE", file[0]);
                            formData.append("PRT_STATUS", "3");
                            mutate({ formData: formData, PRT_ID: promotion.PRT_ID })
                            onClose()
                        }
                        }
                    >
                        <Form>
                            <ModalBody pb={6}>
                                <MyTextInput
                                    label="Titulo"
                                    name="PRT_TITLE"
                                    type="text"
                                    placeholder="Titulo de la Promoción"
                                />
                                <MyTextArea
                                    label="Descripción"
                                    name="PRT_DESCRIPTION"
                                    placeholder="Descripción de la Promoción"
                                />

                                <MyTextInput
                                    label="Fecha"
                                    name="PRT_CREATED_AT"
                                    type="datetime-local"
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