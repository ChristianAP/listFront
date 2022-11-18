import React, { useEffect } from 'react'
import { Switch, useRouteMatch, Route, Redirect } from 'react-router-dom'
import { useRecoilState } from 'recoil'
import { AdminState, LoadingScreen } from '../../Data/Atoms/Admin'
import SidebarWithHeader from '../../Admin/UI/Layout/NavBar/SidebarWithHeader'

// @ts-ignore
import { AdminLogIn } from '../../Admin/Views/Configuracion/Index'
import { SubRoutes } from './SubRoutes'

import Cookies from 'universal-cookie';
import { getTokenAdmin } from '../../Service/LoginService'
import carga from './carga.gif';
import { Center } from '@chakra-ui/react'

const cookies = new Cookies();

const userAccess = {
    Acceso: "Opciones",
    Ruta: "/opciones",
    SubAccesos: [
        {
            nombre: "Configuración",
            ruta: "/configuracion",
        },
        {
            nombre: "Perfil",
            ruta: "/perfil",
        },
    ],
};

export const AdminRoute = () => {

    const { url } = useRouteMatch();

    const [admin, setAdmin] = useRecoilState(AdminState)
    const [isLoading, setLoading] = useRecoilState(LoadingScreen)

    useEffect(() => {
        async function getToken() {
            if (cookies.get("token")) {
                const data = await getTokenAdmin(cookies.get("token"));
                setAdmin({
                    auth: true,
                    iu: data.iu,
                    user: data.user[0].USR_USER,
                    //@ts-ignore
                    roles: [...data.roles.map((val) => val.ROL_NAME)],
                    //@ts-ignore
                    accesos: [ ...data.accesos, userAccess],
                });
            }
            setLoading(false)
        }
        getToken();
    }, [])

    // TODO UPDATE CHARGE
    if (isLoading) return <Center width={ "100vw" } height={ "100vh" }> <img src={ carga } alt="" style={ { width: "30vw" } } /> </Center>

    if (admin.auth) return (
        <>
            <SidebarWithHeader>
                <Switch>
                    {
                        admin.accesos.map((route, idx) =>
                            <Route
                                // @ts-ignore
                                key={ idx }
                                // @ts-ignore
                                path={ url + route.Ruta }
                            >
                                {/* @ts-ignore */ }
                                <SubRoutes routes={ route.SubAccesos } />
                            </Route>
                        )
                    }
                    <Redirect to="/admin/ventas/realizar-venta" />
                </Switch>

            </SidebarWithHeader>
        </>
    )

    return <AdminLogIn />
}
