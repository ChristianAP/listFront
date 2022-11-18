import { Box, Button, Grid, GridItem, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import React, { ReactNode } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { MyTextInput } from "../../../../GlobalUI/Forms/MyInputs";
import { EditStep } from "../../../../Service/OrderSteps";

export const UpdateStep = ({ array, children }: { array: any, children: ReactNode }) => {

    const { isOpen, onOpen, onClose } = useDisclosure()

 
    const { mutateAsync } = useMutation(EditStep)

    const queryClient = useQueryClient()

    const valuesInitial = {
        ORS_ID : array.ORS_ID,
        ORS_NAME : array.ORS_NAME,
        ORS_DESCRIPTION : array.ORS_DESCRIPTION,
        ORS_ICON : array.ORS_ICON,
        ORS_STATUS : array.ORS_STATUS
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
                    <ModalHeader>MODIFICAR PASOS ONLINE</ModalHeader>
                    <ModalCloseButton />
                    <Formik
                        /* enableReinitialize={true} */
                        initialValues={valuesInitial}
                        /* validationSchema={validate} */
                        onSubmit={
                            async (values: any) => {
                                // console.log({ 'PER_ID': values.PER_ID, 'PER_PLATE': values.PER_PLATE, 'PER_LICENSE': values.PER_LICENSE })
                                await mutateAsync(
                                    {
                                        ORS_ID : array.ORS_ID,
                                        ORS_NAME : values.ORS_NAME,
                                        ORS_DESCRIPTION : values.ORS_DESCRIPTION,
                                        ORS_ICON : values.ORS_ICON,
                                        ORS_STATUS : array.ORS_STATUS
                                    }
                                )
                                queryClient.invalidateQueries("pasosOnline")
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
                                            label="Nombre del Paso Online"
                                            name="ORS_NAME"
                                            placeholder="Nombre del Paso: " />

                                    </GridItem>
                                    <GridItem mx={2} colSpan={3}>
                                        <MyTextInput
                                            label="Descipción del paso online"
                                            name="ORS_DESCRIPTION"
                                            placeholder="Descripción del Paso: " />
                                    </GridItem>
                                    <GridItem mx={2} colSpan={3}>
                                        <MyTextInput
                                            label="Icono del Paso"
                                            name="ORS_ICON"
                                            placeholder="Icono del Paso: " />
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