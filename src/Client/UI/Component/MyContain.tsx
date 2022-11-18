import { Box, useColorModeValue, VStack } from '@chakra-ui/react'
import React, { ReactNode } from 'react'

export const MyContain = ({ children }: { children: ReactNode }) => {
    const MyContainBG = useColorModeValue('white', 'gray.800');
    return (
        <Box m="1" width={{base:"100%",md:"800px"}} p={3} bg={MyContainBG} borderRadius="md" alignItems="start" >
            {children}
        </Box>
    )
}
