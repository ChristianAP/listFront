import { Box, Button, Flex, FormControl, FormLabel, Grid, GridItem, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import React, { ReactNode } from "react";
import { BiPlus } from "react-icons/bi";
import { useMutation, useQueryClient } from "react-query";
import { MyTextInput } from "../../../../GlobalUI/Forms/MyInputs";
import { AddPlaLice } from "../../../../Service/PersonService";

export const UpdateConductor = ({ array, children }: { array: any, children: ReactNode }) => {

    const { onOpen, isOpen, onClose } = useDisclosure()

    const { mutateAsync } = useMutation(AddPlaLice)

    const queryClient = useQueryClient()

    const valuesInitial = {
        PER_ID: array.PER_ID,
        name: array.PER_NAME + ' ' + array.PER_LASTNAME,
        USR_ID: array.USR_ID,
        PER_PLATE: array.PER_PLATE,
        PER_LICENSE: array.PER_LICENSE
    }

    return (
        <>
            <Box onClick={onOpen}>
                {children}
            </Box>

            <Modal
                closeOnOverlayClick={false}
                closeOnEsc={false}
                isOpen={isOpen}
                onClose={onClose}
            >
                <ModalOverlay />
                <ModalContent maxW={{ base: "95%", md: "40%" }}>
                    <ModalHeader>Modificar Licencia y Placa</ModalHeader>
                    <ModalCloseButton />
                    <Formik
                        /* enableReinitialize={true} */
                        initialValues={valuesInitial}
                        /* validationSchema={validate} */
                        onSubmit={
                            async (values: any) => {
                                console.log({ 'PER_ID': values.PER_ID, 'PER_PLATE': values.PER_PLATE, 'PER_LICENSE': values.PER_LICENSE })
                                await mutateAsync({ 'PER_ID': values.PER_ID, 'PER_PLATE': values.PER_PLATE, 'PER_LICENSE': values.PER_LICENSE })                               
                                queryClient.invalidateQueries("conductor")
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
                                            label="nombre de Conductor"
                                            name="name"
                                            placeholder="Nombre del Conductor : " />

                                    </GridItem>
                                    <GridItem mx={2} colSpan={3}>
                                        <MyTextInput
                                            label="Número de Placa"
                                            name="PER_PLATE"
                                            placeholder="Número de la Placa" />
                                    </GridItem>
                                    <GridItem mx={2} colSpan={3}>
                                        <MyTextInput
                                            label="Número de Licencia"
                                            name="PER_LICENSE"
                                            placeholder="Número de Licencia" />
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
    );
}