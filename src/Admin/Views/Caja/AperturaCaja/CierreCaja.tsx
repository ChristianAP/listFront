import { Alert, AlertIcon, Box, Button, Flex, Grid, GridItem, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, Tooltip, useDisclosure, useToast } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { IoLockClosedSharp } from "react-icons/io5";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { array } from "yup/lib/locale";
import { MetodoPago } from "../../../../Client/Private";
import { MyTextInput } from "../../../../GlobalUI/Forms/MyInputs";
import { CloseCash, getSalesForCash } from "../../../../Service/CashService";
import { ListMetodoPago } from "../../../../Service/MetodoPagoService";
import { MyContain } from "../../../UI/Components/MyContain";

export const CierreCaja = ({ obj }: { obj: any }) => {
    const { isOpen, onClose, onOpen } = useDisclosure()
    const [open, setOpen] = useState(false)
    return (
        <>
            <Modal onClose={onClose} isOpen={open} isCentered>
                <ModalOverlay />
                <ModalContent maxW={{ base: "90%", md: "50%" }}>
                    <br />
                    <ModalHeader >
                        <Flex flexDirection={{ base: "column", md: "row" }} gap={{ base: "10px", md: "20%" }}>

                            <Text style={{ 'fontWeight': 'bold', 'float': 'left' }}>
                                CIERRE DE CAJA / {obj.CJA_DATE_OPNING}
                            </Text>
                            <Alert status='error' variant={'left-accent'} style={{ 'float': 'right' }} width={{ base: "100%", md: "40%" }}>
                                <Text fontWeight={'bold'}>
                                    Saldo Apertura Caja : S/. {obj.CJA_OPNING_AMOUNT}
                                </Text>
                            </Alert>
                        </Flex>
                    </ModalHeader>
                    <ModalCloseButton onClick={() => setOpen(false)} />
                    <ModalBody>
                        <ContentModal cash={obj} setOpen={setOpen} />
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={() => setOpen(false)}>Close</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>


            <Tooltip label='Cerrar Caja'>
                <IconButton disabled={obj.CJA_STATUS == '2'} colorScheme={'red'} aria-label={'cerrar caja'} icon={<IoLockClosedSharp />} onClick={() => { setOpen(true) }} />
            </Tooltip>
        </>
    )
}

export const ContentModal = ({ cash, setOpen }: { cash: any, setOpen: any }) => {
    const { data, isError, error, isFetched, isFetching, isLoading } = useQuery(['SaleOfCash', cash], () => getSalesForCash(cash), { refetchOnWindowFocus: false })
    const { data: listMetodoPago, error: errorMetodoPago, isLoading: loadingMetodoPago } = useQuery('metodo_pago', ListMetodoPago, { refetchOnWindowFocus: false })
    const [totalOnline, setTotalOnline] = useState(0)
    const [efectivo, setEfectivo] = useState(0)

    const [cuadre, setCuadre] = useState(true)
    const [diferencia, setFiferencia] = useState(cash.CJA_OPNING_AMOUNT)

    const { mutateAsync } = useMutation(CloseCash)

    const toast = useToast()

    const queryClient = useQueryClient()

    console.log(data);

    useEffect(() => {
        let suma = 0
        let efectivo = 0
        if (data && !data.message && listMetodoPago && !listMetodoPago.message) {
            data.map((e: any) => {
                let type = listMetodoPago.find((element: any) => element.MPG_NAME == e.DOC_METODO_PAGO).MPG_TYPE
                console.log('ESTE ES EL TIPO ...', type);
                if (e.SLT_ID === 5) {
                    suma += e.DOC_NETO
                    if (type == '1') {
                        efectivo += e.DOC_NETO
                    }
                }
            })
        }

        setEfectivo(efectivo)
        setTotalOnline(suma)

    }, [data, listMetodoPago])



    function calcular(event: any) {
        let dif = Number(event.target.value)
        let apertura_caja = Number(cash.CJA_OPNING_AMOUNT) + Number(efectivo)
        let total = dif - apertura_caja
        if (total >= 0) {
            setCuadre(true)
            setFiferencia((total))
        } else {
            setCuadre(false)
            setFiferencia((total))

        }

        console.log(dif);

    }

    const valuesInitial = {
        fisico: ''
    }
    return (
        <>
            <MyContain>
                <Formik
                    /* enableReinitialize={true} */
                    initialValues={valuesInitial}
                    /* validationSchema={validate} */
                    onSubmit={
                        async (values: any) => {
                            console.log(values.fisico)
                            let fecha = new Date()
                            let dia = fecha.getDate()
                            let mes = fecha.getMonth() + 1
                            let anio = fecha.getFullYear()
                            let fechaActual = anio + '-' + (mes < 10 ? '0' + mes : mes) + '-' + (dia < 10 ? '0' + dia : dia)

                            if (values.fisico != '' && Number(values.fisico) >= 0) {
                                await mutateAsync(
                                    {
                                        CJA_ID: cash.CJA_ID,
                                        CJA_CLOSING_AMOUNT: values.fisico,
                                        CJA_ARCHING: diferencia > 0 ? 2 : diferencia < 0 ? 0 : 1,
                                        CJA_ARCHING_AMOUNT: Math.abs(diferencia).toFixed(2),
                                        CJA_STATUS: 2,
                                        CJA_DATE_CLOSING: fechaActual,
                                    }
                                )
                                queryClient.invalidateQueries("caja")
                                setOpen(false)
                            } else {
                                toast({
                                    title: 'Ocurrió un error',
                                    description: "El Monto de Cierre no puede estar en blanco o ser negativo...",
                                    status: 'error',
                                    duration: 5000,
                                    variant: 'left-accent',
                                    isClosable: true,
                                })
                            }
                        }}
                >
                    <Form>
                        <Alert status='info' variant={'left-accent'}>
                            <AlertIcon />
                            <Text fontWeight={'bold'}>
                                Hoy {cash.CJA_DATE_OPNING} se realizaron {data && !data.message ? data.length : 0} ventas con un total de S/. {totalOnline}
                            </Text>
                        </Alert>
                        <br />
                        <Text style={{ 'fontSize': '17px' }}>MONTO ACUMULADO DEL DIA (ONLINE / FÍSICO) : </Text>
                        <br />
                        <Grid templateColumns={{ base: "repeat(1,1fr)", md: "repeat(2,1fr)" }} gap={'10px'}>
                            <GridItem>
                                <label>Total Ventas en Efectivo : </label><br />
                                <Input aria-label="TOTAL VENDIDO ONLINE" value={efectivo} disabled />
                            </GridItem>
                            <GridItem>
                                <label>Total Ventas Físico : </label>
                                <MyTextInput label="" name='fisico' placeholder={'Ingrese el monto ...'} onKeyUp={(e: any) => {
                                    calcular(e)
                                }} />
                            </GridItem>
                        </Grid>
                        <br />
                        <Box width={{ base: "100%", md: "50%" }} style={{ 'margin': '0 auto' }}>
                            <Alert status={cuadre ? 'success' : 'warning'} variant={'left-accent'}>
                                <AlertIcon />
                                <Text fontWeight={'bold'}>
                                    Se generó una {cuadre ? 'ganancia' : 'perdida'} de S/.{diferencia}
                                </Text>
                            </Alert>
                        </Box>

                        <Button type="submit">CERRAR CAJA</Button>
                    </Form>
                </Formik>
            </MyContain>
        </>
    )
}