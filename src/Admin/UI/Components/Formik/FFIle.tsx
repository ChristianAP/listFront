import { FormControl, FormErrorMessage, FormLabel } from '@chakra-ui/react'
import React from 'react'

export const FFIle = (props: any) => {

    const { touch, error, label, name, ...rest } = props

    return (
        // @ts-ignore
        <FormControl mb={6} isInvalid={touch && error}>
            <FormLabel htmlFor={name}>{label}</FormLabel>
            <input {...rest} />
            <FormErrorMessage>{error}</FormErrorMessage>
        </FormControl>
    )
}
