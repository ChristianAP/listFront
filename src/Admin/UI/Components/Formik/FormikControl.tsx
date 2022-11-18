import { Input, Select } from '@chakra-ui/react'
import React from 'react'
import { FFIle } from './FFIle'
import { FInput } from './FInput'

export const FormikControl = (props: any) => {
    const { control, ...rest } = props

    const vales = {
        input: () => <FInput {...rest} />,
        file: () => <FFIle {...rest} />,
        select: () => <Select {...rest} />,
        default: () => <h1>No existo</h1>
    }

    //return vales.[control] ? vales.[control]() : vales.default()
}
