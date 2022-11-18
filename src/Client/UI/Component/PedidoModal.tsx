import React, { ReactNode, useEffect, useRef, useState } from "react";
import {
    Modal,
    Stack,
    Skeleton,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    useDisclosure,
    Box,
    Image,
    Text,
    Flex,
    Spacer,
    Button,
    useColorModeValue,
    ModalBody,
    Center,
    ModalFooter,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionIcon,
    AccordionPanel,
} from "@chakra-ui/react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { readOrderDetailByOrderID } from "../../../Service/TiendaOnlineService";
import { MyReactTable } from "../../../GlobalUI/Table/MyReactTable";
import { BiStore } from "react-icons/bi";
import { TableChargeListProduct } from "../../../Admin/UI/Components/TableCharge/tablecharge";
import { AiOutlineFileDone } from "react-icons/ai";

const Texto = (row: any) => {
    console.log(Number(row.row.original.ODT_SUBTOTAL).toFixed(2));
    return (<Text> {Number(row.row.original.ODT_SUBTOTAL).toFixed(2)} </Text>)
}

export const PedidoList = ({
    children,
    ORD_ID,
    ORD_VOUCHER
}: {
    children: ReactNode;
    ORD_ID: number;
    ORD_VOUCHER?: string;
}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <>
            <div onClick={onOpen}>{children}</div>
            <Modal
                closeOnOverlayClick={false}
                size="6xl"
                isOpen={isOpen}
                onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Lista de Insumos</ModalHeader>
                    <ModalCloseButton />
                    <OrderDetail ORD_ID={ORD_ID} ORD_VOUCHER={ORD_VOUCHER} />
                </ModalContent>
            </Modal>
        </>
    );
};

/*
* SUBCOMPONENTE PARA LAS CELDAS DE 'Acciones'
? EN ESTE CASO USAMOS EL SUBCOMPONENTE PARA LOS BOTONES DE 'Eliminar', 'Editar' y EL BOTON PARA CAMBIAR ESTADO
? LOS HOOKS Y VARIABLES USADOS SON ENFOCADOS A ESTAS FUNCIONALIDADES
*/
const OrderDetail = ({ ORD_ID, ORD_VOUCHER }: { ORD_ID: number, ORD_VOUCHER?: string }) => {
    // ? QUERY PARA OBTENER LA DATA DEL BACKEND
    const { isLoading, isError, data, error, isFetching } = useQuery(
        "ProductPriceList",
        () => readOrderDetailByOrderID(ORD_ID + ""),
        { refetchOnWindowFocus: false }
    );
    const buttonarritoVacioBG = useColorModeValue("blue.600", "gray.300");

    const [subTotal, setSubTotal] = useState(0);
    var subtotal = 0;
    const columns = [
        {
            Header: "ID",
            Footer: "ID",
            accessor: "PRO_ID",
            disableFilters: true,
        },
        {
            Header: "Imagen",
            Footer: "Imagen",
            id: "imagen",
            // @ts-ignore
            Cell: ({ row }) => <Image height="200px" src={row.original.PRO_IMAGE} />,
        },
        {
            Header: "Nombre",
            Footer: "Nombre",
            accessor: "PRO_NAME",
        },
        {
            Header: "Cantidad",
            Footer: "Cantidad",
            accessor: "ODT_AMOUNT",
        },
        {
            Header: "Sub Total",
            Footer: "Sub Total",
            accessor: "ODT_SUBTOTAL",
            // @ts-ignore
            Cell: ({ row }) => <Texto row={row} />,
        },
    ];
    useEffect(() => {
        if (data && !data.message) {
            data.map((val: any) => {
                subtotal += Number(val.ODT_SUBTOTAL);
            });
            setSubTotal(subtotal);
        }
    }, [data]);

    if (isLoading || isFetching)
        return (
            <TableChargeListProduct />
        );

    if (isError)
        return (
            <h1>
                {/* @ts-ignore */}
                {error.message} {":("}
            </h1>
        );
    if (data) {
        if (data.message) return <h1>{data.message}</h1>;
    }

    //TO-DO Implementar el total dinamicamente
    return (
        <>
            <Box
                overflowX="scroll"
                padding="2"
                margin="4"
                borderRadius="md"
                border="1px solid #E2E8F0">
                <Flex>
                    <Text fontSize="lg">
                        Suma total del Pedido: <b> {subTotal.toFixed(2)}</b>
                    </Text>
                    <Spacer />
                </Flex>
                <Accordion allowToggle>
                    <AccordionItem>
                        <AccordionButton>
                            <Box flex='1' textAlign='left'>
                                <Center color={"#2c5282"} fontWeight="bold" fontSize={15}>
                                    Ver Voucher
                                </Center>
                            </Box>
                            <AccordionIcon />
                        </AccordionButton>
                        <AccordionPanel pb={4}>
                            <Center mb={2}>
                                <Image src={ORD_VOUCHER} alt='Voucher de compra' />
                            </Center>
                        </AccordionPanel>
                    </AccordionItem>
                </Accordion>
                <MyReactTable
                    columns={columns}
                    data={data}
                    isPaginated
                    hasFilters
                    pagesOptions={[50, 75, 100]}
                />
            </Box>
        </>
    );
};
