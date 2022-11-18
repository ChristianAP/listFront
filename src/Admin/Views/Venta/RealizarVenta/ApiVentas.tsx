
async function GetPaymentMethod() {
    try {
        const response = await fetch(`${import.meta.env.VITE_APP_API}/payment_method/`)
        const data = await response.json();
        return data;
    } catch (Error) {
        return [{
            error: Error
        }]
    }
}
async function GetProductos() {
    try {
        const response = await fetch(`${import.meta.env.VITE_APP_API}/product/`)
        const data = await response.json();
        return data;
    } catch (Error) {
        return [{
            error: Error
        }]
    }
}
async function GetProductoFiltro(query: string) {
    try {
        const response = await fetch(`${import.meta.env.VITE_APP_API}/product/search/${query}`)
        const data = await response.json();
        return data;
    } catch (Error) {
        return [{
            error: Error
        }]
    }
}
async function GetProductosDetalles(query: string) {
    try {
        const response = await fetch(`${import.meta.env.VITE_APP_API}/product_details/productstock/${query}`)
        const data = await response.json();
        return data;
    } catch (Error) {
        return [{
            error: Error
        }]
    }
}

//addventa
async function AddVentaBD(datos: any) {
    try {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        };
        const res = await fetch(import.meta.env.VITE_APP_API + '/sales/', requestOptions) //falta
        const data = await res.json()
        return data
    } catch (Error) {
        return Error
    }
}
async function AddVentaBDSalesDescription(datos: any) {
    try {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        };
        const res = await fetch(import.meta.env.VITE_APP_API + '/sales_description/byarray/', requestOptions) //falta
        const data = await res.json()
        return data
    } catch (Error) {
        return Error
    }
}
async function GetTipoComprobante() {
    try {
        const response = await fetch(`${import.meta.env.VITE_APP_API}/document_type`)
        const data = await response.json();
        return data;
    } catch (Error) {
        return {
            error: Error
        }
    }
}


//==================== COMPROBANTES Y EL DOCUMENTO ============

