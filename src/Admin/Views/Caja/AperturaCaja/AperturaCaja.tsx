import { Alert, AlertIcon, Badge, Box, Button, Flex, Grid, GridItem, IconButton, Input, Link, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Stack, Text, Tooltip, useDisclosure, useToast } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { AiOutlineEye } from "react-icons/ai";
import { BiLockOpen } from "react-icons/bi";
import { IoLockClosedSharp } from "react-icons/io5";
import { RiErrorWarningLine } from "react-icons/ri";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useRecoilState } from "recoil";
import { AdminState } from "../../../../Data/Atoms/Admin";
import { MyTextInput } from "../../../../GlobalUI/Forms/MyInputs";
import { MyReactTable } from "../../../../GlobalUI/Table/MyReactTable";
import { aperturarCajaDay, CloseCash, getCaja, getCajaByUserID, getSalesForCash, getUltimoCashByUserID } from "../../../../Service/CashService";
import { getConfigTienda } from "../../../../Service/ConfigAdminService";
import { ListMetodoPago } from "../../../../Service/MetodoPagoService";
import { MyContain } from "../../../UI/Components/MyContain";
import { TableCharge } from "../../../UI/Components/TableCharge/tablecharge";
import { CierreCaja } from "./CierreCaja";
import { SalidaCaja } from "./SalidaCaja";
import { VentasCaja } from "./VentasCaja";

