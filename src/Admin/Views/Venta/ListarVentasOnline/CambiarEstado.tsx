import { Box, Flex, Text, Icon, AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter, Button, IconButton, useToast } from '@chakra-ui/react'
import React, { useRef, useState } from 'react'
import { BsFillInboxFill, BsPersonCheckFill } from 'react-icons/bs'
import { FaCashRegister, FaTruck } from 'react-icons/fa'
import { FcNext, FcPrevious } from 'react-icons/fc'
import { useQuery } from 'react-query'
import { IEstados } from '../../../../Model/Order'
import { getOrdenSteps } from '../../../../Service/OrderSteps'
import './assets/css/CambiarEstado.css'

export const CambiarEstado = ({ sale, isLoading, mutateM, aprobacion }: { sale: any, isLoading: any, mutateM: any, aprobacion: any }) => {

    const [isOpen, setIsOpen] = useState(false)
    const cancelRef = useRef()
    const toast = useToast()

    const { data: dataSteps, isLoading: loadingSteps, isFetching, isFetched } = useQuery('pasosOnline', getOrdenSteps, { refetchOnWindowFocus: false })

    var dato = 0;
    const onClose = () => setIsOpen(false)

    const estados: IEstados[] = [{
        idestado: 1,
        valor: FaCashRegister,
        nombre: "Pedido Registrado"
    }, {
        idestado: 2,
        valor: BsPersonCheckFill,
        nombre: "Pedido Confirmado"
    }, {
        idestado: 3,
        valor: FaTruck,
        nombre: "Pedido en Proceso"
    }, {
        idestado: 4,
        valor: BsFillInboxFill,
        nombre: "Pedido Entregado"
    }]

    function HandlesState(state: number, direccion: boolean) {
        if (aprobacion == "1") {
            //estadoGlobal(dato)
            dato = state
            if (direccion && state === 3) {
                setIsOpen(true)
            }
            else if (!direccion && state === 2) {
                toast({
                    title: `Accion no permitida`,
                    description: `No se puede regresar a este paso`,
                    status: "warning",
                    duration: 1500,
                    isClosable: true,
                })
            } 
            else if (!direccion && state === 1) {
                toast({
                    title: `Accion no permitida`,
                    description: `No se puede regresar a este paso`,
                    status: "warning",
                    duration: 1500,
                    isClosable: true,
                })
            } 
            else {
                mutateM(dato, sale.PEDIDO, (sale.CLIENTE.trim()).length > 0 ? sale.CLIENTE : sale.TRADENAME, sale.EMAIL)
                sale.ESTADO = dato
            }
        } else {
            toast({
                title: `Accion no permitida`,
                description: `Necesita confirmar el voucher`,
                status: "warning",
                duration: 1500,
                isClosable: true,
            })
        }
    }
    function updateSate() {
        mutateM(3, sale.PEDIDO)
        sale.ESTADO = 3
        setIsOpen(false)
    }

    return (
        <>
            <AlertDialog
                isOpen={isOpen}
                //@ts-ignore
                leastDestructiveRef={cancelRef}
                onClose={onClose}
                closeOnOverlayClick={false}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            CAMBIAR ESTADO DE PEDIDO
                        </AlertDialogHeader>
                        <AlertDialogBody>
                            Provocará que ya no pueda regresar el estado del pedido
                            ¿Está seguro? No podrá deshacer esta acción después.
                        </AlertDialogBody>
                        <AlertDialogFooter>
                            <Button
                                // @ts-ignore
                                ref={cancelRef}
                                onClick={onClose}
                            >
                                Cancelar
                            </Button>
                            <Button
                                colorScheme="red"
                                ml={3}
                                onClick={updateSate}
                            >
                                Confirmar
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
            {!isLoading && dataSteps ?
                <>
                    <Flex gridGap="5" my="5" >

                        {/* {estados.map((val, idx) => {
                            return <>
                                <input key={`input_radio_${idx}`} defaultChecked={val.idestado == sale.ESTADO} disabled className="input_radio" type="radio" id={val.idestado + "status"} name="type_status" />
                                <label key={`label_radio_${idx}`} className="label_radio" htmlFor={val.idestado + "status"}>
                                    <Box key={`box_a_${idx}`} my="5">
                                        <Box key={`box_b_${idx}`} fontSize={{ base: "15px", md: "20px" }}><Icon as={val.valor} /></Box>
                                        <Text key={`text_${idx}`} fontSize={{ base: "5px", md: "10px" }}>{val.nombre}</Text>
                                    </Box>
                                </label>

                            </>
                        })}  */}

                        {dataSteps && dataSteps.map((val: any) => {
                            return <>
                                <input key={`input_radio_${val.ORS_ID}`} defaultChecked={val.ORS_ID == sale.ESTADO} disabled className="input_radio" type="radio" id={val.ORS_ID + "status"} name="type_status" />
                                <label key={`label_radio_${val.ORS_ID}`} className="label_radio" htmlFor={val.ORS_ID + "status"}>
                                    <Box key={`box_a_${val.ORS_ID}`} my="5">
                                        <Box key={`box_b_${val.ORS_ID}`} fontSize={{ base: "15px", md: "20px" }}><Icon as={estados[(val.ORS_ID) - 1].valor} /></Box>
                                        <Text key={`text_${val.ORS_ID}`} fontSize={{ base: "5px", md: "10px" }}>{val.ORS_NAME}</Text>
                                    </Box>
                                </label>

                            </>
                        })}
                    </Flex>
                    <Flex justifyContent={"space-between"}>
                        <IconButton disabled={sale.ESTADO == 1} onClick={() => {
                            let posi = 0
                            // @ts-ignore
                            dataSteps && dataSteps.map((e, index) => {
                                if (sale.ESTADO !== 1 && e.ORS_ID == sale.ESTADO) {
                                    posi = index
                                    console.log(posi)
                                }
                            })
                            HandlesState(Number(dataSteps && dataSteps[posi - 1].ORS_ID), false)
                        }} aria-label='Prev' icon={<FcPrevious />} />
                        <IconButton disabled={sale.ESTADO == 4} onClick={() => {
                            let posi = 0
                            // @ts-ignore
                            dataSteps && dataSteps.map((e, index) => {
                                if (sale.ESTADO !== 4 && e.ORS_ID == sale.ESTADO) {
                                    posi = index
                                    console.log(posi)
                                }
                            })
                            // HandlesState(Number(sale.ESTADO) + 1, true)
                            HandlesState(Number(dataSteps && dataSteps[posi + 1].ORS_ID), true)
                        }} aria-label='Next' icon={<FcNext />} />

                        {/* <IconButton disabled={sale.ESTADO == 1} onClick={() => { HandlesState(sale.ESTADO - 1, false) }} aria-label='Prev' icon={<FcPrevious />} />
                        <IconButton disabled={sale.ESTADO == 4} onClick={() => { HandlesState(Number(sale.ESTADO) + 1, true) }} aria-label='Next' icon={<FcNext />} /> */}

                        {/* PARA HABILITAR LOS PASOS DESACTIVADOS LÑO QUE TENDRIAMOS QUE HACER ES VALIDAR EN EL AVANZAR PASO ... APARTIR DEL sal.ESTADO verificar en la data q me trae
                        los pasos activos ,VERIFICAR LA POSICION SIGUIENTE PARA OBTENER EL ID DEL ESTADO SIGUIENTE, Y PARA EL RETROCEDER, HACER LO MISMO PERO AL REVES */}

                        {/* <IconButton disabled={sale.ESTADO == 1} onClick={() => {
                            console.log("lo que me trae de la otra vista ... PREV", sale.ESTADO);
                            // const nro = dataSteps.find((e: any) => e.ORS_ID == (Number(sale.ESTADO) - 1)).ORS_ID

                        // HandlesState(dataSteps[sale.ESTADO - 1].ORS_ID - 1, false).

                        }} aria-label='Prev' icon={<FcPrevious />} />
                        <IconButton disabled={dataSteps[dataSteps.length - 1].ORS_ID === sale.ESTADO} onClick={() => {
                            console.log("lo que me trae de la otra vista ... POS", sale.ESTADO);
                            // const nro = dataSteps.find((e: any) => e.ORS_ID == sale.ESTADO)
                            // HandlesState(Number(dataSteps[sale.ESTADO - 1].ORS_ID) + 1, true)
                        }} aria-label='Next' icon={<FcNext />} /> */}
                    </Flex>
                </>
                :
                <></>
            }


        </>
    )
}