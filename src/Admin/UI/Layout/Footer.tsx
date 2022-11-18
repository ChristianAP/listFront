import { useColorModeValue, VStack } from '@chakra-ui/react'
import React from 'react'

export const Footer = () => {

    const NavBackground = useColorModeValue("gray.100", "gray.700")

    return (
        <VStack
            width="full"
            height="1.5rem"
            bg={NavBackground}
        >
            <h1>Footer</h1>
        </VStack>
    )
}
