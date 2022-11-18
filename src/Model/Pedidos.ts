import { IProductoCompra } from "./Productos";

export interface IPedido {
    numero: number,
    estado: string,
    fecha: string,
    Producto: IProductoCompra[]
}
export interface IPedidos {
    pedidos: IPedidoModel[]
}
export interface IPedidoModel {
    ORD_ID: number | null,
    CLI_ID: number | null,
    USR_ID: number | null,
    ORT_ID?: number,
    ORD_DATE_ORDER: string,
    ORD_TOTAL_PRICE: string,
    ORD_DISCOUNT_PRICE: string,
    ORD_UNDISCOUNTED_PRICE: string,
    ORD_IGV: string,
    ORD_STATUS: string,
    ORD_METODO_PAGO? : string
}
export interface PedidoResult {
    order: IPedidoModel,
    order_detail: IPedidoProduct[] | null | undefined
}
export interface IPedidoProduct {
    PRO_ID: number,
    CAT_ID: number,
    PRO_NAME: string,
    PRO_DESCRIPTION: string,
    PRO_BRAND: string,
    PRO_CODE: string,
    PRO_BARCODE: string,
    PRO_IMAGE: string,
    PRO_CREATE_DATE: string,
    PRO_STATUS: string,
    ODT_ID: number,
    DIS_ID: number,
    ORD_ID: number,
    SLT_ID: number,
    PRD_ID: number,
    ODT_DAYS_TO_SENDE: number,
    ODT_AMOUNT: string,
    ODT_SUBTOTAL: string,
    ODT_STATUS: string,
    PRO_PRICE: string,
    PRO_PRICE_DISCOUNT: string
}
export interface IPedidoDetailModel {
    ODT_ID: number | null,
    DIS_ID: number | null,
    ORD_ID: number | null,
    SLT_ID: number,
    PRO_ID: number,
    ODT_DAYS_TO_SENDE: string,
    ODT_AMOUNT: string,
    ODT_SUBTOTAL: string,
    ODT_STATUS: string,
    ODT_ONLINE: boolean

}
