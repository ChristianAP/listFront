export interface IProductoCompra {
    id: number,
    nombre: string,
    precio: number,
    cantidad: number,
    peso?: number,
    subtotal: number,
    imagen: string,
    descripcion: string,
    online: boolean,
    descuento: number | null | undefined,
    preciosindecuento: number | undefined | null,
}
export interface IProductoCompras {
    productocompra: IProductoCompra[]
}

export interface IProducto {
    PRO_ID: number,
    PRD_ID: number,
    CAT_ID: number,
    PRO_PRICE: number,
    PRO_NAME: string,
    PRO_DESCRIPTION: string,
    PRO_BRAND: string,
    PRO_CODE: string,
    PRO_BARCODE: string,
    PRO_IMAGE: string,
    PRO_CREATE_DATE: string,
    PRO_STATUS: string,
    PRO_PRICE_DISCOUNT: number | undefined
    PRO_WEIGHT?: number,
    PRO_ONLINE?: string
}
export interface IProductos {
    productos: IProducto[]
}


export interface SalesOnlineProducts {
    IMAGE: string,
    PRODUCTO: string,
    DESCRIPCION: string,
    PRECIO: string,
    CANTIDAD: string,
    SUBTOTAL: string,
}