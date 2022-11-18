import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, Button } from '@chakra-ui/react'
import { Grid, GridItem } from '@chakra-ui/layout'
import React, { ReactNode, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { Form, Formik } from 'formik';
import * as yup from 'yup'
import { MyImageInput, MySelect, MyTextArea, MyTextInput } from '../../../../GlobalUI/Forms/MyInputs';
import { EditPersona } from '../../../../Service/PersonService';
import { getDatosSunat } from '../../../../Service/ProviderService';
import { window } from 'rxjs';

export const EditProviderModal = ({ children, provider: myprovider }: { children: ReactNode, provider: any }) => {
    const [provider, setProvider] = useState(myprovider)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { data, refetch } = useQuery(["", provider.PER_RUC], () => getDatosSunat(provider.PER_RUC), { enabled: false })
    const validate = yup.object().shape({
        PER_DNI: yup.string().required("Debe ingresar un numero de identificacion"),
        PER_NAME: yup.string().required("Debe ingresar el nombre del proveedor"),
        PER_TRADENAME: yup.string().required("Debe ingresar el apellido del proveedor"),
        PER_COUNTRY: yup.string().required("Debe ingresar una ubicacion"),
        PER_DEPARTMENT: yup.string().required("Debe ingresar una ubicacion"),
        PER_PROVINCE: yup.string().required("Debe ingresar una ubicacion"),
        PER_DISTRIC: yup.string().required("Debe ingresar una ubicacion"),
        PER_DIRECTION: yup.string().required("Debe ingresar una ubicacion"),
        PER_N_PHONE: yup.string().required("Debe ingresar un numero de celular"),
        PER_EMAIL: yup.string().required("Debe ingresar un correo valido"),
    })

    const queryClient = useQueryClient()

    async function handleSunat(ruc: any) {
        await refetch()
        setProvider({
            ...provider,
            PER_DIRECTION: data.direccion,
            PER_DEPARTMENT: data.departamento,
            PER_DISTRIC: data.distrito,
            PER_PROVINCE: data.provincia,
            PER_TRADENAME: data.razonSocial,
        })
    }

    let initial = {
        PER_DNI: provider.PER_DNI,
        PER_RUC: provider.PER_RUC,
        PER_NAME: provider.PER_NAME,
        PER_TRADENAME: provider.PER_TRADENAME,
        PER_COUNTRY: provider.PER_COUNTRY,
        PER_DEPARTMENT: provider.PER_DEPARTMENT,
        PER_PROVINCE: provider.PER_PROVINCE,
        PER_DISTRIC: provider.PER_DISTRIC,
        PER_N_PHONE: provider.PER_N_PHONE,
        PER_DIRECTION: provider.PER_DIRECTION,
        PER_EMAIL: provider.PER_EMAIL
    }

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
                <ModalContent maxW="40%">
                    <ModalHeader>Registrar Proveedor</ModalHeader>
                    <ModalCloseButton />
                    <Formik
                        enableReinitialize={true}
                        initialValues={initial}
                        validationSchema={validate}
                        onSubmit={async (values: any) => {
                            await EditPersona(provider.PER_ID, {
                                values,
                            });
                            await queryClient.invalidateQueries('tempActive')
                            location.reload()
                            onClose()
                        }}
                    >
                        <Form>
                            <ModalBody pb={6}>
                                <Grid
                                    h="auto"
                                    templateColumns="repeat(6, 16.6%)"
                                    w="full"
                                >
                                    <GridItem mx={2} colSpan={3}>
                                        <MyTextInput
                                            label="Número documento"
                                            name="PER_DNI"
                                            placeholder="Ej. 58758.."
                                        />
                                    </GridItem>
                                    <GridItem mx={2} colSpan={3}>
                                        <MyTextInput
                                            label="Número RUC"
                                            name="PER_RUC"
                                            placeholder="Ej. 1058758.."
                                            // onChange={(e: any) => setProvider({ ...provider, PER_RUC: e.target.value })}
                                        />
                                    </GridItem>
                                    {/* <GridItem mx={2} colSpan={1} position="relative">
                                        <Button
                                            position="absolute"
                                            bottom="0"
                                            onClick={() => handleSunat(provider.PER_RUC)}
                                        >
                                            SUNAT
                                        </Button>
                                    </GridItem> */}
                                    <GridItem mx={2} colSpan={3}>
                                        <MyTextInput
                                            label="Nombre"
                                            name="PER_NAME"
                                            placeholder="Nombre de proveedor"
                                        />
                                    </GridItem>
                                    <GridItem mx={2} colSpan={3}>
                                        <MyTextInput
                                            label="Nombre comercial"
                                            name="PER_TRADENAME"
                                            placeholder="Nombre comercial"
                                        />
                                    </GridItem>
                                    <GridItem mx={2} colSpan={3}>
                                        <MyTextInput
                                            label="Pais"
                                            name="PER_COUNTRY"
                                            placeholder="Nombre de Pais"
                                        />
                                    </GridItem>
                                    <GridItem mx={2} colSpan={3}>
                                        <MyTextInput
                                            label="Departamento"
                                            name="PER_DEPARTMENT"
                                            placeholder="Nombre de Departamento"
                                        />
                                    </GridItem>
                                    <GridItem mx={2} colSpan={3}>
                                        <MyTextInput
                                            label="Provincia"
                                            name="PER_PROVINCE"
                                            placeholder="Nombre de Provincia"
                                        />
                                    </GridItem>
                                    <GridItem mx={2} colSpan={3}>
                                        <MyTextInput
                                            label="Distrito"
                                            name="PER_DISTRIC"
                                            placeholder="Nombre de Distrito"
                                        />
                                    </GridItem>
                                    <GridItem mx={2} colSpan={3}>
                                        <MyTextInput
                                            label="Teléfono"
                                            name="PER_N_PHONE"
                                            placeholder="+51 981..."
                                        />
                                    </GridItem>
                                    <GridItem mx={2} colSpan={3}>
                                        <MyTextInput
                                            label="Dirección"
                                            name="PER_DIRECTION"
                                            placeholder="Escriba dirección"
                                        />
                                    </GridItem>
                                    <GridItem mx={2} colSpan={3}>
                                        <MyTextInput
                                            label="Correo Electrónico"
                                            name="PER_EMAIL"
                                            placeholder="example@gmail.com"
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