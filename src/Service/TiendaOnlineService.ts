import { ClientCreateTicket } from "../Model/Tickets"
// import Cookies from "universal-cookie";
import Cookies from 'js-cookie';
function tokens() {
    // const cookies = new Cookies();
    return  Cookies.get("clientToken")
    // return  localStorage.getItem('token')

}

const getCategories = async () => {
    const res = await fetch(import.meta.env.VITE_APP_API + '/category/tienda/active')
    return res.json()
}

const getAllCategories = async () => {
    const res = await fetch(import.meta.env.VITE_APP_API + '/category')
    return res.json()
}

const getPersonByIdUser = async () => {

    const token = await tokens()
    const res = await fetch(import.meta.env.VITE_APP_API + "/person/tienda/online", {
        headers: {
            authorization: "bearer=" + token
        }
    })
    return res.json()
}

const getTypePerson = async () => {
    const res = await fetch(import.meta.env.VITE_APP_API + "/person_type/IND")
    return res.json()
}
//@ts-ignore
const editPerson = async (res) => {
    const token = await tokens()
    
    const response = await fetch(import.meta.env.VITE_APP_API + '/person/tienda/edit', {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            "authorization": "bearer=" + token
        },
        method: "PATCH",
        body: JSON.stringify(res)
    })
    const data = await response.json();
    return data;
}

//@ts-ignore
const validationAlert = async (res) => {
    console.log(res);

    const response = await fetch(import.meta.env.VITE_APP_API + '/orders/validationAlert', {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(res)
    })
    const data = await response.json();
    return data;
}

//@ts-ignore
const changeStatusOrder = async (res) => {
    console.log(res);

    const response = await fetch(import.meta.env.VITE_APP_API + '/orders/changeStatusOrder', {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(res)
    })
    const data = await response.json();
    return data;
}

//@ts-ignore
const closeAlert = async (res) => {
    console.log(res);

    const response = await fetch(import.meta.env.VITE_APP_API + '/orders/closeAlert', {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(res)
    })
    const data = await response.json();
    return data;
}

const getPerfilFact = async () => {
    const token = await tokens()
    // let cookies = new Cookies()
    // const token2 = Cookies.getAll()
    // console.log("1", token);
    // console.log("2", Cookies.get());
    // console.log("3", token2['clientToken']);
    const res = await fetch(import.meta.env.VITE_APP_API + "/client/detail", {
        headers: {
            //TO DO: falta agarrar los coockis para obtener el valor del tocken
            "authorization": "bearer=" + token
        }
    })
    return res.json()
}
//@ts-ignore
const chagePassword = async (res: any) => {
    const token = await tokens()
    const response = await fetch(import.meta.env.VITE_APP_API + '/user/change/password', {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            "authorization": "bearer=" + token
        },
        method: "PATCH",
        body: JSON.stringify(res)
    })
    const data = await response.json();
    return data;
}

const getProductWithDiscountById = async ({ cantidad, id }: any) => {
    const res = await fetch(import.meta.env.VITE_APP_API + '/product_details/discount/' + id + "/" + cantidad)
    return res.json()
}

const getProductDetail = async ({ cantidad, id }: any) => {
    const res = await fetch(import.meta.env.VITE_APP_API + '/product_details/product_detail/' + id + "/" + cantidad)
    return res.json()
}

const getProductWithDiscount = async () => {
    const res = await fetch(import.meta.env.VITE_APP_API + '/product/discount')
    return res.json()
}

const getProductsByCategoryOrSearcher = async ({ where, key }: any) => {
    const api = where ? '/search/' : '/category/'
    const res = await fetch(import.meta.env.VITE_APP_API + '/product' + api + key)
    return res.json()
}
const getPedidosByIdClient = async () => {
    const token = await tokens()
    const res = await fetch(import.meta.env.VITE_APP_API + '/orders/tienda/online', {
        headers: {
            //falta agarrar los coockis para obtener el valor del tocken
            authorization: "bearer=" + token
        }
    })
    return res.json()
}

const orderById = async (idOrder: number) => {
    const res = await fetch(import.meta.env.VITE_APP_API + '/orders/orderid/' + idOrder)
    return res.json()
}
const readOrderDetailByOrderID = async (idclient: string) => {
    const res = await fetch(import.meta.env.VITE_APP_API + '/orders/detail/' + idclient)
    return res.json()
}

const ListSoporteByIdPerson = async () => {
    const token = await tokens()
    const res = await fetch(import.meta.env.VITE_APP_API + '/ticket/person', {
        headers: {
            //falta agarrar los coockis para obtener el valor del tocken
            authorization: "bearer=" + token
        }
    })
    const dat = await res.json()
    return dat
}

const OrederEdit = async ({ formData, idOrder }: { formData: FormData, idOrder: number }) => {
    return await fetch(import.meta.env.VITE_APP_API + '/orders/tienda/' + idOrder, {

        method: "PATCH",
        body: formData

    })
}

const CreateTicketTiendaOnlineWithImage = async (formData: FormData) => {
    const requestOptions = {
        method: 'POST',
        body: formData
    };
    const res = await fetch(import.meta.env.VITE_APP_API + '/evidence/image/', requestOptions)
    const data = await res.json()
    return data
}
const CreateTicketTiendaOnline = async (ticket: ClientCreateTicket) => {
    const token = await tokens()
    const requestOptions = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            authorization: "bearer=" + token
        },
        body: JSON.stringify(ticket)
    };
    const res = await fetch(import.meta.env.VITE_APP_API + '/ticket/tienda/online', requestOptions)
    const data = await res.json()
    return data
}
const createOrder = async (vals: any) => {
    const token = await tokens()
    const res = await fetch(import.meta.env.VITE_APP_API + '/orders/', {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            authorization: "bearer=" + token

        },
        method: "POST",
        body: JSON.stringify({ ...vals })

    })
    return res.json()
}
const templateActive = async () => {
    const res = await fetch(import.meta.env.VITE_APP_API + '/config')
    return res.json()
}
const tenProduct = async () => {
    const res = await fetch(import.meta.env.VITE_APP_API + '/product/tenProduct/')
    return res.json()
}
const sendEmailContactanos = async (mailData: any) => {
    const requestOptionsEmail = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mailData),
    };
    const resEmail = await fetch(
        import.meta.env.VITE_APP_API + "/mail/sendEmailContactanos/",
        requestOptionsEmail
    );
    return resEmail.json()
}

export {
    getProductWithDiscount,
    templateActive,
    tenProduct,
    chagePassword,
    getProductWithDiscountById,
    CreateTicketTiendaOnline,
    getCategories,
    getAllCategories,
    getProductsByCategoryOrSearcher,
    getPedidosByIdClient,
    getProductDetail,
    changeStatusOrder,
    createOrder,
    orderById,
    OrederEdit,
    editPerson,
    CreateTicketTiendaOnlineWithImage,
    getTypePerson,
    getPersonByIdUser,
    ListSoporteByIdPerson,
    getPerfilFact,
    sendEmailContactanos,
    readOrderDetailByOrderID,
    validationAlert,
    closeAlert
}