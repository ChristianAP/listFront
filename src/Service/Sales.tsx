import { getOrdenSteps } from "./OrderSteps";

export const ListSalesOnline = async ({ fechaIni, fechaFin }: { fechaIni: string, fechaFin: string }) => {
  const res = await fetch(import.meta.env.VITE_APP_API + "/sales/salesonline/" + fechaIni + "/" + fechaFin);
  const data = await res.json();
  return data;
};

export const ExportOrders = async ({ fechaIni, fechaFin }: { fechaIni: string, fechaFin: string }) => {
  const res = await fetch(import.meta.env.VITE_APP_API + "/orders/export/" + fechaIni + "/" + fechaFin);
  const data = await res.json();
  return data;
};

export const ListProductsSalesOnline = async (idOrder: any) => {
  const res = await fetch(
    import.meta.env.VITE_APP_API + "/sales/productssalesonline/" + idOrder
  );
  const data = await res.json();
  return data;
};

export const VerifyVoucherOrder = async (
  idOrder: any,
  idVenta: any,
  check: any,
  idUser: any,
) => {
  let a = await getOrdenSteps()
  const requestOptions = {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ORD_APPROVAL: check, ORD_APPROVAL_USER: idUser, ORD_ID_VENTA: idVenta, ORD_STATUS: check == 1 ? a[1].ORS_ID : 1 }),
  };
  const res = await fetch(
    import.meta.env.VITE_APP_API + "/sales/verifyvoucher/" + idOrder,
    requestOptions
  );
  const data = await res.json();
  return data;
};

export const getDocumentForSaleOnline = async (id: number) => {
  const res = await fetch(import.meta.env.VITE_APP_API + "/document_type/" + id);
  const data = await res.json();
  return data;
};

// @ts-ignore
export const deleteOrder = async (ORD_ID) => {
  return await fetch(import.meta.env.VITE_APP_API + '/orders/' + ORD_ID, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: "DELETE",
  })
}

export const documentDelete = async (obj : any) => {
  return await fetch(import.meta.env.VITE_APP_API + '/sales/deleteDocument/' + obj.DOC_ID, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: "PATCH",
    body: JSON.stringify(obj)
  })
}

//Cabiar el estado de la Orden
//@ts-ignore
// export const ChangeOrderState = async ({ ORD_ID, ORD_STATUS, nombre, correo }) => {
//   const requestOptions = {
//     method: "PATCH",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ ORD_STATUS: ORD_STATUS }),
//   };
//   const res = await fetch(
//     import.meta.env.VITE_APP_API + "/orders/changestatus/" + ORD_ID,
//     requestOptions
//   );
//   const estados = [{
//     idestado: 1,
//     nombre: "registrado"
//   }, {
//     idestado: 2,
//     nombre: "confirmado"
//   }, {
//     idestado: 3,
//     nombre: "en proceso de envio"
//   }, {
//     idestado: 4,
//     nombre: "entregado"
//   }]
//   const requestOptionsEmail = {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ estadoOrden: estados.filter((val) => val.idestado == ORD_STATUS)[0].nombre, nombre: correo, correo: nombre }),
//   };
//   const resEmail = await fetch(
//     import.meta.env.VITE_APP_API + "/mail/orderUpdate",
//     requestOptionsEmail
//   );

//   const data = await res.json();
//   return data;
// };

export const ChangeOrderState = async (venta : any) => {
  const requestOptions = {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ORD_STATUS: venta.ESTADO }),
  };
  const res = await fetch(
    import.meta.env.VITE_APP_API + "/orders/changestatus/" + venta.ORD_ID,
    requestOptions
  );
  const estados = [{
    idestado: 1,
    nombre: "registrado"
  }, {
    idestado: 2,
    nombre: "confirmado"
  }, {
    idestado: 3,
    nombre: "en proceso de envio"
  }, {
    idestado: 4,
    nombre: "entregado"
  }]
  const requestOptionsEmail = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    // body: JSON.stringify({ estadoOrden: estados.filter((val) => val.idestado == ORD_STATUS)[0].nombre, nombre: correo, correo: nombre }),
    body: JSON.stringify(venta),
  };
  const resEmail = await fetch(
    import.meta.env.VITE_APP_API + "/mail/sendmailsaleonline",
    requestOptionsEmail
  );

  const data = await res.json();
  return data;
};

//@ts-ignore
export const ChangeStatePay = async ({ DOC_ID, DOC_ESTADO, DOC_DATE_PAGO }) => {
  const requestOptions = {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      DOC_ESTADO: DOC_ESTADO,
      DOC_DATE_PAGO: DOC_DATE_PAGO,
    }),
  };
  const res = await fetch(
    import.meta.env.VITE_APP_API + "/document/" + DOC_ID,
    requestOptions
  );
  const data = await res.json();
  return data;
};

export const getConfiguracionImpresion = async () => {
  const res = await fetch(import.meta.env.VITE_APP_API + "/config"); //falta
  return res.json();
};

export const getDataPago = async (id: any) => {
  try {
    return await fetch(import.meta.env.VITE_APP_API + "/person/identidad/" + id).then(res => res.json());
  } catch (Error) {
    return {
      error: Error,
    };
  }
}