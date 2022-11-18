import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, Button } from '@chakra-ui/react'
import React, { ReactNode, useState } from 'react'
import { useMutation } from 'react-query'
import { Form, Formik } from 'formik';
import * as yup from 'yup'
import { MyImageInput, MyTextArea, MyTextInput } from '../../../../GlobalUI/Forms/MyInputs';

export const EditCatModal = ({ children, category }: { children: ReactNode, category: any }) => {

    const { isOpen, onOpen, onClose } = useDisclosure()
    const [file, setFile] = useState([])
    const [image, setImage] = useState(category.CAT_IMAGE || 'https://ayjoe.engrave.site/img/default.jpg')

    const { mutateAsync, isLoading } = useMutation('editeCategory')

    const validate = yup.object().shape({
        CAT_NAME: yup.string().required("Debe ingresar un nombre"),
        CAT_EXPIRATION_MONTH: yup.number().required("Debe ingresar un numero valido"),
        CAT_NUMERATION: yup.number().required("Debe ingresar un numero valido"),
        CAT_DESCRIPTION: yup.string().required("Debe ingresar una descripción"),
        CAT_CREATE_DATE: yup.date().required("Debe ingresar una fecha"),
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
                    <ModalHeader>Editar Categoría</ModalHeader>
                    <ModalCloseButton />
                    <Formik
                        initialValues={category}
                        validationSchema={validate}
                        onSubmit={async (values: any) => {
                            let formData = new FormData();
                            /* append input field values to formData */
                            for (let value in values) {
                                formData.append(value, values[value]);
                            }
                            /* FormData requires name: id */
                            formData.append("IMAGE", file[0]);
                            //@ts-ignore
                            await mutateAsync({ formData: formData, CAT_ID: category.CAT_ID })
                            onClose()
                        }}
                    >
                        <Form>
                            <ModalBody pb={6}>
                                <MyTextInput
                                    label="Nombre"
                                    name="CAT_NAME"
                                    type="text"
                                    placeholder="Nombre de categoría"
                                />
                                <MyTextInput
                                    label="Meses de Expiracion"
                                    name="CAT_EXPIRATION_MONTH"
                                    type="number"
                                    placeholder="Nombre de categoría"
                                />
                                <MyTextInput
                                    label="Numero de Prioridad"
                                    name="CAT_NUMERATION"
                                    type="number"
                                    placeholder="Nombre de categoría"
                                />
                                <MyTextArea
                                    label="Descripción"
                                    name="CAT_DESCRIPTION"
                                    placeholder="Descripción de categoría"
                                />
                                <MyTextInput
                                    label="Fecha"
                                    name="CAT_CREATE_DATE"
                                    type="datetime-local"
                                />
                                <MyImageInput setFile={setFile} image={image} setImage={setImage} />
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