async function InsertDocument(doc: any) {
    try {
        const modeloJson = { //MODELO DEL JSON QUE DEBE TOMAR LA VARIABLE doc ||||||||| NO MODIFICAR ESTA VARIABLE
            document: {
                //ESTO SE DEJA POR DEFAULT EN PAGO AL CONTADO 
                PMT_ID: 5,  // METODO DE PAGO DE LA TABLA sv_payment_method

                //VALOR CAMBIA
                DCT_ID: 5,   //TIPO DE DOCUMENTO DE LA TABLA sv_document_type [FACTURA, BOLETA]
                SLT_ID: 5, //TIPO DE VENTA DE LA TABLA sv_sales_type [VENTA FISICA, VENTA ONLINE] 

                //ESTO SE DEJA EN DEFAULT
                XCR_ID: 5, //NO SE QUE VAINA ES, SOLO PONLE 5 
                BUS_ID: 5,  //DATOS DEL NEGOCIO CON EL QUE SE ESTÁ VENDIENDO 

                //CAMBIA - DATOS CLIENTE
                PER_ID: 165, //dato del cliente
                DOC_ID_CLIENT: "", //EL ID DEL CLIENTE YA SEA DNI O RUC
                DOC_BUSINESS_NAME: "", //NOMBRE DEL CLIENTE O SU RAZON SOCIAL 
                DOC_DIRECTION_CLIENT: "", //DIRECCION DEL CLIENTE 
                //CAMBIA - DATOS DOCUMENTO
                DOC_DOC_TYPE: "", //SI ES FACTURA, BOLETA O NOTA DE CREDITO 
                DOC_SERIE: "",  //CODIGO SERIE DEL COMPROBANTE
                DOC_NUMBER: "", //NUMERO QUE ACOMPAÑA A LA SERIE, ES EL CORRELATIVO
                //CAMBIA - DATOS DOCUMENTO - TOTAL
                DOC_DOC_SUBTOTAL: 0.00, // SUBTOTAL SIN DESCUENTO Y SIN SUBDESCUENTO 
                DOC_SUB_DISCOUNT: 0.00, // SUBDESCUENTO DE VENTA
                DOC_SUBTOTAL: 0.00, //EL TOTAL DEL SUBTOTAL SIN IGV SIN EL DESCUENTO
                DOC_DISCOUNT: 0.00, //EL TOTAL DEL DESCUENTO
                DOC_TAXED: 0.00, //TOTAL DEL SUBTOTAL SIN IGV CON DESCUENTO
                //SE DEJA EN 0.00
                DOC_INAFECT: 0.00, //TOTAL DE INAFECTO 
                DOC_RELEASED: 0.00, //TOTAL QUE EXONERA IGV
                //CAMBIA
                DOC_IGV: 0.00, //IGV DEL DOC_TAXED
                DOC_NETO: 0.00,  //DOC_TAXED + DOC_IGV
                //CAMBIA - ESTADO DOCUMENTO 
                DOC_STATUS: "CREADO", //HAY 2 ESTADO [CREADO,ACEPTADO ]
                //FECHA
                DOC_DATE: "10/10/2021"
            },
            sales_description: [ //datos de los productos
                //CAMBIA
                {
                    DOC_ID: 0,
                    STK_ID: 0,  // ID DEL STOCK, SE USA PARA PODER CAMBIAR EL STOCK INTERNAMENTE
                    PRO_ID: 1, //ID DEL PRODUCTO
                    DIS_ID: 3, //ID DEL DESCUENTO sv_discount, PUEDE SER NULO 
                    SDT_CODE: "", //CODIGO DEL PRODUCTO
                    SDT_AMOUNT: 0.00, //CANTIDAD VENDIDA
                    SDT_DESCRIPTION: 0.00, //DESCRIPCION DEL PRODUCTO
                    SDT_PRICE: 0.00, //PRECIO DEL PRODUCTO
                    SDT_SUBTOTAL: 0.00, //CANTIDAD * PRECIO
                    SDT_DISCOUNT: 0.00, //DESCUENTO DEL PRODUCTO
                    SDT_TOTAL: 0.00, //SUBTOTAL - DESCUENTO
                    SDS_DAYS_TO_SEND: "", //FECHA DE CREACIÓN 
                    //SE MANTIENE POR DEFAULT 
                    SDS_STATUS: "1" //SIEMPRE 1 
                }
            ],
            stock: [
                {
                    STK_ID: 0,
                    SDT_AMOUNT: 0
                }
            ]
        }
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(doc)
        };
        const res = await fetch(`${import.meta.env.VITE_APP_API}/document/create`, requestOptions) //falta
        const data = await res.json()
        return data

    } catch (Error) {
        return Error
    }
}
async function getVenta(id: any) {
    try {
        const response = await fetch(`${import.meta.env.VITE_APP_API}/document/` + id)
        const data = await response.json();
        return data;
    } catch (Error) {
        return {
            error: Error
        }
    }
}
async function SendCorreo(lastId: number, correo: string) {

    try {
        let doc = {
            lastId: lastId,
            correo: correo
        }
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(doc)
        };
        const response = await fetch(`${import.meta.env.VITE_APP_API}/mail/saleemail/`, requestOptions)
        const data = await response.json();
        return data;
    } catch (Error) {
        return {
            error: Error
        }
    }
}
const api = {
    productos: {
        getAll() {
            return GetProductos();
        },
        getAllQuery(query: string) {
            return GetProductoFiltro(query);
        },
        getAllDetails(query: string) {
            return GetProductosDetalles(query);
        }


    },
    ventas: {
        adVenta(prod: any) {
            return AddVentaBD(prod);
        },
        addVentaSalesDescription(prod: any) {
            return AddVentaBDSalesDescription(prod);
        },
        getTipoComprobantes() {
            return GetTipoComprobante();
        },
        addDocument(doc: any) {
            return InsertDocument(doc)
        },
        getPayMethod() {
            return GetPaymentMethod();
        },
        getDocument(id: any) {
            return getVenta(id);
        },
        sendCorreo(lastId: number, correo: string) {
            return SendCorreo(lastId, correo);
        }

    }
}
export default api;