import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useSetRecoilState } from 'recoil'
import { HeaderClient, NavClient } from '../../../Data/Atoms/Client'
import { SearcherState } from '../../../Data/Atoms/Product'
import { ProductoComp } from '../../UI/Component/ProductoComp'

export const Buscador = () => {
    const setNavClient = useSetRecoilState(NavClient);
    const setSearcherState = useSetRecoilState(SearcherState);
    const setHeadClient = useSetRecoilState(HeaderClient);
    //@ts-ignore
    const { buscador } = useParams()
    useEffect(() => {
        setSearcherState({ where: true, key: buscador })
        setNavClient(false)
        setHeadClient(true)
    }, [])

    return (
        <ProductoComp where="producto" searcher={buscador} />
    )
}