export const AperturaCaja = () => {

    const { data: company, isLoading: loadingCompány, isFetching: fetchingCompany } = useQuery("OpenCash", getConfigTienda, { refetchOnWindowFocus: false })
    // const { data, isError, isLoading, error, isFetching } = useQuery('caja', getCaja,
    //     { refetchOnWindowFocus: false })

    const { isOpen, onClose, onOpen } = useDisclosure()

    const { isOpen: isOpenCierre, onClose: onCloseCierre, onOpen: onOpenCierre } = useDisclosure()
    const [open, setOpen] = useState(false)

    const [admin, setAdmin] = useRecoilState(AdminState);
    // const { data: dataUltUser, isError: isErrorUserUlt, isFetching: fetchingUltUser, isLoading: loadingUltUser, refetch: refetchUltUser, error: errorULltUser } =
    //     useQuery(['ult', admin.iu], () => getUltimoCashByUserID(admin.iu), { refetchOnWindowFocus: false })
    const { data, isError, isFetching, isLoading, refetch, error } = useQuery(['caja', admin.iu], () => getCajaByUserID(admin.iu), { refetchOnWindowFocus: false })


    const { mutateAsync, data: dataCreate, isError: isErrorCreate, isLoading: loadingCreate } = useMutation(aperturarCajaDay)

    const [modal, setModal] = useState(false)
    const [moodcaja, setModcaja] = useState('')
    const [actualDate, setActualdate] = useState('')

    const [objUltimo, setObjUltimo] = useState<any>([])

    const queryClient = useQueryClient()

    const toast = useToast()
    useEffect(() => {
        //@ts-ignore
        document.getElementById('title_view').textContent = 'Apertura Caja';

        console.log('ID DEL USUARIO', admin.iu);

        let ObjUltApertura = data && !data.message ? data[data.length - 1] : []
        setObjUltimo(ObjUltApertura)

        let dateUltimaAperura = data && !data.message ? data[data.length - 1].CJA_DATE_OPNING : null
        let fecha = new Date()
        let dia = fecha.getDate()
        let mes = fecha.getMonth() + 1
        let anio = fecha.getFullYear()
        let fechaActual = anio + '-' + (mes < 10 ? '0' + mes : mes) + '-' + (dia < 10 ? '0' + dia : dia)
        setActualdate(fecha.toLocaleDateString())
        console.log(dateUltimaAperura);

        if (company && !company.message) {
            if (company && company[0].COM_OPEN_CASH == '1') {

                if (data && !data.message) {
                    if (dateUltimaAperura !== null) {
                        // if (ObjUltApertura.CJA_CLOSING_AMOUNT != '' && ObjUltApertura.CJA_ARCHING_AMOUNT != null && ObjUltApertura.CJA_STATUS == '2') {
                        if ( ObjUltApertura.CJA_STATUS == '2') {
                            console.log("LA CAJA DEL DIA ANTERIOR ESTA CERRADA ");

                            if (dateUltimaAperura == fechaActual) {
                                //// aqui se validara si el campo monto de apertura es diferente que o, si lo es
                                // no debe de mostrar el modal, pero si es igual a 0 entonces muestra el modal
                                setModal(false)
                            } else if (dateUltimaAperura != fechaActual) {
                                // procedemos a ejecutar el servicio de crecaión de caja con el dia de hoy, pero con el monto que se guardara en el input
                                setModal(true)
                                console.log('se abre porque no se aperturó caja');
                            }
                        } else {
                            console.log("LA CAJA DEL DIA ANTERIOR NO ESTA CERRADA, DEBE DE MOSTRAR EL MODAL PARA EL CIERRE DE CAJA DEL DIA ANTERIOR", ObjUltApertura);
                            if (dateUltimaAperura == fechaActual) {
                                //// aqui se validara si el campo monto de apertura es diferente que o, si lo es
                                // no debe de mostrar el modal, pero si es igual a 0 entonces muestra el modal
                                setModal(false)
                            } else if (dateUltimaAperura != fechaActual) {
                                // procedemos a ejecutar el servicio de crecaión de caja con el dia de hoy, pero con el monto que se guardara en el input
                                console.log('se abre porque no se aperturó caja', modal);
                                setOpen(true)
                            }
                        }
                    } else {
                        setModal(true)
                        console.log('se abre porque no hay registros anteriores');
                    }

                }
            }
        }


        /// aqui validemos si el monto de apertura de caja es 0
    }, [data, company])


    // window.onload = function abrirModal(){
    //     setTimeout(() => 
    //         setModal(true), fecha());
    // }


    // function fecha() {
    //     let horaActual = new Date()
    //     let horaProgramada = new Date()
    //     horaProgramada.setHours(10)
    //     horaProgramada.setMinutes(57)
    //     horaProgramada.setSeconds(0)
    //     return horaProgramada.getTime() - horaActual.getTime()
    // }
    return (
        <>
            {/* MODAL QUE SE EJECUTARA PARA APERTURA DE CAJA */}
            <Modal onClose={onClose} isOpen={modal} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>APERTURA DE CAJA - {actualDate}</ModalHeader>
                    <Link href="/admin/ventas/listar-venta">
                        <ModalCloseButton />
                    </Link>
                    <ModalBody>
                        <Formik
                            /* enableReinitialize={true} */
                            initialValues={{ monto_apertura: '' }}
                            /* validationSchema={validate} */
                            onSubmit={
                                async (values: any) => {
                                    console.log(values);
                                    let fecha = new Date()
                                    let dia = fecha.getDate()
                                    let mes = fecha.getMonth() + 1
                                    let anio = fecha.getFullYear()
                                    let fechaActual = anio + '-' + (mes < 10 ? '0' + mes : mes) + '-' + (dia < 10 ? '0' + dia : dia)
                                    // console.log({
                                    //             POS_ID: 1,
                                    //             CJA_OPNING_AMOUNT: values.monto_apertura,
                                    //             CJA_CLOSING_AMOUNT: 0,
                                    //             CJA_ARCHING: '0',
                                    //             CJA_STATUS: '1',
                                    //             CJA_DATE_OPNING: fechaActual,
                                    //             CJA_DATE_CLOSING: '',
                                    //             USR_ID: admin.iu,
                                    //          });                                    

                                    if (values.monto_apertura != '' && Number(values.monto_apertura) >= 0) {
                                        await mutateAsync(
                                            {
                                                POS_ID: 1,
                                                CJA_OPNING_AMOUNT: values.monto_apertura,
                                                CJA_CLOSING_AMOUNT: '',
                                                CJA_ARCHING: '0',
                                                CJA_STATUS: '1',
                                                CJA_DATE_OPNING: fechaActual,
                                                CJA_DATE_CLOSING: '',
                                                USR_ID: admin.iu,
                                            }
                                        )
                                        queryClient.invalidateQueries("caja")
                                        onClose()
                                    } else {
                                        toast({
                                            title: 'Ocurrió un error',
                                            description: "El Monto de apertura no puede estar en blanco o ser negativo...",
                                            status: 'error',
                                            duration: 5000,
                                            variant: 'left-accent',
                                            isClosable: true,
                                        })
                                    }
                                }}
                        >
                            <Form>
                                <Flex flexDirection={'column'} gap={'10px'}>
                                    <Alert status='info' variant={'left-accent'}>
                                        <AlertIcon />
                                        Se tiene que iniciar caja para poder continuar ...
                                    </Alert>
                                    <MyTextInput label='Ingrese Monto para Aperturar Caja :' name="monto_apertura" placeholder='0' autocomplete="off" />
                                    <Button type={"submit"} leftIcon={<BiLockOpen />} colorScheme='whatsapp'>&nbsp;  APERTURAR CAJA</Button>
                                </Flex>
                            </Form>

                        </Formik>
                    </ModalBody>
                </ModalContent>
            </Modal>

            {/* MODAL DE CIERRE DE CAJA POR SI LA CAJA DEL DIA ANTERIOR NO FUE CERRADA */}


            <Modal onClose={onCloseCierre} isOpen={open} isCentered>
                <ModalOverlay />
                <ModalContent maxW={'50%'}>
                    <br />
                    <ModalHeader >
                        <Flex flexDirection={'row'} gap='20%'>

                            <Text style={{ 'fontWeight': 'bold', 'float': 'left' }}>
                                CIERRE DE CAJA / {objUltimo.CJA_DATE_OPNING}
                            </Text>
                            <Alert status='error' variant={'left-accent'} style={{ 'float': 'right', 'width': '40%' }}>
                                <Text fontWeight={'bold'}>
                                    Saldo Apertura Caja : S/. {objUltimo.CJA_OPNING_AMOUNT}
                                </Text>
                            </Alert>
                        </Flex>
                    </ModalHeader>
                    {/* <ModalCloseButton onClick={()=> setOpen(false)} /> */}
                    <ModalBody>
                        <ContenidoCierre cash={objUltimo} setOpen={setOpen} setModal={setModal} />
                    </ModalBody>
                    <ModalFooter>
                        {/* <Button onClick={() => setOpen(false)}>Close</Button> */}
                    </ModalFooter>
                </ModalContent>
            </Modal>


            <MyContain>
                <MyContain>
                    REGISTRO DE APERTURAS DE CAJA
                </MyContain>
                <br />
                <TableApertura data={data}
                    isError={isError}
                    isLoading={isLoading}
                    error={error}
                    isFetching={isFetching} />
            </MyContain>

        </>
    )
}

