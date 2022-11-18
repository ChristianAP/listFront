import { Box, Button, Flex, FormControl, FormLabel, Grid, GridItem, Icon, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, Tooltip, useDisclosure } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import React, { useState } from "react";
import { BiPlus } from "react-icons/bi";
import { GrRefresh } from "react-icons/gr";
import { useMutation, useQueryClient } from "react-query";
import { InputSearch, MyTextInput } from "../../../../GlobalUI/Forms/MyInputs";
import { AddPlaLice, createRolConductor, GetPersonByID } from "../../../../Service/PersonService";
import { SearchDriver, SearchUser } from "../../../../Service/User";

export const AddConductor = () => {
    const { isOpen, onOpen, onClose } = useDisclosure()

    const [valueId, setValueId] = React.useState(String);
    const [searchInput, setSearchInput] = useState("");
    const [listPerson, setPersonSearch] = useState<[]>([]);
    const [valueName, setValueName] = React.useState(String);

    const { mutateAsync } = useMutation(createRolConductor)
    const { mutateAsync: PlacaLicencia } = useMutation(AddPlaLice)

    const queryClient = useQueryClient()
    async function searchDriver(event: any) {
        event.preventDefault();
        if (
            searchInput != "" ||
            event.type == "click" ||
            event.type == "keypress"
        ) {
            setPersonSearch(await SearchDriver(searchInput));
        }
    }


    async function changeSelectSearch(changeValueId: any, changeValueName: any) {
        setValueId(changeValueId);
        setValueName(changeValueName);
    }
    const valuesInitial = {
        PER_ID: "",
        PER_PLATE: "",
        PER_LICENSE: "",
    };


    return (
        <>
            <Flex>
                <Button onClick={onOpen} aria-label="Agregar Placa y Licencia"><BiPlus fontSize={"xl"} /> &nbsp; &nbsp;Agregar</Button>
            </Flex>

            <Modal
                closeOnOverlayClick={false}
                closeOnEsc={false}
                isOpen={isOpen}
                onClose={onClose}
            >
                <ModalOverlay />
                <ModalContent maxW={{ base: "95%", md: "40%" }}>
                    <ModalHeader>Agregar Licencia y Placa</ModalHeader>
                    <ModalCloseButton />
                    <Formik
                        /* enableReinitialize={true} */
                        initialValues={valuesInitial}
                        /* validationSchema={validate} */
                        onSubmit={
                            async (values: any) => {
                                console.log({ 'PER_ID': valueId, 'PER_PLATE': values.PER_PLATE, 'PER_LICENSE': values.PER_LICENSE })
                                await mutateAsync(Number(valueId))
                                await PlacaLicencia({ 'PER_ID': valueId, 'PER_PLATE': values.PER_PLATE, 'PER_LICENSE': values.PER_LICENSE })
                                queryClient.invalidateQueries("conductor")
                                setValueId('');
                                setValueName('');
                                setSearchInput('')
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
                                        <FormControl>
                                            <FormLabel>
                                                <Flex>
                                                    <Box>Conductor</Box>
                                                </Flex>
                                            </FormLabel>
                                            {valueId == "" ? (
                                                <InputSearch
                                                    setValueSearch={setSearchInput}
                                                    sendValueSearch={searchDriver}
                                                    valueSearch={searchInput}
                                                    dataGet={listPerson}
                                                    selectedValue={changeSelectSearch}
                                                />
                                            ) : (
                                                <Text fontWeight="bold">{valueName} <Tooltip label='Cambiar conductor'>
                                                    <Button size="xs" onClick={() => { setValueId("") }}>
                                                        <Icon as={GrRefresh} />
                                                    </Button>
                                                </Tooltip></Text>

                                            )}
                                        </FormControl>
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