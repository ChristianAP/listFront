import React, { useEffect } from 'react'

import { PromoTable } from './PromoTable';

export const Promocion = () => {
    useEffect(() => {
        //@ts-ignore
        document.getElementById('title_view').textContent = 'Promociones';
    }, [])
    return (
        <>
            <PromoTable />
        </>
    )
}