export const TableApertura = ({ data, isError, isLoading, error, isFetching }: {
    data: any, isError: any, isLoading: any, error: any, isFetching: any
}) => {
    const columns = [
        {
            Header: "N°",
            accessor: "CJA_ID",
            filter: "fuzzyText",
        },
        {
            Header: "FECHA DE APERTURA DE CAJA",
            accessor: "CJA_DATE_OPNING",
            filter: "fuzzyText",
        },
        {
            Header: "FECHA DE CIERRE DE CAJA",
            accessor: "CJA_DATE_CLOSING",
            filter: "fuzzyText",
        },
        {
            Header: "MONTO DE APERUTRA DE CAJA",
            accessor: "CJA_OPNING_AMOUNT",
            filter: "fuzzyText",
        },
        {
            Header: "MONTO DE CIERRE DE CAJA",
            accessor: "CJA_CLOSING_AMOUNT",
            filter: "fuzzyText",
        },
        {
            Header: "ARQUÉO DE CAJA",
            accessor: "CJA_ARCHING",
            filter: "fuzzyText",
        },
        {
            Header: "MONTO DIFERENCIA",
            accessor: "CJA_ARCHING_AMOUNT",
            filter: "fuzzyText",
        },
        {
            Header: "ESTADO DE CAJA",
            id: "actions2",

            // @ts-ignore
            Cell: ({ row }) => <ApprovalCell apr={row.original} />,
        },
        {
            Header: "Acciones",
            id: "actions",

            // @ts-ignore
            Cell: ({ row }) => <ActionCell ven={row.original} />,
        },
    ];

    // @ts-ignore
    if (isLoading || isFetching) return (<TableCharge />)

    // @ts-ignore
    if (isError) return <h1>{error.message} </h1>;

    if (data.message) return <h1>{data.message} </h1>;

    return (
        <>
            <MyReactTable
                columns={columns}
                data={data}
                isPaginated
                hasFilters />
        </>
    );
}
const ApprovalCell = ({ apr }: { apr?: any }) => {
    let theVerifiedIs = "";
    let colorVerified = "";
  
    
      switch (apr.CJA_STATUS) {
        case "1":
          theVerifiedIs = "CAJA APERTURADA";
          colorVerified = "green";
          break;
        default:
          theVerifiedIs = "CAJA CERRADA";
          colorVerified = "red";
          break;
      }
    
  
  
    return (
      <Stack direction={{ base: "column", md: "row" }}>
        <Badge noOfLines={2} colorScheme={colorVerified}>
          {theVerifiedIs}
        </Badge>
      </Stack>
    );
}

