import { Box, Flex, Image, Button, Stack, Skeleton, useToast } from '@chakra-ui/react'
import React, { useState, useEffect } from 'react'
import { BiSave } from 'react-icons/bi'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { updateConfigTemplate } from '../../../../Service/ConfigAdminService'
import { getTemplates } from '../../../../Service/TemplateAdminService'
import { templateActive } from '../../../../Service/TiendaOnlineService'
import { MyContain } from '../../../UI/Components/MyContain'
import './Impresora.css'
export const Impresora = () => {
    const clientQuery = useQueryClient()
    const { data, isLoading, isError, isFetching } = useQuery('templates', getTemplates, { refetchOnWindowFocus: false })
    const { data: dataTemp, isLoading: loadingTemp, isError: errorTemp, isFetching: fechingTemp } = useQuery('tempActive', templateActive, { refetchOnWindowFocus: false })

    const toast = useToast()
    const { mutate } = useMutation(updateConfigTemplate, {
        onSuccess: () => {
            //clientQuery.invalidateQueries('templates');
            toast({
                title: "Cambio de impresión realizado ",
                description: "La impresión en realizar venta y en listar venta fueron cambiadas",
                status: "success",
                duration: 4000,
                isClosable: true,
            })
        },
        onError: () => {
            alert("Error inesperado")
        }
    })
    const [save, setSave] = useState(true)
    const [idTemplate, setIdTemplate] = useState(0)
    const [value, setValue] = useState("https://img.yumpu.com/6058939/1/500x640/comprobante-de-pago-nuevopdf-ceisladelosmilagros.jpg")
    function updateTemplate() {
        mutate(idTemplate);

    }
    /* if (isLoading || isFetching) return (
        <Stack>
            <Skeleton height="150px" />
            <Skeleton height="150px" />
        </Stack>
    ) */
    // @ts-ignore
    if (isError || errorTemp) return <h1>{ error.message } { ':(' }</h1>

    useEffect(() => {
        //@ts-ignore
        document.getElementById('title_view').textContent = 'Impresora';
    }, [])

    return (
        <Flex gridGap="10px" flexDirection={ { base: "column", md: "row" } }>
            <Box flex="6">
                <MyContain>
                    <Flex direction="column" gridGap="4">
                        { isLoading || isFetching || loadingTemp || fechingTemp ?
                            <Stack>
                                <Skeleton height="150px" />
                                <Skeleton height="150px" />
                            </Stack> :
                            <>
                                { data.map((val: any, idx: number) => <div key={ idx }>
                                    <input defaultChecked={ (dataTemp && (dataTemp[0].TEM_ID == val.TEM_ID)) } className="input_radio" onChange={ (e) => { setSave(false); setValue(val.TEM_IMG); setIdTemplate(val.TEM_ID) } } value={ val.TEM_ID } type="radio" id={ val.TEM_ID + "impresora" } name="type_impresora" />
                                    <label className="label_radio" htmlFor={ val.TEM_ID + "impresora" }>
                                        <Box>
                                            <h1 style={ { fontSize: "2em" } }>{ val.TEM_NAME }</h1>
                                            <h3 style={ { fontSize: "1.2em" } }>{ val.TEM_DESCRIPTION }</h3>
                                        </Box>
                                    </label>
                                </div>) }
                            </>
                        }

                    </Flex>
                </MyContain>
            </Box>
            <Box flex="6">
                <MyContain>
                    <Box height={ { base: "fit-content", md: "70vh" } } overflowY="scroll" overflowX="hidden">
                        <Image w="100%" src={ value }></Image>
                    </Box>
                    <Button onClick={ () => { updateTemplate() } } disabled={ save } my="4" w="100%" leftIcon={ <BiSave /> } colorScheme="teal" bg={"#0080ff"} variant="solid">
                        Guardar Preferencia
                    </Button>
                </MyContain>
            </Box>
        </Flex>
    )
}