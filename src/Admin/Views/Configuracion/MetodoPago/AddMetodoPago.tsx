import { Box, Button, Center, Flex, FormControl, FormLabel, Grid, GridItem, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, useQuery, useToast } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import React, { ReactNode, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { MyImageInput, MyTextInput } from "../../../../GlobalUI/Forms/MyInputs";
import * as yup from 'yup'
import { CreateMetodoPago, EditMetodoPago } from "../../../../Service/MetodoPagoService";
import { Switch } from '@chakra-ui/react'
import { MyContain } from "../../../UI/Components/MyContain";

export const AddMetodoPago = ({ children }: { children: ReactNode }) => {

    const { isOpen, onOpen, onClose } = useDisclosure()

    const toast = useToast();
    const [image, setImage] = useState('https://ayjoe.engrave.site/img/default.jpg')
    const [file, setFile] = useState([])
    const [state, setState] = useState('1')

    const queryClient = useQueryClient()

    const { mutate, isLoading } = useMutation(CreateMetodoPago, {
        onSuccess: (res) => {
            queryClient.invalidateQueries('metodo_pago')
            //@ts-ignore
            if (res.status == 500) {
                throw new Error("error intentar mas adelante");
            }
            if (res.status == 300) {
                toast({
                    title: "limite excedido",
                    description: "excediste el limite para la imagen",
                    duration: 8000,
                    isClosable: true,
                });
            }
        },
        onError: (e) => {
            console.log(e);
            alert("error intentarlo luego")
        }
    })

    const validate = yup.object().shape({
        MPG_NAME: yup.string().required("Debe ingresar un nombre"),
        MPG_DESCRIPTION: yup.string().required("Debe ingresar una descripción"),
    })

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
                    <ModalHeader>AGREGAR MÉTODO DE PAGO</ModalHeader>
                    <ModalCloseButton />
                    <Formik
                        /* enableReinitialize={true} */
                        initialValues={{}}
                        validationSchema={validate}
                        onSubmit={
                            async (values: any) => {
                                console.log('VALORES QUE SE ENVIARÁ : ', values);
                                console.log('ESTADO DEL M+ETODO DE PAGO', state);
                                let estado = state

                                let metodopagos = {
                                    MPG_DESCRIPTION: values.MPG_DESCRIPTION,
                                    MPG_NAME: values.MPG_NAME
                                }

                                // /* Then create a new FormData obj */
                                let formData = new FormData();

                                // /* append input field values to formData */
                                for (let value in metodopagos) {
                                    formData.append(value, values[value]);


                                }
                                formData.append("MPG_STATUS", estado);
                                formData.append("IMAGE", file[0]);

                                console.log("ESTA ES LA DATA QUE SE ENVIARÁ", formData);

                                


                                mutate({ formData: formData })
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
                                    {/* <GridItem mx={2} colSpan={3}>
                                        <FormControl>
                                            <FormLabel>
                                                <Flex>
                                                    <Box>MÉTODO DE PAGO</Box>
                                                </Flex>
                                            </FormLabel>
                                            
                                        </FormControl>
                                    </GridItem> */}
                                    <GridItem mx={2} colSpan={3}>
                                        <MyTextInput
                                            label="Título:"
                                            name="MPG_NAME"
                                            placeholder="Número de la Placa" />
                                    </GridItem>
                                    <GridItem mx={2} colSpan={3}>
                                        <MyTextInput
                                            label="Descripción:"
                                            name="MPG_DESCRIPTION"
                                            placeholder="Número de Licencia" />
                                    </GridItem>
                                    <GridItem mx={2} colSpan={3}>
                                        <MyImageInput image={image} setFile={setFile} setImage={setImage} />
                                    </GridItem>

                                    <GridItem mx={2} colSpan={3}>
                                        <br />
                                        <Flex flexDirection={"column"}>
                                            <FormLabel htmlFor="ESTADO" mb="0">
                                                ESTADO DEL MÉTODO DE PAGO:
                                            </FormLabel>
                                            <br />
                                            {state == '1' ?
                                                <>

                                                    <MyContain>
                                                        <Flex flexDirection={'row'} justifyContent= {'center'}>

                                                            <FormLabel htmlFor="ESTADO" mb="0" color={'green.400'}>
                                                                ACTIVO
                                                            </FormLabel>
                                                            <Switch colorScheme={'green'} isChecked={state == '1' ? true : false} size='lg' onChange={(e) => {
                                                                setState('0');
                                                            }} />
                                                        </Flex>

                                                    </MyContain>
                                                </>
                                                :
                                                <>
                                                    <MyContain>
                                                        <Flex flexDirection={'row'} justifyContent= {'center'}>

                                                            <FormLabel htmlFor="ESTADO" mb="0" color={'red.300'}>
                                                                INACTIVO
                                                            </FormLabel>
                                                            <Switch isChecked={state == '1' ? true : false} size='lg' onChange={(e) => {
                                                                setState('1');
                                                            }} />
                                                        </Flex>
                                                    </MyContain>
                                                </>
                                            }
                                        </Flex>
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