import React, { useEffect } from 'react'
import { Switch } from 'react-router-dom'
import { AuthClientRoutes } from './../../Data/Routes/Client/AuthClientRoutes';
import { ClientRoutes } from '../../Data/Routes/Client/ClientRoutes';
import { ClientRouteType } from './ClientRouteType';
import { Box, Center, useColorModeValue, useDisclosure } from '@chakra-ui/react';
import SidebarWithHeader from '../../Client/UI/Layout/NavBar/SidebarWithHeader';
import { getTokenAdmin } from '../../Service/LoginService';
import Cookies from 'universal-cookie';
import { LoadingScreen } from '../../Data/Atoms/Admin';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { ClientState } from '../../Data/Atoms/Client';
import carga from '../Admin/carga.gif'
const cookies = new Cookies();

export const ClientRoute = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const clientRouterBG = useColorModeValue('gray.100', 'gray.900');

    const [auth, setAuth] = useRecoilState(ClientState)
    const [isLoading, setLoading] = useRecoilState(LoadingScreen)

    useEffect(() => {
        async function getToken() {
            if (cookies.get("clientToken")) {
                const data = await getTokenAdmin(cookies.get("clientToken"));
                setAuth({
                    auth: true,
                    iu: data.iu,
                    user: data.user[0].USR_USER,
                    //@ts-ignore
                    roles: [...data.roles.map((val) => val.ROL_NAME)],
                    //@ts-ignore
                    accesos: [...data.accesos],
                });
            }
            setLoading(false)
        }
        getToken();
    }, [])
    if (isLoading) return <Center width={"100vw"} height={"100vh"}> <img src={carga} alt="" style={{ width: "30vw" }} /> </Center>

    return (
        <Box minH="100vh" bg={clientRouterBG}>
            <SidebarWithHeader>
                <Switch>
                    {
                        [...AuthClientRoutes, ...ClientRoutes].map((val, idx) =>
                            <ClientRouteType key={idx}
                                component={val.component}
                                path={val.path}
                                isPrivate={val.isPrivate}
                                exact={val.exact || true}
                            />
                        )
                    }
                </Switch>
            </SidebarWithHeader>

        </Box>
    )
}
