import React, { ReactNode } from 'react';
import {
    Box,
    useColorModeValue,
    Drawer,
    DrawerContent,
    useDisclosure,
    DrawerOverlay,
} from '@chakra-ui/react';

import { MobileNav } from './Mobilenav';
import { SidebarContent } from './SideBarContent';

export default function SidebarWithHeader({ children }: { children: ReactNode }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    return (
        <Box minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')}>
            <SidebarContent
                bg={"#0f1e49"}
                color={"white"}
                onClose={() => onClose}
                display={{ base: 'none', lg: 'block' }}
            />
            <Drawer
                autoFocus={false}
                isOpen={isOpen}
                placement="left"
                onClose={onClose}
                returnFocusOnClose={false}
                onOverlayClick={onClose}
                size="full"
            >
                <DrawerOverlay>
                    <DrawerContent overflow='scroll'>
                        <SidebarContent bg={"#0f1e49"} color={"white"} onClose={onClose} />
                    </DrawerContent>
                </DrawerOverlay>
            </Drawer>
            {/* mobilenav */}
            <MobileNav onOpen={onOpen} />
            <Box ml={{ base: 0, lg: 60 }} p="4">
                {children}
            </Box>
        </Box>
    );
}



