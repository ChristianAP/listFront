import React from 'react';
import { Box, BoxProps, CloseButton, Flex, useColorModeValue, Text, Image } from "@chakra-ui/react";
import { Link } from 'react-router-dom';
import { NavCliente } from '../NavCliente';

interface SidebarProps extends BoxProps {
    onClose: () => void;
}
export const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
    const sidebarContentBG = useColorModeValue('rgba(202, 247, 136,1)', 'gray.900');
    const sidebarContentBorderRight = useColorModeValue('gray.200', 'gray.700');
    return (
        <Box
            transition="width 3s ease"
            bg={sidebarContentBG}
            borderRightColor={sidebarContentBorderRight}
            w={{ base: 'full', md: 60 }}
            pos="fixed"
            h="full"
            {...rest}>
            <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
                <Link to="/">
                    <Image
                        //   borderRadius="full"
                        w="235px"
                        src={import.meta.env.VITE_APP_LOGO + "/upload/logo.jpg"}
                        alt="Phiona App"
                    />
                </Link>
                <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
            </Flex>
            <NavCliente />
        </Box>
    );
};
