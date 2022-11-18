import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, Button } from '@chakra-ui/react'
import React, { ReactNode, useState } from 'react'
import { useMutation } from 'react-query'
import { Form, Formik } from 'formik';
import * as yup from 'yup'
import { MyImageInput, MyTextArea, MyTextInput } from '../../../../GlobalUI/Forms/MyInputs';

export const CreateCatModal = ({ children }: { children: ReactNode }) => {

    // ? HOOK PARA EL MODAL
    const { isOpen, onOpen, onClose } = useDisclosure()
    /*
        * VARIABLES Y HOOKS PARA EL FORMULARIO
    */

    // ? HOOK PARA EL MANEJO DE IMAGENES
    const [file, setFile] = useState([])
    const [image, setImage] = useState('https://ayjoe.engrave.site/img/default.jpg')

    // ? HOOK PARA USAR EL MUTATION DE EDITAR CATEGORIA
    const { mutateAsync, isLoading } = useMutation('createCategory')

    // ? OBJETO DE VALIDACIÓN DE INPUTS CON YUP
    const validate = yup.object().shape({
        CAT_NAME: yup.string().required("Debe ingresar un nombre"),
        CAT_EXPIRATION_MONTH: yup.number().required("Debe ingresar un numero valido"),
        CAT_NUMERATION: yup.number().required("Debe ingresar un numero valido"),
        CAT_DESCRIPTION: yup.string().required("Debe ingresar una descripción"),
        CAT_CREATE_DATE: yup.date().required("Debe ingresar una fecha"),
    })

    // ? OBJETO DE DEFINICIÓN DE VALORES INICIALES PARA EL FORMULARIO
    const values = {
        CAT_NAME: '',
        CAT_DESCRIPTION: '',
        CAT_EXPIRATION_MONTH: '',
        CAT_NUMERATION: '',
        CAT_CREATE_DATE: '',
    }

    return (
        <>
            {/* SE RECIBE EL CHILDREN Y SE ASIGNA EL ONCLIK PARA INICIAR EL MODAL */}
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
                    <ModalHeader>Agregar Categoría</ModalHeader>
                    <ModalCloseButton />
                    {/*
                        ESTE ELEMENTO NO ALTERO LOS ESTILOS DE MANERA SIGNIFICATIVO
                        SU FUNCIÓN ES PREPARAR EL FORMULARIO, LOS CAMBIOS EN EL ESTILO SON MINIMOS
                        Y PODRIAN CONSIDERARSE BUGS,
                        ESTOS CAMBIOS PUEDEN ALTERAR EL FLEX Y LOS WIDTHS
                    */}
                    <Formik
                        // * VALORES INICIALES
                        initialValues={values}
                        // * VALIDADOR
                        validationSchema={validate}
                        // * ENVIAR
                        onSubmit={async (values: any) => {
                            /* Then create a new FormData obj */
                            let formData = new FormData();
                            /* append input field values to formData */
                            for (let value in values) {
                                formData.append(value, values[value]);
                            }
                            /* FormData requires name: id */
                            formData.append("IMAGE", file[0]);
                            //@ts-ignore
                            await mutateAsync(formData)
                            onClose()
                        }}
                    >
                        <Form>
                            <ModalBody pb={6}>
                                {/*
                                    LOS INPUTS YA ESTÁN CREADOS
                                    EL VALOR ESENCIAL PARA APLICAR LAS VALIDACIONES
                                    ES EL 'name'
                                */}
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