import { background, Button, Flex, Grid, GridItem, IconButton, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import React, { useEffect } from 'react'
import { BiPlus } from 'react-icons/bi';
import { useMutation, useQueryClient } from 'react-query';
import { MyTextInput } from '../../../../GlobalUI/Forms/MyInputs';
import { createPointSale } from '../../../../Service/PoaintSaleService';

export const RegPosModal = ({ }: {}) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { mutateAsync } = useMutation(createPointSale)

    const queryClient = useQueryClient()

    useEffect(() => {
        //@ts-ignore
        document.getElementById('title_view').textContent = 'Punto de Venta(Feria)';
    }, [])
    return (
        <>
            <Flex>
                <Button onClick={onOpen} aria-label='Search database' bg={'green.500'} color={'white'} _hover={{color: "green.500", background: 'white'}}><BiPlus fontSize={"xl"} /> &nbsp; &nbsp; Agregar</Button>
            </Flex>
            <Modal
                closeOnOverlayClick={false}
                closeOnEsc={false}
                isOpen={isOpen}
                onClose={onClose}
            >
                <ModalOverlay />
                <ModalContent maxW={{ base: "95%", md: "40%" }}>
                    <ModalHeader>Agregar Punto de Venta</ModalHeader>
                    <ModalCloseButton />
                    <Formik
                        /* enableReinitialize={true} */
                        initialValues={{}}
                        /* validationSchema={validate} */
                        onSubmit={async (values: any) => {
                            console.log(values)
                            await mutateAsync(values)
                            queryClient.invalidateQueries("PointSales")
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
                                            label="Nombre del POS "
                                            name="POS_NAME"
                                            placeholder="Ej. 58758.." />
                                    </GridItem>
                                    <GridItem mx={2} colSpan={3}>
                                        <MyTextInput
                                            label="Descripción del POS"
                                            name="POS_DESCRIPTION"
                                            placeholder="Nombre de proveedor" />
                                    </GridItem>
                                    <GridItem mx={2} colSpan={3}>
                                        <MyTextInput
                                            label="Dirección del POS"
                                            name="POS_DIRECTION"
                                            placeholder="Nombre de proveedor" />
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
