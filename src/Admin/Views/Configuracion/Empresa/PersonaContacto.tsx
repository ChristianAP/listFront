import {
    Grid,
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
import { EditRepresentativeModal } from "./EditCompany";

export const PersonaContacto = ({ data }: { data: any }) => {
    return (
        <>
            <Box background="white" borderRadius="10px" p={4}>
                <Flex>
                    <Box w="90%">
                        <Center h="50px">
                            <Text
                                mr={2}
                                p={2}
                                fontSize="xl"
                                alignContent="center"
                                fontWeight="bold">
                                Datos de persona de contacto
                            </Text>
                        </Center>
                    </Box>
                    <Spacer />
                    <Box p="2">
                        <EditRepresentativeModal company={data}>
                            <Tooltip label='Editar'>
                                <IconButton
                                    icon={<AiFillEdit />}
                                    aria-label="Editar"
                                    colorScheme="blue"
                                />
                            </Tooltip>
                        </EditRepresentativeModal>
                    </Box>
                </Flex>

                <Divider />
                <Table size="sm">
                    <Tbody>
                        <Tr>
                            <Td w="200px">
                                <Text mr={2} pt={2} fontSize="md" fontWeight="bold">
                                    Nombres y apellidos
                                </Text>
                            </Td>
                            <Td>
                                <Text mr={2} pt={2} fontSize="md">
                                    {data.COM_REPRESENTATIVE_LEGAL}
                                </Text>
                            </Td>
                        </Tr>
                        <Tr>
                            <Td w="200px">
                                <Text mr={2} pt={2} fontSize="md" fontWeight="bold">
                                    Teléfono
                                </Text>
                            </Td>
                            <Td>
                                <Text mr={2} pt={2} fontSize="md">
                                    {data.COM_REPRESENTATIVE_PHONE}
                                </Text>
                            </Td>
                        </Tr>
                        <Tr>
                            <Td w="200px">
                                <Text mr={2} fontSize="md" fontWeight="bold">
                                    Correo Electrónico
                                </Text>
                            </Td>
                            <Td>
                                <Text mr={2} pt={2} fontSize="md">
                                    {data.COM_REPRESENTATIVE_EMAIL}
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
                                    {data.COM_REPRESENTATIVE_DIRECTION}
                                </Text>
                            </Td>
                        </Tr>
                    </Tbody>
                </Table>
            </Box>
        </>
    );
};
