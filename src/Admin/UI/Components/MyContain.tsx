import { Box, useColorModeValue, VStack } from '@chakra-ui/react'
import React, { ReactNode } from 'react'
//@ts-ignore
export const MyContain = ({ children, ...props  }) => {
    return (
        <Box {...props} boxShadow="md" overflowX={"auto"} p={3} bg={useColorModeValue('white', 'gray.800')} borderRadius="md" alignItems="start" justifyContent="center">
            {children}
        </Box>
    )
}
