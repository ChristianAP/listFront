export const getInfoVoucher = async (dataSend:any) => {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataSend)
    };
    const res = await fetch(import.meta.env.VITE_APP_API + '/voucher/', requestOptions)
    const data = await res.json()
    return data
}