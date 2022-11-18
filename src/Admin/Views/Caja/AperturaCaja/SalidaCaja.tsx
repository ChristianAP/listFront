import { Alert, AlertIcon, Button, Grid, GridItem, IconButton, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, Text, Textarea, Tooltip, useDisclosure } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import React, { useState } from "react";
import { BsCheckAll } from "react-icons/bs";
import { FaCashRegister } from "react-icons/fa";
import { useMutation, useQueryClient } from "react-query";
import { MySelect, MyTextArea, MyTextInput } from "../../../../GlobalUI/Forms/MyInputs";
import { detalleCaja, updateMount } from "../../../../Service/CashDetailService";

export const SalidaCaja = ({ apertura }: { apertura: any }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()

    const [type, setType] = useState('')
    const [monto_total, setMontoTotal] = useState(Number(apertura.CJA_OPNING_AMOUNT))
    const {mutateAsync} = useMutation(detalleCaja)
    const {mutateAsync : modificarApertura} = useMutation(updateMount)
    const queryClient = useQueryClient()
    return (
        <>
            <Tooltip label='Entrada/Salida de dinero'>
                <IconButton disabled={apertura.CJA_STATUS == '2'} aria-label="Entrada / salida de dinero" icon={<FaCashRegister />} onClick={onOpen} />
            </Tooltip>

            <Modal onClose={onClose} isOpen={isOpen} isCentered>
                <ModalOverlay />
                <ModalContent maxW={{base:"90%",md:"40%"}}>
                    <ModalHeader>SALIDA/ENTRADA DE DINERO: </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Formik
                            initialValues={{}}
                            // validationSchema={validate}
                            onSubmit={async (values: any) => {
                                // console.log(values);
                                let caja_detail = {
                                    CJA_ID: apertura.CJA_ID,
                                    DCJ_DESCRIPTION: values.DCJ_DESCRIPTION,
                                    DCJ_TYPE: type,
                                    DCJ_AMOUNT: values.DCJ_AMOUNT,
                                    DCJ_USER: apertura.USR_ID,
                                    DCJ_STATUS: '1'
                                }
                                console.log('esto se va a enviar ...',caja_detail);
                                // insertar en la tabla sv_cash_detail
                                await mutateAsync(caja_detail)

                                // actualizar el monto de aperutra 
                                await modificarApertura({CJA_ID : apertura.CJA_ID, USR_ID : apertura.USR_ID, CJA_OPNING_AMOUNT : monto_total})
                                await queryClient.invalidateQueries('caja')
                            }}
                        >
                            <Form>
                                <Grid gridTemplateColumns={'repeat(2,1fr)'} gap='10px'>
                                    <GridItem gridColumn={'1/-1'}>
                                        <MySelect label='ACCIÖN : ' name='DCJ_TYPE' placeholder='Seleccione la Acción a Realizar' onChange={(e: any) => {
                                            let change = e.target.value
                                            setType(change)
                                        }}>
                                            <option value="ENTRADA">Entrada de Dinero</option>
                                            <option value="SALIDA">Salida de Dinero</option>
                                        </MySelect>
                                    </GridItem>
                                    {
                                        type !== '' ?
                                            <>
                                                <GridItem alignSelf={'center'}>
                                                    <Text > INGRESE EL MONTO DE {type} DE DINERO: </Text>
                                                </GridItem>

                                                <GridItem>
                                                    <MyTextInput label={``} name='DCJ_AMOUNT' placeholder='100' autocomplete='off' onKeyUp={(e: any) => {
                                                        let monto = e.target.value
                                                        let sum = type == 'ENTRADA' ? Number(apertura.CJA_OPNING_AMOUNT) + Number(monto) : Number(apertura.CJA_OPNING_AMOUNT) - Number(monto) 
                                                        setMontoTotal(sum)
                                                    }} />
                                                </GridItem>
                                                <GridItem gridColumn={'1/-1'}>
                                                    <Alert status='info' variant={'left-accent'} w='80%' display='flex' margin={'0 auto'}>
                                                        {/* <SiCashapp /> */}
                                                        <Text fontWeight={'bold'} margin='0 auto'>
                                                            MONTO TOTAL DE CAJA DE APERTURA:&nbsp; &nbsp; S/.{monto_total}
                                                        </Text>
                                                    </Alert>
                                                </GridItem>
                                                <GridItem gridColumn={'1/-1'}>
                                                    <MyTextArea label={`Ingrese el motivo de la ${type.toLowerCase()} del dinero: `} name='DCJ_DESCRIPTION' placeholder={'Ingrese el motivo...'} />
                                                </GridItem>
                                                <GridItem gridColumn={'1/-1'} display='flex' alignContent={'center'}>
                                                    <Button type='submit' colorScheme={'messenger'} leftIcon={<BsCheckAll />} w='40%'>
                                                        CONFIRMAR
                                                    </Button>
                                                </GridItem>
                                            </>
                                            :
                                            <></>

                                    }
                                </Grid>

                            </Form>
                        </Formik>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={onClose}>Close</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}