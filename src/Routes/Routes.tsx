import React from 'react'
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom'
import { Impresion } from '../Admin/Views/Venta'
import { AdminRoute } from './Admin/AdminRoute'
import { ClientRoute } from './Client/ClientRoute'

export const Routes = () => {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/admin" component={AdminRoute} />
                {
                    // cookies.get("token")
                    true &&
                    <Route exact path="/impresion/:item/:id">
                        <Impresion />
                    </Route>
                }
                <ClientRoute />
            </Switch>
        </BrowserRouter>
    )
}
