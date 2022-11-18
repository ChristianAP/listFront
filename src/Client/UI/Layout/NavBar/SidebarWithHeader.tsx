import React, { ReactNode } from 'react';
import {
    Box,
    useColorModeValue,
    Drawer,
    DrawerContent,
    useDisclosure,
} from '@chakra-ui/react';

import { MobileNav } from './Mobilenav';
import { SidebarContent } from './SideBarContent';
import { useRecoilValue } from 'recoil';
import { ClientState, HeaderClient, NavClient } from '../../../../Data/Atoms/Client';
import { Footer } from '../Footer';

export default function SidebarWithHeader({ children }: { children: ReactNode }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const auth = useRecoilValue(ClientState)
    const navclient = useRecoilValue(NavClient)
    const headerclient = useRecoilValue(HeaderClient)


    return (
        <Box minH="100vh" bg={ !headerclient ? "linear-gradient(135deg, rgba(27,49,177,1) 0%, rgba(5,159,249,1) 100%)" : "gray.200" }>
            { auth && navclient ?
                <>
                    <SidebarContent
                        onClose={ () => onClose }
                        display={ { base: 'none', md: 'block' } }
                    />
                    <Drawer
                        autoFocus={ false }
                        isOpen={ isOpen }
                        placement="left"
                        onClose={ onClose }
                        returnFocusOnClose={ false }
                        onOverlayClick={ onClose }
                        size={ "full" }>
                        <DrawerContent>
                            <SidebarContent onClose={ onClose } />
                        </DrawerContent>
                    </Drawer>
                </> :
                <> </> }
            {/* mobilenav */ }
            { headerclient && <MobileNav onOpen={ onOpen } /> }
            <Box id="asd" ml={ { base: 0, md: auth ? (navclient ? 60 : 0) : 0 } }>
                { children }
            </Box>
            { (!navclient && headerclient) && <Footer /> }
        </Box>
    );
}



