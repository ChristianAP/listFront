import { Box, Button, Flex, Grid, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { BsUpload } from "react-icons/bs";
import { useQuery } from "react-query";
import { MyReactTable } from "../../../../GlobalUI/Table/MyReactTable";
import { getExport } from "../../../../Service/UsPointSale";
import { MyContain } from "../../../UI/Components/MyContain";
import { TableCharge } from "../../../UI/Components/TableCharge/tablecharge";
import { Input } from '@chakra-ui/react'


export const ExportModal = ({ array }: { array: any }) => {

    const { onOpen, onClose, isOpen } = useDisclosure()

    const [name, setName] = useState('')

    return (
        <>
            <Button justifyContent={'center'} leftIcon={<BsUpload />} colorScheme="green" onClick={() => {
                console.log('POINT SALE', array);
                setName(array.POS_NAME)
                onOpen()
            }}>
                <Text mx={2}>Confirmar</Text>
            </Button>

            <Modal
                closeOnOverlayClick={false}
                closeOnEsc={false}
                isOpen={isOpen}
                onClose={onClose}
            >
                <ModalOverlay />
                <ModalContent maxW="40%">
                    <ModalHeader>GUÍAS DE REMISIÓN - {name.toUpperCase()} </ModalHeader>
                    <ModalCloseButton />

                    <ModalBody pb={6}>
                        <ModalDataExport array={array} />
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={onClose}>Cancelar</Button>
                    </ModalFooter>

                </ModalContent>
            </Modal>



        </>
    )
}
const ModalDataExport = ({ array }: { array: any }) => {

    const { data, isError, isFetching, isLoading, refetch, error } = useQuery('exp',
        () => getExport(array.POS_ID),
        { refetchOnWindowFocus: false })

    const [totalVendido, setTotalVendido] = useState(0)
    const [totalNOVendido, setTotalNOVendido] = useState(0)


    const [info, setInfo] = useState<any>([])
    console.log("ESTA ES LA DATA ", data)

    useEffect(() => {
        setInfo(data)
        let vendido = 0
        let novendido = 0
        if (!isLoading && !data.message) {
            data.map((e: any) => {
                if (e.RDT_VENDIDO === '1') {
                    vendido += e.RDT_PRICE
                    return vendido
                } else if (e.RDT_VENDIDO === '0') {
                    novendido += e.RDT_PRICE
                    return novendido
                }
            })
            setTotalVendido(Number(vendido.toFixed(3)));
            setTotalNOVendido(Number(novendido.toFixed(3)));
        }

    }, [data])




    const columns = [
        {
            Header: "N°",
            accessor: "secuencia",
            filter: "fuzzyText",
        },
        {
            Header: "Número de Guía",
            accessor: "REM_CODE",
            filter: "fuzzyText",
        },
        {
            Header: "Nombre Producto",
            accessor: "PRO_NAME",
            filter: "fuzzyText",
        },
        {
            Header: "Precio",
            accessor: "RDT_PRICE",
            disableFilters: true,
        },
        {
            Header: "ESTADO",
            accessor: "estado",
            disableFilters: true,
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

    if (data.message) return <h1>{data.message} </h1>;



    return (
        <>
            <Grid gridTemplateColumns={"repeat(2, 1fr)"} gap={'20px'}>
                <Box>

                    <MyContain>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', color: 'green' }}>
                            <label key={'a'} style={{ fontWeight: 'bold' }}>PRECIO TOTAL VENDIDO :</label> &nbsp; &nbsp;
                            S/.{totalVendido}

                        </div>
                    </MyContain>
                </Box>
                <Box>
                    <MyContain>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', color: 'red' }}>
                            <label key={'a'} style={{ fontWeight: 'bold' }}>PRECIO TOTAL NO VENDIDO :</label> &nbsp; &nbsp;
                            S/.{totalNOVendido}

                        </div>
                    </MyContain>

                </Box>

            </Grid>

            <Box>
                <MyContain>
                    <Input placeholder='Basic usage' onKeyUp={(e) => {
                        // @ts-ignore
                        const value = e.target.value
                        let newInfo = data.filter((element: any)=> element.REM_CODE = value )

                        console.log(newInfo);
                        
                    }}/>
                </MyContain>
            </Box>

            <Box overflowY={'auto'}>

                <br />
                <MyReactTable
                    columns={columns}
                    data={data}
                    isPaginated
                />
            </Box>
        </>
    );

}