export const ActionCell = (obj: any) => {
    const toast = useToast()
    return (
        <>
            <Flex flexDirection={'row'} gap={'10px'} justifyContent={'center'} alignItems={'center'} >
                <SalidaCaja apertura={obj['ven']} />
                <CierreCaja obj={obj['ven']} />
                <VentasCaja obj={obj['ven']} />
                <IconButton color={'white'} paddingLeft={'11px'} aria-label="boton desactivado" fontSize={'lg'} icon={<RiErrorWarningLine />}  display={obj['ven'].CJA_STATUS == '2' ? 'block' : 'none'} backgroundColor='red.400' borderRadius='50%' onClick={() => {
                    toast({
                        title: 'CAJA CERRADA',
                        description: "La caja esta Cerrada, sirvase comunicar con soporte para alguna modificación ...",
                        status: 'warning',
                        duration: 5000,
                        isClosable: true,
                    })
                }} />
                    

            </Flex>
        </>
    );
}

export const ModalCierreCaja = ({ obj, setModal }: { obj: any, setModal: any }) => {
    const { isOpen, onClose, onOpen } = useDisclosure()
    const [open, setOpen] = useState(false)
    return (
        <>
            <Modal onClose={onClose} isOpen={open} isCentered>
                <ModalOverlay />
                <ModalContent maxW={'50%'}>
                    <br />
                    <ModalHeader >
                        <Flex flexDirection={'row'} gap='20%'>

                            <Text style={{ 'fontWeight': 'bold', 'float': 'left' }}>
                                CIERRE DE CAJA / {obj.CJA_DATE_OPNING}
                            </Text>
                            <Alert status='error' variant={'left-accent'} style={{ 'float': 'right', 'width': '40%' }}>
                                <Text fontWeight={'bold'}>
                                    Saldo Apertura Caja : S/. {obj.CJA_OPNING_AMOUNT}
                                </Text>
                            </Alert>
                        </Flex>
                    </ModalHeader>
                    <ModalCloseButton onClick={() => setOpen(false)} />
                    <ModalBody>
                        <ContenidoCierre cash={obj} setOpen={setOpen} setModal={setModal} />
                    </ModalBody>
                    <ModalFooter>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export const ContenidoCierre = ({ cash, setOpen, setModal }: { cash: any, setOpen: any, setModal?: any }) => {
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
                                setModal(true)
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
                        <Grid templateColumns={'repeat(2,1fr)'} gap={'10px'}>
                            <GridItem>
                                <label>Total Ventas en Efectivo : </label><br />
                                <Input aria-label="TOTAL VENDIDO ONLINE" value={efectivo} style={{ 'width': '50%' }} disabled />
                            </GridItem>
                            <GridItem>
                                <label>Total Ventas en Caja: </label>
                                <MyTextInput label="" style={{ 'width': '50%' }} name='fisico' placeholder={'Ingrese el monto ...'} onKeyUp={(e: any) => {
                                    calcular(e)
                                }} />
                            </GridItem>
                        </Grid>
                        <br />
                        <div style={{ 'width': '50%', 'margin': '0 auto' }}>
                            <Alert status={cuadre ? 'success' : 'warning'} variant={'left-accent'}>
                                <AlertIcon />
                                <Text fontWeight={'bold'}>
                                    Se generó una {cuadre ? 'ganancia' : 'perdida'} de S/.{diferencia}
                                </Text>
                            </Alert>
                        </div>
                        <Box display={'flex'} flexDirection='row' gap={'20%'} justifyContent='center' justifySelf={'center'}>
                            <Button type="submit">CERRAR CAJA</Button>
                            <Link href="/admin/ventas/listar-venta">
                                <Button>IR A LISTAR VENTA</Button>
                            </Link>
                        </Box>
                    </Form>
                </Formik>
            </MyContain>
        </>
    )
}