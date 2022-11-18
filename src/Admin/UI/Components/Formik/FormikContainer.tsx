import { Button } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import React from 'react'
import * as Yup from 'yup';

export const FormikContainer = () => {

    const initialValues = {}
    const validationSchema = Yup.object({})
    // const onSubmit = values => console.log("auuu")

    return (
        <h1>hola</h1>
    )
}
