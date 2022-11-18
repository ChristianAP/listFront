import React from 'react'
import { Redirect, Route } from 'react-router-dom';
import { IPrivateRoute } from '../../Model/Routing';

export const PrivateRoute = ({ guard, component: Component, ...rest }: IPrivateRoute) => {
    return (
        <Route {...rest}/>
    )
}