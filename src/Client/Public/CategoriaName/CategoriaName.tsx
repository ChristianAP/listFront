import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { HeaderClient, NavClient } from '../../../Data/Atoms/Client';
import { SearcherState } from '../../../Data/Atoms/Product';
import { ProductoComp } from '../../UI/Component/ProductoComp';

export const CategoriaName = () => {
    const setNavClient = useSetRecoilState(NavClient);
    const setSearcherState = useSetRecoilState(SearcherState)
    const setHeadClient = useSetRecoilState(HeaderClient);
useEffect(() => {
        setNavClient(false)
        setHeadClient(true)
    }, []);
    //@ts-ignore
    const { name } = useParams()
    const nameCategory = (name as string).replace('-', ' ');
    setSearcherState({ where: false, key: nameCategory })
    return (
        <ProductoComp searcher={nameCategory} where="categoria" />
    )
}
