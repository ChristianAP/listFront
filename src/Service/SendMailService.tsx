export const SendMail = async (bodymail:any) => {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodymail)
    };
    const res = await fetch(import.meta.env.VITE_APP_API + '/mail/sendmailsaleonline/', requestOptions)
    const data = await res.json()
    return data
}

export const SendMailRejectedVoucher = async (bodymail:any) => {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodymail)
    };
    const res = await fetch(import.meta.env.VITE_APP_API + '/mail/rejectedvoucher/', requestOptions)
    const data = await res.json()
    return data
}