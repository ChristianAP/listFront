import { Box, Grid, HStack } from '@chakra-ui/react'
import React from 'react'

interface IMain {
    children: JSX.Element
}
export const Main = ({ children }: IMain) => {
    return (
        <Box
            h="full"
            w="1"
            bg="blue"
        >
            {children}
        </Box>
    )
}
