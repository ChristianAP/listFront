import { Alert, AlertIcon, Box, Button, Checkbox, Flex, Grid, IconButton, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, RangeSlider, RangeSliderFilledTrack, RangeSliderThumb, RangeSliderTrack, Text, useDisclosure } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import React, { useState } from "react";
import { FiEdit } from "react-icons/fi";
import { GrConfigure } from "react-icons/gr";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { async } from "regenerator-runtime";
import { MyTextInput } from "../../../../GlobalUI/Forms/MyInputs";
import { editConfigCodebar, getTypeDocument, updateOtherCodebars } from "../../../../Service/codebar_configService";
import { MyContain } from "../../../UI/Components/MyContain";

export const UpdateCodebar = ({ data, complete }: { data: any, complete: any }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()

    const [codigoBarras, setCodigoBarras] = useState<any>([])
    const [length, setlength] = useState(data.CDC_LENGTH)
    const [tama, setTama] = useState(0)
    const [update, setUpdate] = useState(true)

    const { mutateAsync } = useMutation(editConfigCodebar)
    const { mutateAsync: mutateAsyncOhters } = useMutation(updateOtherCodebars)

    const queryClient = useQueryClient()
    
  

    const initialValue = {
        CDC_LENGTH: data.CDC_LENGTH
    }
    return (
        <>
            <IconButton aria-label="open modal" icon={<GrConfigure />} size='lg' background={'white'} backgroundColor={'#006e93'}
                onClick={() => {
                    console.log("ESTA ES LA DATA DE LA FILA ...", data);
                    console.log("ESTA ES LA TODA LA DATA COMPLETE ...", complete);
                    console.log("ESTE ES EL PRIMER NUMERO DE LA FILA 1 ...", complete[0].CDC_DISTANCE.split(',')[0]);
                    console.log("ESTE ES EL SEGUNDO NUMERO DE LA FILA 1 ...", complete[0].CDC_DISTANCE.split(',')[1]);
                    let range = data.CDC_DISTANCE.split(',')
                    let range2 = []

                    let min = range[0]
                    let max = range[1]


                    range2.push(Number(min))
                    range2.push(Number(max))

                    console.log(range2);
                    setCodigoBarras(range2)

                    onOpen()
                }
                } />

            <Modal
                closeOnOverlayClick={false}
                closeOnEsc={false}
                isOpen={isOpen}
                onClose={() => {
                    setUpdate(true)
                    onClose()
                }}
            >
                <ModalOverlay />
                <ModalContent maxW={{ base: "95%", md: "40%" }}>
                    <ModalHeader>CONFIGURACIÓN CÓDIGO DE BARRAS</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>

                        <Formik
                            /* enableReinitialize={true} */
                            initialValues={initialValue}
                            /* validationSchema={validate} */
                            onSubmit={
                                async (values: any) => {

                                    setlength(values.CDC_LENGTH)
                                    console.log(values);

                                    // console.log({ 'PER_ID': values.PER_ID, 'PER_PLATE': values.PER_PLATE, 'PER_LICENSE': values.PER_LICENSE })
                                }}
                        >
                            <Form>
                                <Grid
                                    h="auto"
                                    templateColumns={{ base: "repeat(1, 100%)", sm: "repeat(2, 70% 20%)" }} gap={'30px'}
                                    w="full"
                                >
                                    <MyContain>

                                        <MyTextInput
                                            id='input'
                                            label="Longitud de Código de Barras: "
                                            name="CDC_LENGTH"
                                            placeholder="Tamaño de Código de Barras ..."
                                            type='number'
                                            disabled={update}
                                        />
                                    </MyContain>
                                    {
                                        data.CDC_ID === 1 ?
                                            <Box display={'grid'} alignContent={'center'} alignSelf={'center'} verticalAlign={'center'}>
                                                <Button aria-label="aasd" leftIcon={<FiEdit />} type='submit'
                                                    onClick={() => {
                                                        setUpdate(!update)
                                                    }}>
                                                    {update ? 'Editar' : 'Guardar'}
                                                </Button>
                                            </Box>
                                            :
                                            <></>
                                    }



                                </Grid>


                            </Form>
                        </Formik>

                        <Grid
                            h="auto"
                            templateColumns={{ base: "repeat(1, 100%)" }} gap={'30px'}
                            w="full"
                        >
                            <MyContain>
                                {
                                    data.CDC_ID !== 1 && complete[0].CDC_DISTANCE.split(',')[0] == '0' && complete[0].CDC_DISTANCE.split(',')[1] == complete[0].CDC_LENGTH
                                        ?
                                        <>
                                            <Alert status='warning'>
                                                <AlertIcon />
                                                La lectura de todo el código de barra esta activada.
                                            </Alert>
                                        </>
                                        :
                                        <>
                                            <Checkbox
                                                defaultChecked={false}
                                                onChange={
                                                    async (e) => {
                                                        console.log();
                                                        if (e.target.checked) {
                                                            setCodigoBarras([0, length])
                                                        }
                                                    }
                                                }
                                            >
                                                Usar Todo el Código de Barras
                                            </Checkbox>
                                            <Box display={'flex'} flexDirection={'row'} justifyContent={'space-around'}>
                                                <Box marginTop={'40px'} width={'90%'} display={'grid'} alignContent='center' alignItems={'center'}>
                                                    {/* <MyReactTable  /> */}
                                                    <MyContain>
                                                        <Text> CODIGO CODE BAR: </Text>

                                                        <RangeSlider
                                                            marginTop={'50px'}
                                                            justifyContent={'space-around'}
                                                            width={'90%'}
                                                            aria-label={['min', 'max']}
                                                            value={codigoBarras}
                                                            min={0}
                                                            max={length}
                                                            step={1}>
                                                            {/* <RangeSliderMark value={10} mt='1' ml='-2.5' fontSize='sm'>
                                                                75%
                                                            </RangeSliderMark> */}
                                                            <RangeSliderTrack>
                                                                <RangeSliderFilledTrack />
                                                            </RangeSliderTrack>
                                                            <RangeSliderThumb index={0} />
                                                            <RangeSliderThumb index={1} />
                                                        </RangeSlider>


                                                        <Flex marginTop={"15px"} justifyContent={"space-between"}>
                                                            <NumberInput
                                                                size='sm'
                                                                maxW={20}
                                                                value={codigoBarras[0]}
                                                                min={0}
                                                                max={codigoBarras[1]}
                                                                onChange={(e) => {
                                                                    console.log(e);
                                                                    setCodigoBarras((old: any) => {
                                                                        return [Number(e), old[1]]
                                                                    })
                                                                    // setCodigoBarrasInitial(Number(e))
                                                                }}
                                                            >
                                                                <NumberInputField />
                                                                <NumberInputStepper>
                                                                    <NumberIncrementStepper />
                                                                    <NumberDecrementStepper />
                                                                </NumberInputStepper>
                                                            </NumberInput>
                                                            <NumberInput
                                                                size='sm'
                                                                maxW={20}
                                                                min={codigoBarras[0]}
                                                                max={length}
                                                                value={codigoBarras[1]}
                                                                onChange={(e) => {
                                                                    console.log(e);
                                                                    setCodigoBarras((old: any) => {
                                                                        return [old[0], Number(e)]
                                                                    })
                                                                    // setCodigoBarrasInitial(Number(e))
                                                                }}
                                                            >
                                                                <NumberInputField />
                                                                <NumberInputStepper>
                                                                    <NumberIncrementStepper />
                                                                    <NumberDecrementStepper />
                                                                </NumberInputStepper>
                                                            </NumberInput>
                                                            {/*  <Input
                                            type={"number"}
                                            onKeyUp={(e) => {
                                                //@ts-ignore
                                                setCodigoBarrasInitial(e.target.value)
                                            }}
                                        //value={codigoBarrasInitial}
                                        />
                                        <Input /> */}
                                                        </Flex>
                                                    </MyContain>
                                                </Box>
                                            </Box>
                                        </>
                                }

                            </MyContain>

                        </Grid>
                    </ModalBody>


                    <ModalFooter>
                        <Button
                            // isLoading={isLoading}
                            // isDisabled={isLoading}
                            colorScheme="green"
                            mr={3}
                            onClick={async () => {
                                let enviar = {
                                    CDC_ID: data.CDC_ID,
                                    CDC_DISTANCE: '',
                                    CDC_LENGTH: 0,
                                }

                                let min = codigoBarras[0]
                                let max = codigoBarras[1]
                                let tamanio = length

                                enviar.CDC_DISTANCE = `${min},${max}`
                                enviar.CDC_LENGTH = tamanio

                                console.log(enviar);
                                await mutateAsync(enviar)
                                if (data.CDC_ID === 1) {
                                    await mutateAsyncOhters(enviar)
                                }
                                queryClient.invalidateQueries('codebar')
                                onClose()
                            }}
                        >
                            Guardar
                        </Button>
                        <Button onClick={() => {
                            setUpdate(true)
                            onClose()
                        }}>Cancelar</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}