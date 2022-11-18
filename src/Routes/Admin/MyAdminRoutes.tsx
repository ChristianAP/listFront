import React from 'react';
import { ListarProveedor, RegistrarStock } from '../../Admin/Views/Compra';
import { PuntoVenta, RegistrarCompra, VentaPOS, RegistraCompra } from '../../Admin/Views/VentaFeria';
import { Accesos, Conductores, Empresa, FormaVenta, Impresora, TiendaOnline, TipoPago, Usuarios } from "../../Admin/Views/Configuracion/Index"
import { MetodoPago } from '../../Admin/Views/Configuracion/MetodoPago/MetodoPago';
import { DashboardView } from '../../Admin/Views/Dashboard';
import { Categoria, Descuento, Kardex, PriceList, Promocion, RegistrarProducto } from '../../Admin/Views/Producto';
import { SoporteDashboard, TicketAbiertos, TicketPendiente, TicketSinResolver, TicketsNuevos } from '../../Admin/Views/Soporte';
import { ListarVentas, RealizarVenta, Comprobantes, ListarClientes, ListarVentasOnline, VentasLibre, Consiliacion } from "../../Admin/Views/Venta"
import { ConfiguracionConfiguration } from './../../Admin/Views/Options/Configuracion/Configuracion';
import { PerfilConfiguration } from './../../Admin/Views/Options/Perfil/Perfil';
import { NotificacionesView } from '../../Admin/Views/Notificaciones';
import { PasosOnline } from '../../Admin/Views/Configuracion/PasosOnline/PasosOnline';
import { AperturaCaja } from '../../Admin/Views/Caja/AperturaCaja/AperturaCaja';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';

export const MyAdminRoutes = ({ name }: { name: string }) => {
    const componentsList = {
        'Realizar Venta': () => <RealizarVenta />,
        'Listar Venta': () => <ListarVentas />,
        'Venta Libre': () => <VentasLibre />,
        'Conciliación': () => <Consiliacion />,
        'Comprobantes Electrónicos': () => <Comprobantes />,
        'Listar Clientes': () => <ListarClientes />,
        'Pedidos Online': () => <ListarVentasOnline />,
        'Registrar Insumo': () => <RegistrarProducto online={false} />,
        'Registrar Insumo Online': () => <RegistrarProducto online={true} />,
        'Categoria': () => <Categoria />,
        'Descuento': () => <Descuento online={false} />,
        'Descuento Online': () => <Descuento online={true} />,
        'Lista de Precios': () => <PriceList />,
        'Registrar Compra': () => <RegistraCompra />,
        'Banner Online': () => <Promocion />,
        'Kardex Productos': () => <Kardex />,
        'Guias de Remision': () => <RegistrarCompra />,
        'Agregar Stock': () => <RegistrarStock />,
        'Proveedores': () => <ListarProveedor />,
        'Usuarios': () =>
            <Tabs>
                <TabList>
                    <Tab>Usuarios</Tab>
                    <Tab>Conductores</Tab>
                </TabList>

                <TabPanels>
                    <TabPanel>
                        <Usuarios />
                    </TabPanel>
                    <TabPanel>
                        <Conductores />
                    </TabPanel>
                </TabPanels>
            </Tabs>
        ,
        'Empresa': () => <Empresa />,
        'Impresora': () => <Impresora />,
        'Forma Pago': () => <TipoPago />,
        'Forma Venta': () => <FormaVenta />,
        'Informes': () => <SoporteDashboard />,
        'Tickets Nuevos': () => <TicketsNuevos />,
        'Tickets Abiertos': () => <TicketAbiertos />,
        'Tickets pendientes': () => <TicketPendiente />,
        'Tickets sin resolver': () => <TicketSinResolver />,
        'Configuración': () => <ConfiguracionConfiguration />,
        'Metodo de pago': () =>
            <Tabs>
                <TabList>
                    <Tab>Metodo de pago</Tab>
                    <Tab>Forma Pago</Tab>
                    <Tab>Forma Venta</Tab>
                </TabList>

                <TabPanels>
                    <TabPanel>
                        <MetodoPago />
                    </TabPanel>
                    <TabPanel>
                        <TipoPago />
                    </TabPanel>
                    <TabPanel>
                        <FormaVenta />
                    </TabPanel>
                </TabPanels>
            </Tabs>,
        'Perfil': () => <PerfilConfiguration />,
        'Reportes': () => <DashboardView />,
        'Notificaciones': () => <NotificacionesView />,
        'Accesos': () => <Accesos />,
        'Punto de Venta': () => <PuntoVenta />,
        'Venta en Punto de Venta': () => <VentaPOS />,
        'Conductores': () => <Conductores />,
        'Tienda Online': () => <TiendaOnline />,
        'Pasos Online': () => <PasosOnline />,
        'Apertura Caja': () => <AperturaCaja />,
    }

    // @ts-ignore
    return componentsList[name]()
}