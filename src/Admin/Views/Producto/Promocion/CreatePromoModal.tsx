import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, Button } from '@chakra-ui/react'
import React, { ReactNode, useState } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import { Form, Formik } from 'formik';
import * as yup from 'yup'
import { MyImageInput, MyTextArea, MyTextInput } from '../../../../GlobalUI/Forms/MyInputs';
import { CreatePromotion } from '../../../../Service/PromotionAdminService';
import { IPromocion } from '../../../../Model/Promotion';

export const CreatePromoModal = ({ children }: { children: ReactNode }) => {
    const queryClient = useQueryClient()
    // ? HOOK PARA EL MODAL
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { mutate, isLoading } = useMutation(CreatePromotion, {
        onSuccess: (res) => {
            queryClient.invalidateQueries('promociones')
            if (res.status == 500) {
                throw new Error("error intentar mas adelante");
            }
        },
        onError: () => alert("error intentarlo luego")
    })
    /*
        * VARIABLES Y HOOKS PARA EL FORMULARIO
    */

    // ? HOOK PARA EL MANEJO DE IMAGENES
    const [image, setImage] = useState('https://ayjoe.engrave.site/img/default.jpg')
    const [file, setFile] = useState([])
    // ? HOOK PARA USAR EL MUTATION DE EDITAR CATEGORIA
    //const { mutateAsync, isLoading } = useMutation('createCategory')
    /*PRT_ID: number,
    PRT_CREATED_AT: string,
    PRT_DESCRIPTION: string,
    PRT_IMAGE: string,
    PRT_STATUS: string,
    PRT_TITLE: string,
    PRT_UPDATED_AT: string,
    */
    // ? OBJETO DE VALIDACIÓN DE INPUTS CON YUP
    const validate = yup.object().shape({
        PRT_TITLE: yup.string().required("Debe ingresar un nombre"),
        PRT_DESCRIPTION: yup.string().required("Debe ingresar una descripción"),
        PRT_CREATED_AT: yup.date().required("Debe ingresar una fecha"),
    })

    // ? OBJETO DE DEFINICIÓN DE VALORES INICIALES PARA EL FORMULARIO
    const values: {
        PRT_TITLE: string,
        PRT_DESCRIPTION: string,
        PRT_CREATED_AT: string,
    } = {
        PRT_TITLE: '',
        PRT_DESCRIPTION: '',
        PRT_CREATED_AT: '',
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
                    <ModalHeader>Agregar Promoción</ModalHeader>
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
                            mutate(formData)
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
                                <MyImageInput setFile={setFile} image={image} setImage={setImage} />
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    type="submit"
                                    /* isLoading={isLoading}
                                    isDisabled={isLoading} */
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