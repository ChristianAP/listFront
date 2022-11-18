import React from 'react'
import { Switch, useRouteMatch, Route } from 'react-router-dom';
import { ISubRoute } from '../../Model/Routing'
import { MyAdminRoutes } from './MyAdminRoutes';

export const SubRoutes = ({ routes }: { routes: ISubRoute[] }) => {

    const { url } = useRouteMatch();
    return (
        <Switch>
            {routes.map((route, idx) =>
                <Route exact
                    key={idx}
                    path={url + route.ruta}
                >
                    <MyAdminRoutes name={route.nombre}/>
                </Route>
            )}
        </Switch>
    )
}
