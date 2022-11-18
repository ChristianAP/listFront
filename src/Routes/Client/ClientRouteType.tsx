import React from 'react'
import { Redirect, Route, useLocation } from 'react-router-dom';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { ClientState } from '../../Data/Atoms/Client';
import { IClientRoutes } from '../../Model/Routing';
import Cookies from 'universal-cookie';
import { LoadingScreen } from '../../Data/Atoms/Admin';


const cookies = new Cookies();


export const ClientRouteType = ({ component: Component, isPrivate, ...rest }: IClientRoutes) => {

    const [auth, setAuth] = useRecoilState(ClientState)
    const setLoading = useSetRecoilState(LoadingScreen)
    const location = useLocation()

    return (
        <Route {...rest}>
            {
                auth.auth || !isPrivate ?
                    <Component />
                    :
                    <Redirect to={
                        {
                            pathname: '/login',
                            state: { from: location }
                        }} />
            }
        </Route>
    )
}
