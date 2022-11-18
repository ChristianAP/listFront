import { Box, Center, Grid, Image, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import React, { useState } from "react";
import { IoEyeOutline } from "react-icons/io5";
import { SalesOnlineProducts } from "../../../../Model/Productos";
import { ListProductsSalesOnline } from "../../../../Service/Sales";
import { MyContain } from "../../../UI/Components/MyContain";
import { TableChargeProductAndDescription } from "../../../UI/Components/TableCharge/tablecharge";

export interface Prueba {
    IMAGE: string,
    PRODUCTO: string,
    DESCRIPCION: string,
    PRECIO: number,
    CANTIDAD: number,
    SUBTOTAL: number,
}

export const TablaProductosVentasOnline = ({ idOrder }: any) => {
    const [products, statusproducts] = useState(0);
    const [allproducts, statusallproducts] = useState<Prueba[]>([]);


    async function getProducts() {
        statusproducts(1);
        let dataProduct = await ListProductsSalesOnline(idOrder);
        if (!dataProduct.message) {
            statusallproducts(dataProduct);
            statusproducts(2);
        } else {
            statusproducts(3);
        }
    }

    return (<>
        {products === 0 ? (
            <Box
                bg="gray.500"
                w="98%"
                m={2}
                cursor="pointer"
                p={1}
                onClick={() => getProducts()}
                color="white">
                <Center>
                    <IoEyeOutline size={60} />
                </Center>
                <Center>Ver productos</Center>
            </Box>
        ) : products === 1 ? (
            <TableChargeProductAndDescription />

        ) : allproducts.length > 0 ? (
            <MyContain>
                <Table>
                    <Thead>
                        <Tr>
                            <Th> Producto </Th>
                            <Th></Th>
                            <Th> Descripción </Th>
                            <Th> Cantidad </Th>
                            <Th> Precio </Th>
                            <Th> Total Neto </Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {allproducts.map((value, idx) => {
                            return (
                                <Tr key={idx}>
                                    <Td>
                                        <Image
                                            src={value.IMAGE}
                                            alt="Producto"
                                            objectFit="cover"
                                            boxSize="150px"
                                        />
                                    </Td>
                                    <Td>{value.PRODUCTO}</Td>
                                    <Td>{value.DESCRIPCION}</Td>
                                    <Td>{value.CANTIDAD}</Td>
                                    <Td>s/.{value.SUBTOTAL / value.CANTIDAD}</Td>
                                    <Td>s/.{value.SUBTOTAL}</Td>
                                </Tr>
                            );
                        })}
                    </Tbody>
                </Table>
            </MyContain>
        ) : (<>
            <Center m={1} fontWeight="bold">
                No hay productos que mostrar
            </Center>
        </>)}
    </>
    );
}

