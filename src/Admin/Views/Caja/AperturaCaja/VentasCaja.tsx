import { Alert, AlertIcon, Button, Flex, IconButton, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Skeleton, Text, Tooltip, useDisclosure } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { AiOutlineEye } from "react-icons/ai";
import { IoLockClosedSharp } from "react-icons/io5";
import { useQuery } from "react-query";
import { MyReactTable } from "../../../../GlobalUI/Table/MyReactTable";
import { getSalesForCash } from "../../../../Service/CashService";
import { MyContain } from "../../../UI/Components/MyContain";
import { TableCharge } from "../../../UI/Components/TableCharge/tablecharge";

export const VentasCaja = ({ obj }: { obj: any }) => {

    const { isOpen, onClose, onOpen } = useDisclosure()


    return (
        <>

            <Tooltip label='Visualizar Ventas de Caja'>
                <IconButton onClick={onOpen} aria-label="visualizar ventas" colorScheme={'twitter'} icon={<AiOutlineEye />}></IconButton>
            </Tooltip>

            <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent maxW={'80%'}>
                    <ModalHeader>
                        <br />
                        <Alert status='info' variant={"left-accent"}>
                            {/* <AlertIcon /> */}
                            VENTAS EN CAJA PARA EL {obj.CJA_DATE_OPNING}
                        </Alert>
                        <ModalCloseButton />
                    </ModalHeader>
                    <ModalBody pb={6}>
                    </ModalBody>
                    <TableCashSale obj={obj} />
                    <ModalFooter>
                        <Button onClick={onClose}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export const TableCashSale = ({ obj }: { obj: any }) => {
    const { data, isError, error, isFetched, isFetching, isLoading } = useQuery(['SaleOfCash', obj], () => getSalesForCash(obj), { refetchOnWindowFocus: false })

    const [total, setTotal] = useState(0)
    
    useEffect(() => {
        console.log('ESTA ES LA DATITA P ...', data);
        let suma = 0
        if (data && !data.message) {
            data && data.map((e: any) => {
                suma += e.DOC_NETO
            })
        }else{
            suma = 0
        }
        
        setTotal(suma)
        
    }, [data])

    const columns = [
        {
            Header: "DNI/RUC",
            accessor: "DOC_ID_CLIENT",
            filter: "fuzzyText",
        },
        {
            Header: "NOMBRE COMERCIAL",
            accessor: "DOC_BUSINESS_NAME",
            filter: "fuzzyText",
        },
        {
            Header: "DIRECCIÓN COMERCIAL",
            accessor: "DOC_DIRECTION_CLIENT",
            filter: "fuzzyText",
        },
        {
            Header: "NRO DE COMPROBANTE",
            accessor: "NRO_COMPROBANTE",
            filter: "fuzzyText",
        },
        {
            Header: "MÉTODO DE PAGO",
            accessor: "DOC_METODO_PAGO",
            filter: "fuzzyText",
        },
        {
            Header: "TOTAL PRECIO DE VENTA",
            accessor: "DOC_NETO",
            filter: "fuzzyText",
        },
        // {
        //     Header: "Acciones",
        //     id: "actions",

        //     // @ts-ignore
        //     Cell: ({ row }) => <ActionCell ven={row.original} />,
        // },
    ];

    // @ts-ignore
    if (isLoading || isFetching) return (<TableCharge />)

    // @ts-ignore
    if (isError) return <h1>{error.message} </h1>;

    if (data.message) return <>
        <div style={{ 'width': '90%', 'display': 'flex', 'flexDirection': 'column', 'alignContent': 'center', 'alignSelf': 'center', 'alignItems': 'center' }}>

            <h1 style={{ 'textTransform': 'uppercase', 'fontWeight': 'bold', 'alignContent': 'center' }}>{data.message} </h1>
        </div>

    </>;

    return (
        <>
            <Flex>

                <div style={{ 'maxWidth': '90%', 'margin': '0 auto' }}>
                    <MyContain >
                        {isLoading ?
                            <Skeleton /> :
                            <MyReactTable data={data} columns={columns} isPaginated />
                        }
                        <div style={{ 'float': 'right' }}>
                            <Alert status='error'>
                                {/* <AlertIcon /> */}
                                <Text style={{ 'fontWeight': 'bold' }}>
                                    TOTAL VENDIDO EN CAJA : S/.  {total}
                                </Text>
                               
                            </Alert>
                        </div>
                    </MyContain>
                </div>
            </Flex>

        </>
    )
}