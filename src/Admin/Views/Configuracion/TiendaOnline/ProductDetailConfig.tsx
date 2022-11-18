import { Box, Button, Checkbox, Flex, FormLabel, Image, Switch, Text, useColorModeValue } from "@chakra-ui/react"
import React, { useEffect, useState } from 'react';
import { FaCartPlus } from "react-icons/fa";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { EditDescriptionProducts, getProductDescritions } from "../../../../Service/OrderSteps";
import { MyContain } from "../../../UI/Components/MyContain";
export const ProductDetailConfig = () => {

    const imgAndDetailProductBG = useColorModeValue("white", "gray.800");
    const deltailProductBG = useColorModeValue("gray.100", "gray.700");
    const buttonHoverBG = useColorModeValue("gray.500", "gray.300");

    const { data, isLoading, isError } = useQuery('stateDescriptionProduct', getProductDescritions, { refetchOnWindowFocus: false })

    const { mutateAsync } = useMutation(EditDescriptionProducts)

    const [state, setState] = useState({
        PCD_NAME: '',
        PCD_DESCRIPTION: '',
        PCD_PRICE: '',
        PCD_WEIGHT: '',
        PCD_CURDATE: '',

    })

    const queryClient = useQueryClient()

    useEffect(() => {
        data && data.forEach((e: any) => {
            setState({
                PCD_NAME: e.PCD_NAME,
                PCD_DESCRIPTION: e.PCD_DESCRIPTION,
                PCD_PRICE: e.PCD_PRICE,
                PCD_WEIGHT: e.PCD_WEIGHT,
                PCD_CURDATE: e.PCD_CURDATE,
            })
        });
    }, [data])

    return (

        <>
            <>
                <Flex bg={"gray.200"}>
                    <Box
                        flex="5"
                        padding="8"
                        margin="4"
                        borderRadius="md"
                        bg={imgAndDetailProductBG}
                    >
                        <Image src={'https://ayjoe.engrave.site/img/default.jpg'} alt={"producto de prueba"} />
                    </Box>

                    <Box
                        flex="7"
                        padding="8"
                        margin="4"
                        borderRadius="md"
                        bg={imgAndDetailProductBG}
                    >
                        <>
                            <Flex gridGap="10%" flexDirection={'row'} justifyItems={'center'}>
                                <MyContain>
                                    <Flex flexDirection={'row'} justifyContent={'center'}>
                                        {
                                            state.PCD_NAME == '1' ?
                                                <>
                                                    <FormLabel htmlFor="ESTADO" mb="0" color={'green.300'}>
                                                        ACTIVO
                                                    </FormLabel>
                                                    <Switch isChecked={state.PCD_NAME == '1' ? true : false} size='lg' colorScheme={'green'} onChange={async (e) => {
                                                        setState({ ...state, PCD_NAME: '0' });
                                                        await mutateAsync({ PCD_NAME: '0' })
                                                        // queryClient.invalidateQueries("stateDescriptionProduct")
                                                    }} />
                                                </>
                                                :
                                                <>
                                                    <>
                                                        <FormLabel htmlFor="ESTADO" mb="0" color={'red.300'}>
                                                            INACTIVO
                                                        </FormLabel>
                                                        <Switch isChecked={state.PCD_NAME == '1' ? true : false} size='lg' onChange={async (e) => {
                                                            setState({ ...state, PCD_NAME: '1' });
                                                            await mutateAsync({ PCD_NAME: '1' })
                                                            // queryClient.invalidateQueries("stateDescriptionProduct")

                                                        }}

                                                        />
                                                    </>
                                                </>
                                        }
                                    </Flex>
                                </MyContain>
                                <Text fontSize="2xl">Nombre del Producto</Text>
                            </Flex>
                            <Flex gridGap="10%" flexDirection={'row'} justifyItems={'center'}>
                                <MyContain>
                                    <Flex flexDirection={'row'} justifyContent={'center'}>
                                        {
                                            state.PCD_PRICE == '1' ?
                                                <>
                                                    <FormLabel htmlFor="ESTADO" mb="0" color={'green.300'}>
                                                        ACTIVO
                                                    </FormLabel>
                                                    <Switch isChecked={state.PCD_PRICE == '1' ? true : false} size='lg' colorScheme={'green'} onChange={async (e) => {
                                                        setState({ ...state, PCD_PRICE: '0' });
                                                        await mutateAsync({ PCD_PRICE: '0' })
                                                    }} />
                                                </>
                                                :
                                                <>
                                                    <FormLabel htmlFor="ESTADO" mb="0" color={'red.300'}>
                                                        INACTIVO
                                                    </FormLabel>
                                                    <Switch isChecked={state.PCD_PRICE == '1' ? true : false} size='lg' onChange={async (e) => {
                                                        setState({ ...state, PCD_PRICE: '1' });
                                                        await mutateAsync({ PCD_PRICE: '1' })
                                                        // queryClient.invalidateQueries("stateDescriptionProduct")

                                                    }} />
                                                </>
                                        }
                                    </Flex>
                                </MyContain>
                                <Text fontSize="2xl">S/.Precio del Producto</Text>
                            </Flex>
                            <br />
                            <Flex
                                borderRadius="md"
                                bg={deltailProductBG}
                                padding="4"
                                direction="column"
                            >
                                <Text fontSize="3xl">Descripción</Text>
                                <Flex gridGap="10%" flexDirection={'row'} justifyItems={'center'}>
                                    <MyContain>
                                        <Flex flexDirection={'row'} justifyContent={'center'}>
                                            {
                                                state.PCD_DESCRIPTION == '1' ?
                                                    <>
                                                        <FormLabel htmlFor="ESTADO" mb="0" color={'green.300'}>
                                                            ACTIVO
                                                        </FormLabel>
                                                        <Switch isChecked={state.PCD_DESCRIPTION == '1' ? true : false} size='lg' colorScheme={'green'} onChange={async (e) => {
                                                            setState({ ...state, PCD_DESCRIPTION: '0' });
                                                            await mutateAsync({ PCD_DESCRIPTION: '0' })
                                                        }} />
                                                    </>
                                                    :
                                                    <>
                                                        <FormLabel htmlFor="ESTADO" mb="0" color={'red.300'}>
                                                            INACTIVO
                                                        </FormLabel>
                                                        <Switch isChecked={state.PCD_DESCRIPTION == '1' ? true : false} size='lg' onChange={async (e) => {
                                                            setState({ ...state, PCD_DESCRIPTION: '1' });
                                                            await mutateAsync({ PCD_DESCRIPTION: '1' })
                                                            // queryClient.invalidateQueries("stateDescriptionProduct")

                                                        }} />
                                                    </>
                                            }
                                        </Flex>

                                    </MyContain>

                                    <Text marginBottom="4" fontSize="xl">
                                        Descripcion del Producto
                                    </Text>
                                </Flex>
                                <Flex gridGap="10%" flexDirection={'row'} justifyItems={'center'}>
                                    <MyContain>
                                        <Flex flexDirection={'row'} justifyContent={'center'}>
                                            {
                                                state.PCD_WEIGHT == '1' ?
                                                    <>
                                                        <FormLabel htmlFor="ESTADO" mb="0" color={'green.300'}>
                                                            ACTIVO
                                                        </FormLabel>
                                                        <Switch isChecked={state.PCD_WEIGHT == '1' ? true : false} size='lg' colorScheme={'green'} onChange={async (e) => {
                                                            setState({ ...state, PCD_WEIGHT: '0' });
                                                            await mutateAsync({ PCD_WEIGHT: '0' })
                                                        }} />
                                                    </>
                                                    :
                                                    <>
                                                        <FormLabel htmlFor="ESTADO" mb="0" color={'red.300'}>
                                                            INACTIVO
                                                        </FormLabel>
                                                        <Switch isChecked={state.PCD_WEIGHT == '1' ? true : false} size='lg' onChange={async (e) => {
                                                            setState({ ...state, PCD_WEIGHT: '1' });
                                                            await mutateAsync({ PCD_WEIGHT: '1' })
                                                            // queryClient.invalidateQueries("stateDescriptionProduct")

                                                        }} />
                                                    </>
                                            }
                                        </Flex>
                                    </MyContain>
                                    <Text marginBottom="4" fontSize="xl">
                                        peso neto de XX.XXKg.
                                    </Text>
                                </Flex>
                                <Flex gridGap="10%" flexDirection={'row'} justifyItems={'center'}>
                                    <MyContain>
                                        <Flex flexDirection={'row'} justifyContent={'center'}>
                                            {
                                                state.PCD_CURDATE == '1' ?
                                                    <>
                                                        <FormLabel htmlFor="ESTADO" mb="0" color={'green.300'}>
                                                            ACTIVO
                                                        </FormLabel>
                                                        <Switch isChecked={state.PCD_CURDATE == '1' ? true : false} size='lg' colorScheme={'green'} onChange={async (e) => {
                                                            setState({ ...state, PCD_CURDATE: '0' });
                                                            await mutateAsync({ PCD_CURDATE: '0' })
                                                        }} />
                                                    </>
                                                    :
                                                    <>
                                                        <FormLabel htmlFor="ESTADO" mb="0" color={'red.300'}>
                                                            INACTIVO
                                                        </FormLabel>
                                                        <Switch isChecked={state.PCD_CURDATE == '1' ? true : false} size='lg' onChange={async (e) => {
                                                            setState({ ...state, PCD_CURDATE: '1' });
                                                            await mutateAsync({ PCD_CURDATE: '1' })
                                                            // queryClient.invalidateQueries("stateDescriptionProduct")

                                                        }} />
                                                    </>
                                            }
                                        </Flex>
                                    </MyContain>
                                    <Text marginBottom="4" fontSize="xl">
                                        Fecha de vencimiento DD/MM/ÑÑÑÑ
                                    </Text>
                                </Flex>
                                <br />
                                <Button
                                    leftIcon={<FaCartPlus />}
                                    colorScheme="teal"
                                    variant="solid"
                                    _hover={{ bg: buttonHoverBG }}
                                >
                                    "Agregar a Carrito" O "Excede el Limite"
                                </Button>
                            </Flex>
                        </>
                    </Box>
                </Flex >
            </>
        </>
    )

}
