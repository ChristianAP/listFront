import {
    Button, Grid, Flex, Box, Spacer, Select, Stack, Skeleton,
    FormControl, FormLabel, InputGroup, InputLeftElement, Input,
    NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper,
    NumberDecrementStepper
} from '@chakra-ui/react'
import { Formik } from 'formik'
import React, { useEffect, useState } from 'react'
import { BsBag } from 'react-icons/bs'
import { FaCashRegister, FaPlus } from 'react-icons/fa'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { ProductSearchSelect } from "../../../../GlobalUI/Forms/ProviderSearchSelect";
import { IDicount, IDicountDetail } from '../../../../Model/Discount'
import { getCategories } from '../../../../Service/CategoryAdminService'
import { createDiscount, getProductWithCategoryOrProduct } from '../../../../Service/DescuentoAdminService'
import { MyContain } from '../../../UI/Components/MyContain'
import { DescDetailTable, DescTable } from './DescTable'

export const Descuento = ({ online }: { online: boolean }) => {
    const { isLoading, data, isFetching } = useQuery('categories', getCategories, { refetchOnWindowFocus: false })
    const [searcher, setSearcher] = useState({ where: "cat", searcher: "no", online: online })
    const producto = useQuery(['productosSearch', searcher], () => getProductWithCategoryOrProduct(searcher), { refetchOnWindowFocus: false })
    const [porcentage, setPorcentage] = useState(15)
    const queryClient = useQueryClient()

    useEffect(() => {
        //@ts-ignore
        document.getElementById('title_view').textContent = 'Descuentos';
    }, [])

    const { mutate } = useMutation(createDiscount, {
        onSuccess: (res) => {
            if (res.status == 500) {
                throw new Error("error intentar mas adelante");
            }
            queryClient.invalidateQueries('discounts')
        },
        onError: () => alert("error intentarlo luego")
    })
    const [addstate, setAddstate] = useState(false)
    const [choosed, setChoosed] = useState("")
    const [pro, setPro] = useState<any>("")
    const [prod, setProd] = useState<any>({})
    const [product, setProduct] = useState<any[]>([])
    //setSearch

    if (isLoading || isFetching) return (
        <Stack>
            <Skeleton height="70px" />
        </Stack>
    )
    function getIdCategory(event: any) {
        setSearcher({ ...searcher, where: "cat", searcher: event.target.value })
    }
    function getCodeProduct(event: any) {
        console.log(event)
        setPro(event)
        /*  setAddstate(true) */
        if (event != "") {
            setChoosed(event)
            setSearcher({ ...searcher, where: "pro", searcher: event })
        }
    }
    function addProduct() {
        console.log(prod);

        setProd({})
        setProduct([...product, producto.data.filter((val: any) => val.PRO_ID === prod.PRO_ID)[0]])
    }
    function addDiscount() {
        const discount: IDicount =
        {
            DIS_NAME: "Descuento de " + porcentage + "%",
            DIS_DESCRIPTION: "Descuento de " + porcentage + "%",
            DIS_AMOUNT: "2",
            DIS_PERCENTAGE: "" + porcentage,
            DIS_START_DATE: "string",
            DIS_END_DATE: "string",
            DIS_STATUS: "1",
            DIS_ONLINE: !online ? "0" : "1"
        }

        var discounts_detail: IDicountDetail[] = [];
        product.map((val, idx) => {
            var order_detail: IDicountDetail = {
                DIS_ID: null,
                PRO_ID: val.PRO_ID
            }
            discounts_detail.push(order_detail)
        })
        setProduct([])
        console.log(discount);
        mutate({ discount: { ...discount }, discounts_detail });
    }
    console.log(pro.PRO_BARCODE);

    return (
        <Grid gap="1rem">
            <MyContain>
                <Flex gridGap="1rem" alignItems="center" flexDirection={{ base: "column", md: "row" }}>
                    <FormLabel htmlFor="producto" width={{ base: "90%", md: "30%" }}>Insumo

                        {/* <InputGroup>
                            <InputLeftElement
                                pointerEvents="none"
                                children={<BsBag />}
                            />
                            <Input onChange={getCodeProduct} autoComplete={"off"} id="producto" placeholder="Ingrese Código o nombre" list="datalist-prod" />

                        </InputGroup> */}

                        <Formik initialValues={{}} onSubmit={() => undefined}>
                            <ProductSearchSelect
                                loading={producto.isLoading}
                                //@ts-ignore
                                data={producto.data}
                                product={product}
                                label="Cliente"
                                setPro={getCodeProduct}
                                pro={pro}
                                // @ts-ignore
                                itemClick={(option, func) => {
                                    getCodeProduct(option.PRO_BARCODE)
                                    setProd(option)
                                    //console.log(option);
                                }}
                                placeholder="Buscar Insumo"
                                name="search"
                                id="search"
                            />
                        </Formik>

                    </FormLabel>
                    <FormLabel htmlFor="categoria" width={{ base: "90%", md: "30%" }}>Categoría
                        <Select id="categoria" onChange={getIdCategory}>
                            {data.map((category: any, idx: any) =>
                                <option value={category.CAT_ID}> {category.CAT_NAME}</option>
                            )}
                        </Select>
                    </FormLabel>

                    <Spacer />
                    <Button width={{ base: "90%", md: "30%" }} disabled={(prod.PRO_BARCODE) ? false : true} onClick={addProduct} leftIcon={<FaPlus />} colorScheme="green" >Agregar</Button>
                </Flex>
            </MyContain>
            {((product.length) > 0) && <Flex gridGap="1rem" alignItems="center" flexDirection={{ base: "column", md: "row" }}>
                <Box flex="6">
                    <MyContain>
                        {/* JSON.stringify(product) */}
                        <DescDetailTable data={product} setProduct={setProduct} />
                    </MyContain>
                </Box>
                <Box flex={{ base: "6", md: "4" }}>
                    <MyContain>
                        <Box padding="4">{/*onChange={(valueString) =>*/}
                            <FormLabel w="100%" htmlFor="cantidad" width="30%">Descuento del (%)</FormLabel>
                            {/* @ts-ignore */}
                            <NumberInput size="lg" w="100%" onChange={(valueString) => setPorcentage(valueString)} min={0} max={100} id="cantidad" defaultValue={15}>
                                <NumberInputField />
                                <NumberInputStepper>
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                </NumberInputStepper>
                            </NumberInput>
                            <Button disabled={!((product.length) > 0)} onClick={addDiscount} w="100%" p="4" my="5" rightIcon={<FaCashRegister />} colorScheme="teal" variant="solid">
                                Registrar
                            </Button>
                        </Box>
                    </MyContain>
                </Box>
            </Flex>}
            <MyContain>
                <DescTable online={online} />
            </MyContain>
        </Grid>
    )
}
