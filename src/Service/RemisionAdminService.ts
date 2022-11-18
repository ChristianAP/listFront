
export const producstRemision = async (remision: number, categoria: number, lct : any) => {
    const res = await fetch(import.meta.env.VITE_APP_API + '/product/remission/' + remision + '/' + categoria + '/' +lct)
    const dat = await res.json()
    return dat
}

export const producstCategoria = async () => {
    const res = await fetch(import.meta.env.VITE_APP_API + '/category/tienda/active')
    const dat = await res.json()
    return dat
}

export const exportRemission = async (idexport: number) => {
    const res = await fetch(import.meta.env.VITE_APP_API + '/remission/export/' + idexport)
    const dat = await res.json()
    return dat
}

export const remissionList = async ({fechaIni, fechaFin} : {fechaIni : any, fechaFin : any}) => {
  
    const res = await fetch(import.meta.env.VITE_APP_API + '/remission/remFechas/'+fechaIni+'/'+fechaFin )
    const dat = await res.json()
    return dat
}

export const DocumentRemission = async () => {
    const res = await fetch(import.meta.env.VITE_APP_API + '/document_type/remision')
    const dat = await res.json()
    return dat
}

export const ProductByCode = async (codebar: string) => {
    const res = await fetch(import.meta.env.VITE_APP_API + '/product/code/' + codebar)
    const dat = await res.json()
    return dat
}

export const AgregarRemission = async (remission: any) => {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(remission)
    };
    const res = await fetch(import.meta.env.VITE_APP_API + '/remission/', requestOptions)
    const data = await res.json()
    return data
}

export const AgregarRemissionDetail = async (remission: any) => {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(remission)
    };
    const res = await fetch(import.meta.env.VITE_APP_API + '/remission_details/', requestOptions)
    const data = await res.json()
    return data
}

export const updateDocumentSequence = async ({ sequence, idDocument }: any) => {
    const requestOptions = {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
    };
    const res = await fetch(
        import.meta.env.VITE_APP_API + '/document/updateDocumentSequence/' + sequence + "/" + idDocument,
        requestOptions
    )
    const data = await res.json()
    return data
}

export const EditarRemission = async ({ remission, id }: { remission: any, id: number }) => {
    const requestOptions = {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(remission)
    };
    const res = await fetch(import.meta.env.VITE_APP_API + '/remission/' + id, requestOptions)
    const data = await res.json()
    return data
}

export const EditarRemissionDetail = async ({ remission, id }: { remission: any, id: number }) => {
    const requestOptions = {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(remission)
    };
    const res = await fetch(import.meta.env.VITE_APP_API + '/remission_details/' + id, requestOptions)
    const data = await res.json()
    return data
}