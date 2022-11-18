
export const getReportDocumentsEmits = async () => {
    return await fetch(import.meta.env.VITE_APP_API + '/report/documents/emits').then(res => res.json())
}

export const getReportDocumentsEmitsVsPay = async () => {
    return await fetch(import.meta.env.VITE_APP_API + '/report/documents/payvsemit').then(res => res.json())
}

export const getReportSales = async () => {
    return await fetch(import.meta.env.VITE_APP_API + '/report/sales/earnings').then(res => res.json())
}

export const getHistoryReportSales = async () => {
    return await fetch(import.meta.env.VITE_APP_API + '/report/sales/sales').then(res => res.json())
}
