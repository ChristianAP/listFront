import {
    Box,
    Flex,
    IconButton,
    Spacer,
    Text,
    Divider,
    Table,
    Tr,
    Tbody,
    Td,
    Center,
    Tooltip,
} from "@chakra-ui/react";
import React from "react";
import { AiFillEdit } from "react-icons/ai";
import { EditCompanyModal } from "./EditCompany";
export const DatosEmpresa = ({ data }: { data: any }) => {

    return (
        <>
            <Box background="white" borderRadius="10px" p={4}>
                <Flex>
                    <Box w="90%">
                        <Center>
                            <Text
                                mr={2}
                                p={2}
                                fontSize="xl"
                                alignContent="center"
                                fontWeight="bold">
                                Datos de empresa
                            </Text>
                        </Center>
                    </Box>
                    <Spacer />
                    <Box p="2">
                        <EditCompanyModal company={data}>
                            <Tooltip label='Editar'>
                                <IconButton
                                    icon={<AiFillEdit />}
                                    aria-label="Editar"
                                    colorScheme="blue"
                                />
                            </Tooltip>
                        </EditCompanyModal>
                    </Box>
                </Flex>
                <Divider />
                <Table size="sm">
                    <Tbody>
                        <Tr>
                            <Td w="200px">
                                <Text mr={2} pt={2} fontSize="md" fontWeight="bold">
                                    Nombre Empresa
                                </Text>
                            </Td>
                            <Td>
                                <Text mr={2} pt={2} fontSize="md">
                                    {data.COM_COMPANY_NAME}
                                </Text>
                            </Td>
                        </Tr>
                        <Tr>
                            <Td w="200px">
                                <Text mr={2} pt={2} fontSize="md" fontWeight="bold">
                                    RUC
                                </Text>
                            </Td>
                            <Td>
                                <Text mr={2} pt={2} fontSize="md">
                                    {data.COM_ORGANIZATION_RUC}
                                </Text>
                            </Td>
                        </Tr>
                        <Tr>
                            <Td w="200px">
                                <Text mr={2} pt={2} fontSize="md" fontWeight="bold">
                                    Sector de trabajo
                                </Text>
                            </Td>
                            <Td>
                                <Text mr={2} pt={2} fontSize="md">
                                    {data.COM_ORGANIZATION_SECTOR}
                                </Text>
                            </Td>
                        </Tr>
                        <Tr>
                            <Td w="200px">
                                <Text mr={2} pt={2} fontSize="md" fontWeight="bold">
                                    Teléfono 1
                                </Text>
                            </Td>
                            <Td>
                                <Text mr={2} pt={2} fontSize="md">
                                    {data.COM_ORGANIZATION_PHONE_ONE}
                                </Text>
                            </Td>
                        </Tr>
                        <Tr>
                            <Td w="200px">
                                <Text mr={2} pt={2} fontSize="md" fontWeight="bold">
                                    Teléfono 2
                                </Text>
                            </Td>
                            <Td>
                                <Text mr={2} pt={2} fontSize="md">
                                    {data.COM_ORGANIZATION_PHONE_TWO}
                                </Text>
                            </Td>
                        </Tr>
                        <Tr>
                            <Td w="200px">
                                <Text mr={2} pt={2} fontSize="md" fontWeight="bold">
                                    Teléfono 3
                                </Text>
                            </Td>
                            <Td>
                                <Text mr={2} pt={2} fontSize="md">
                                    {data.COM_ORGANIZATION_PHONE_THREE}
                                </Text>
                            </Td>
                        </Tr>
                        <Tr>
                            <Td w="200px">
                                <Text mr={2} pt={2} fontSize="md" fontWeight="bold">
                                    Tipo de organización
                                </Text>
                            </Td>
                            <Td>
                                <Text mr={2} pt={2} fontSize="md">
                                    {data.COM_ORGANIZATION_TYPE}
                                </Text>
                            </Td>
                        </Tr>
                        <Tr>
                            <Td w="200px">
                                <Text mr={2} pt={2} fontSize="md" fontWeight="bold">
                                    Año de constitución
                                </Text>
                            </Td>
                            <Td>
                                <Text mr={2} pt={2} fontSize="md">
                                    {data.COM_CONSTITUTION_YEAR}
                                </Text>
                            </Td>
                        </Tr>
                        <Tr>
                            <Td w="200px">
                                <Text mr={2} pt={2} fontSize="md" fontWeight="bold">
                                    Página web
                                </Text>
                            </Td>
                            <Td>
                                <Text mr={2} pt={2} fontSize="md">
                                    {data.COM_ORGANIZATION_WEB_PAGE}
                                </Text>
                            </Td>
                        </Tr>
                        <Tr>
                            <Td w="200px">
                                <Text mr={2} pt={2} fontSize="md" fontWeight="bold">
                                    Correo Electrónico
                                </Text>
                            </Td>
                            <Td>
                                <Text mr={2} pt={2} fontSize="md">
                                    {data.COM_ORGANIZATION_EMAIL}
                                </Text>
                            </Td>
                        </Tr>
                        <Tr>
                            <Td w="200px">
                                <Text mr={2} pt={2} fontSize="md" fontWeight="bold">
                                    Dirección
                                </Text>
                            </Td>
                            <Td>
                                <Text mr={2} pt={2} fontSize="md">
                                    {data.COM_ORGANIZATION_DIRECTION}
                                </Text>
                            </Td>
                        </Tr>
                        <Tr>
                            <Td w="200px">
                                <Text mr={2} pt={2} fontSize="md" fontWeight="bold">
                                    Precio del Delivery
                                </Text>
                            </Td>
                            <Td>
                                <Text mr={2} pt={2} fontSize="md">
                                    {data.COM_DELIVERY_PRICE}
                                </Text>
                            </Td>
                        </Tr>
                    </Tbody>
                </Table>
            </Box>
        </>
    );
};
