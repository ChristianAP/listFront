import { AdminCreateTicket, NewMessageTicket, NewMessageTicketClient, TicketHistory} from "../Model/Tickets"

export const ListStatus = async () => {
    const res = await fetch(import.meta.env.VITE_APP_API + '/status_ticket/status/')
    const data = await res.json()
    return data
}

export const GetOneTicket = async (idTicket:number) => {
    const res = await fetch(import.meta.env.VITE_APP_API + '/ticket/getone/'+idTicket)
    const data = await res.json()
    return data
}

export const GetAllMessageOfTicket = async (idTicket:number) => {
    const res = await fetch(import.meta.env.VITE_APP_API + '/message/getbyticket/'+idTicket)
    const data = await res.json()
    return data
}

export const NewMessageOfTicket = async (message: NewMessageTicket) => {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(message)
    };
    const res = await fetch(import.meta.env.VITE_APP_API + '/message/', requestOptions)
    const data = await res.json()
    return data
}

export const NewMessageOfTicketClient = async (message: NewMessageTicketClient) => {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(message)
    };
    const res = await fetch(import.meta.env.VITE_APP_API + '/message/', requestOptions)
    const data = await res.json()
    return data
}

export const GetReportTicketCircular = async () => {
    const res = await fetch(import.meta.env.VITE_APP_API + '/ticket/getbyreport/reportcircular/')
    const data = await res.json()
    return data
}

export const GetReportTicketWeek = async () => {
    const res = await fetch(import.meta.env.VITE_APP_API + '/ticket/getbyreport/reportweek/')
    const data = await res.json()
    return data
}

export const GetReportTicketUser = async () => {
    const res = await fetch(import.meta.env.VITE_APP_API + '/ticket/getbyreport/reportuser/')
    const data = await res.json()
    return data
}

export const CreateTicket = async (ticket: AdminCreateTicket) => {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ticket)
    };
    const res = await fetch(import.meta.env.VITE_APP_API + '/ticket/', requestOptions)
    const data = await res.json()
    return data
}

export const CreateTicketHistory = async (ticket: TicketHistory) => {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ticket)
    };
    const res = await fetch(import.meta.env.VITE_APP_API + '/history_ticket/', requestOptions)
    const data = await res.json()
    return data
}


// @ts-ignore
export const updateStartHour = async (tck_id: any) => {
    return await fetch(import.meta.env.VITE_APP_API + '/ticket/viewhour/' + tck_id, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: "PATCH"
    })
}