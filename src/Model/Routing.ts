import { ReactNode } from "react";

export interface IPrivateRoute {
    guard: IGuard;
    component: React.ElementType,
    exact?: boolean;
    path: string
}
export interface IAuthRoute {
    component: React.ElementType,
    exact?: boolean;
    path: string
}

export interface IGuard {
    canActive: boolean;
    path: string;
    text: string[];
}

export interface IGuardConf {
    guard: any;
    message: string
}

export interface IRoute {
    name: string;
    guard: IGuard;
    path: string;
    component: React.ElementType,
    child?: IRoute[],
    isOnSideBar?: boolean,
    params?: any[]
}
export interface ISubRoute {
    nombre: string;
    ruta: string;
}

export interface IClientRoutes {
    path: string;
    component: any,
    isPrivate: boolean;
    exact?: boolean;
}