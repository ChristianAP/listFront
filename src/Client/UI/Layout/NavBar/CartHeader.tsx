import { Button, IconButton } from '@chakra-ui/button'
import React, { useEffect } from 'react'
import { BiCart } from 'react-icons/bi'
import { Link } from 'react-router-dom'
import { useRecoilValue } from 'recoil';
import { CarritoState, filteredTodoListState } from "../../../../Data/Atoms/Carrito";

export const CartHeader = () => {
    const carritoTamano = useRecoilValue(filteredTodoListState);

    return (
        <Link to="/carrito">
            {carritoTamano != 0 ?
                <Button leftIcon={<BiCart />} size="lg" variant="outline">
                    {carritoTamano}
                </Button>
                :
                <IconButton
                    as={Button}
                    size="lg"
                    variant="ghost"
                    aria-label="open menu"
                    colorScheme="green"
                    icon={<BiCart />}
                />}
        </Link>
    )
}
