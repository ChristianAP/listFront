import { Box, Button, Divider, Flex, Grid, GridItem, Input, List, ListIcon, ListItem, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spacer, Text, useDisclosure } from "@chakra-ui/react"
import { Form, Formik } from "formik"
import React, { ReactNode, useState } from "react"
import { MdCheckCircle } from "react-icons/md"
import { useMutation, useQueryClient } from "react-query"
import { MyTextInput } from "../../../../GlobalUI/Forms/MyInputs"
import { EditFormaVenta } from "../../../../Service/FormaVentaService"

export const EditFormaVentaModal = ({ children, formaveta }: { children: ReactNode, formaveta: any }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const queryClient = useQueryClient();
    const { mutateAsync } = useMutation(EditFormaVenta)
    const [detail, setDetail] = useState(formaveta.ORT_DETAIL.split('|'))
    const [det, setDet] = useState("")
    console.log(formaveta);

    function handleClick() {
        //@ts-ignore
        document.getElementById("codebar").value = ""
        setDetail((old: any) => {
            // @ts-ignore
            return [...old, det];
        })
        console.log(detail);
    }
    function handleOnClick(idex: any) {
        setDetail((old: any) => {
            // @ts-ignore
            return old.filter((val, idx) => idx !== idex);
        })
    }
    return (
        <Box w="100%">
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
                        initialValues={formaveta}
                        //validationSchema={validate}
                        onSubmit={async (values: any) => {
                            values.ORT_DETAIL = detail.join("|")
                            console.log(values);
                            let formData = new FormData();
                            /* append input field values to formData */
                            for (let value in values) {
                                formData.append(value, values[value]);
                            }
                            await mutateAsync({ formData: formData, MPG_ID: values.ORT_ID })
                            queryClient.invalidateQueries("order_type")
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
                                    <GridItem mx={2} colSpan={6}>
                                        <MyTextInput
                                            label="Nombre"
                                            name="ORT_NAME"
                                            placeholder="Nombre"
                                        />
                                    </GridItem>
                                </Grid>
                                <Box w="100%">
                                    <Text fontSize="lg" fontWeight="bold">
                                        Agregar producto
                                    </Text>
                                    <Flex borderRadius="5px" borderWidth="2px" p="5px" alignItems={"end"}>
                                        <Spacer />
                                        <Box w="80%" >
                                            <label htmlFor="codebar">{ }</label>
                                            <Input
                                                name="PRO_CODEBAR"
                                                type="text"
                                                id="codebar"
                                                onKeyUp={(e: any) => {
                                                    setDet(e.target.value);
                                                }} />
                                        </Box>
                                        <Spacer />
                                        <Box>
                                            <br />
                                            <Button
                                                colorScheme="green"
                                                //type="submit"
                                                onClick={handleClick}>
                                                Agregar Regla
                                            </Button>
                                        </Box>
                                    </Flex>
                                    <Divider />
                                    <List spacing={3}>
                                        {//@ts-ignore
                                            detail.map((val, idx) =>
                                                <ListItem display={"flex"} alignItems={"center"}>
                                                    <ListIcon as={MdCheckCircle} color='green.500' />
                                                    <Flex alignItems={"center"} justifyContent={"space-between"} w={"full"}><Text>{val}{idx}</Text><Button onClick={() => handleOnClick(idx)}>X</Button></Flex>
                                                </ListItem>
                                            )}
                                    </List>
                                </Box>
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

        </Box >
    )
}