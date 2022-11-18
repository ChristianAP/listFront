import React from 'react'
import { useField } from 'formik'
import { FormControl, FormErrorMessage, FormLabel, Input } from '@chakra-ui/react'

export const FInput = (props: any) => {

    const { touch, error, label,name, ...rest } = props

    return (
        // @ts-ignore
        <FormControl mb={6} isInvalid={touch && error}>
            <FormLabel htmlFor={name}>{label}</FormLabel>
            <Input {...rest} />
            <FormErrorMessage>{error}</FormErrorMessage>
        </FormControl>
    )
}
