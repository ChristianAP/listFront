import { Box } from '@chakra-ui/layout'
import React from 'react'
/* estilos categoria */
const eCenter = {
    display:"flex",
}

interface ITitleCenter {
    title: string
}
//@ts-ignore
export const TitleCenter = ({ title, ...props }) =>
    <Box style={eCenter} fontSize={{base:"1.2rem",md:"2rem"}} {...props}>
        <b>{title}</b>
    </Box>