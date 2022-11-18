import React, { useEffect } from 'react'
import { useSetRecoilState } from 'recoil';
import { HeaderClient, NavClient } from '../../../Data/Atoms/Client';

export const Categoria = () => {
    const setNavClient = useSetRecoilState(NavClient);
    const setHeadClient = useSetRecoilState(HeaderClient);
useEffect(() => {
        setNavClient(false)
        setHeadClient(true)
    }, [])
    return (
        <h1>CATEGORIA</h1>
    )
}