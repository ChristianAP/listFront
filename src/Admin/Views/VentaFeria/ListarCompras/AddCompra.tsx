import { Button, IconButton } from "@chakra-ui/button";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { Box, Divider, Flex, Spacer, Text } from "@chakra-ui/layout";
import {
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from "@chakra-ui/number-input";
import { Skeleton } from "@chakra-ui/skeleton";
import React, { useEffect, useState } from "react";
import { AiFillDelete, AiOutlineSearch } from "react-icons/ai";
import { useQuery } from "react-query";
import { MyReactTable } from "../../../../GlobalUI/Table/MyReactTable";
import {
  createProductByDocumentAndStock,
  getProductsStocks,
  getProductswithTDandCat,
} from "../../../../Service/ProductAdminService";
import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteItem,
  AutoCompleteList,
} from "@choc-ui/chakra-autocomplete";
import { useToast } from "@chakra-ui/react";

import { FcMoneyTransfer } from "react-icons/fc";
interface ProductoCompra {
  ID: string;
  NAME: string;
  CANTIDAD: string;
  PRECIO: string;
  TOTAL: number;
  TYPE: string;
}

export const AddCompra = ({
  sincomprobante,
  datosDocumento,
  completeAllValues,
  esperandoRespuesta,
  setEsperandoRespuesta,
  closeModal,
}: {
  sincomprobante?: boolean;
  completeAllValues?: boolean;
  datosDocumento?: any;
  esperandoRespuesta?: any;
  setEsperandoRespuesta?: any;
  closeModal?: any;
}) => {
  const { data, isLoading, isError } = useQuery(
    "producstStock",
    getProductsStocks
  );

  const [form, setForm] = useState({
    prod: { ID: "", NAME: "" },
    cantidad: "1",
    precio: "",
    type: "1",
  });

  const [total, setTotal] = useState(0);

  const [prods, setProds] = useState<ProductoCompra[]>([]);
  const toast = useToast();

  function handleClick() {
    let newProd = {
      ID: form.prod.ID,
      NAME: form.prod.NAME,
      CANTIDAD: form.cantidad,
      PRECIO: form.precio,
      TOTAL: Number(form.cantidad) * Number(form.precio),
      TYPE: form.type,
    };
    if (
      !prods.some(
        (val) => val.ID === newProd.ID && val.PRECIO === newProd.PRECIO
      )
    ) {
      setProds([
        ...prods,
        {
          ID: form.prod.ID,
          NAME: form.prod.NAME,
          CANTIDAD: form.cantidad,
          PRECIO: form.precio,
          TOTAL: Number(form.cantidad) * Number(form.precio),
          TYPE: form.type,
        },
      ]);
    } else {
      setProds((old) =>
        old.map((val) => {
          return {
            ...val,
            CANTIDAD:
              val.ID === newProd.ID && val.PRECIO === newProd.PRECIO
                ? (
                    parseInt(val.CANTIDAD) + parseInt(newProd.CANTIDAD)
                  ).toString()
                : val.CANTIDAD,
          };
        })
      );
    }
  }

  useEffect(() => {
    let suma = 0.0;
    // @ts-ignore
    prods.map((val) => {
      suma = Number(String(Number(val.PRECIO) * Number(val.CANTIDAD))) + suma;
    });
    setTotal(suma);
  }, [prods]);

  async function addProducts(dataProducts: any) {
    setEsperandoRespuesta(true);

    datosDocumento.DOC_SUB_SUBTOTAL = total;
    datosDocumento.DOC_SUBTOTAL = total;
    datosDocumento.DOC_NETO = total;

    if (sincomprobante !== true) {
      const totalDataEnviar = {
        documento: datosDocumento,
        productos: dataProducts,
      };
      var res = await createProductByDocumentAndStock(totalDataEnviar);
      if (res.status == 500) {
        toast({
          title: "Error al registrar productos.",
          description: res.message + ", Porfavor intentelo mas tarde.",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
        closeModal();
        setEsperandoRespuesta(false);
      } else {
        toast({
          title: "Registro exitoso.",
          description: res.message,
          status: "success",
          duration: 9000,
          isClosable: true,
        });
        closeModal();
        setEsperandoRespuesta(false);
      }
    }
  }

  if (isLoading) return <Skeleton />;

  return (
    <>
      <Box w="100%">
        <Text fontSize="lg" fontWeight="bold">
          Agregar producto
        </Text>

        <Flex borderRadius="5px" borderWidth="2px" p="5px">
          <Box>
            <Text fontSize="md" fontWeight="medium">
              Producto
            </Text>
            <AutoComplete rollNavigation>
              <InputGroup>
                <AutoCompleteInput
                  variant="filled"
                  placeholder="Buscar producto"
                  autoFocus
                  isDisabled={completeAllValues}
                  // @ts-ignore
                  onChange={(e) => setForm({ ...form, prod: e.target.value })}
                />
                <InputRightElement
                  children={<AiOutlineSearch color="gray.300" />}
                />
              </InputGroup>
              <AutoCompleteList>
                {/* @ts-ignore */}
                {data
                  .map((val: any) => {
                    let prod = {
                      ID: val.PRO_ID.toString(),
                      NAME: val.PRO_NAME,
                    };
                    return prod;
                    // @ts-ignore
                  })
                  .map((option: any, oid: any) => (
                    <AutoCompleteItem
                      key={`option-${oid}`}
                      value={option}
                      label={option.NAME}
                      textTransform="capitalize"
                      // @ts-ignore
                      onClick={() => setForm({ ...form, prod: option })}>
                      {option.NAME}
                    </AutoCompleteItem>
                  ))}
              </AutoCompleteList>
            </AutoComplete>
          </Box>
          <Spacer />
          <Box>
            <Text fontSize="md" fontWeight="medium">
              Cantidad
            </Text>
            {/* @ts-ignore */}
            <NumberInput
              isDisabled={completeAllValues}
              min={1}
              defaultValue={1}
              onChange={(e) => setForm({ ...form, cantidad: e })}>
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </Box>
          <Spacer />
          <Box>
            <Text fontSize="md" fontWeight="medium">
              Precio unitario
            </Text>
            <InputGroup>
              {/* @ts-ignore */}
              <Input
                isDisabled={completeAllValues}
                type="number"
                placeholder="Ingrese precio unitario"
                min={1}
                onChange={(e) => setForm({ ...form, precio: e.target.value })}
              />
              <InputRightElement children={<FcMoneyTransfer />} />
            </InputGroup>
          </Box>
          <Spacer />
          <Box>
            <br />
            <Button
              colorScheme="green"
              onClick={handleClick}
              isDisabled={esperandoRespuesta}
              isLoading={esperandoRespuesta}
              disabled={
                form.prod.NAME != "" && Number(form.precio) > 0 ? false : true
              }>
              Agregar Producto
            </Button>
          </Box>
        </Flex>
        <Divider />
        <CompraTable prods={prods} setProds={setProds} />
        <Flex direction="column">
          <Text float="right" mr="40%" fontWeight={500}>
            Total de la compra: s./ {total}
          </Text>
        </Flex>
        <Flex direction="row-reverse">
          <Button
            onClick={() => addProducts(prods)}
            type="submit"
            isLoading={esperandoRespuesta}
            isDisabled={esperandoRespuesta}
            colorScheme="green"
            visibility={prods.length > 0 ? "visible" : "hidden"}
            mr={3}>
            Añadir Productos
          </Button>
        </Flex>
      </Box>
    </>
  );
};

const CompraTable = ({
  prods,
  setProds,
}: {
  prods: any;
  setProds: any;
}) => {
  const [skipPageReset, setSkipPageReset] = useState(false);

  const columns = [
    {
      Header: "Nombre",
      accessor: "NAME",
    },
    {
      Header: "Cantidad",
      accessor: "CANTIDAD",
    },
    {
      Header: "Precio Unitario",
      accessor: "PRECIO",
    },
    {
      Header: "",
      id: "remove_action",
      // @ts-ignore
      Cell: ({ row }) => {
        return (
          <IconButton
            colorScheme="red"
            aria-label="Search database"
            icon={<AiFillDelete />}
            onClick={() => updateMyData(row)}
          />
        );
      },
    },
  ];

  function updateMyData(row: any) {
    setSkipPageReset(true);
    // @ts-ignore
    setProds((old: any) => {
      // @ts-ignore
      return old.filter((val) => val.ID !== row.original.ID);
    });
  }

  useEffect(() => {
    setSkipPageReset(false);
  }, [prods]);

  return (
    <>
      <MyReactTable
        columns={columns}
        data={prods}
        skipPageReset={skipPageReset}
        updateMyData={updateMyData}
      />
    </>
  );
};
