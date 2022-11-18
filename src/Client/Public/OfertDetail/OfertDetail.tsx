import React, { useEffect } from 'react'
import { useQuery } from 'react-query'
import { useParams } from 'react-router-dom'
import { useSetRecoilState } from 'recoil'
import { HeaderClient, NavClient } from '../../../Data/Atoms/Client'
import { ProductoDetail } from '../../UI/Component/ProductoComp'

export const Ofert = () => {
    const setNavClient = useSetRecoilState(NavClient);
    const setHeadClient = useSetRecoilState(HeaderClient);
    useEffect(() => {
        setNavClient(false)
        setHeadClient(true)
    }, [])
    //@ts-ignore
    const { id } = useParams();

    return (
        <ProductoDetail id={id} where="ofert" />
    )
}
