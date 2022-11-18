import {
  IconButton,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Tooltip,
  Stack,
} from "@chakra-ui/react";
import { MyTable } from "./../../../UI/Components/MyTable/Mytable";
import { AiFillDelete } from "react-icons/ai";
import { MyContain } from "../../../UI/Components/MyContain";
import React, { useEffect } from "react";
import "./InputSearch.css";
import {
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";
import ReactDOM from "react-dom";

export const VentaTable = (props: any) => {
  props.updateTotal();
  props.cambioVuelto();
  const updateVistaDescripcion = (producto: any) => {
    const newProductos = props.vistaDescripcion.map((prod: any) => {
      if (prod.PRD_ID == producto.PRD_ID) {
        prod = producto;
      }
      return prod;
    });
    props.SetVistaDescripcion(newProductos);
  };
  const deleteVistaDescripcion = (producto: any) => {
    let ubicacion: number = -1;
    props.vistaDescripcion.map((prod: any, idx: number) => {
      if (prod.PRD_ID == producto.PRD_ID) {
        ubicacion = idx;
      }
    });
    if (props.vistaDescripcion.length == 1) {
      props.SetDescuentoGeneral(0);
    }
    let newProducts = props.vistaDescripcion.map((prod: any) => {
      return prod;
    });
    if (ubicacion > -1) {
      newProducts.splice(ubicacion, 1);
    }
    props.SetVistaDescripcion(newProducts);
  };
  const updateDataTableDescripcion = (
    e: any,
    product: any,
    padre: any,
    tipo: string,
    tipoDato: string
  ) => {
    e.preventDefault();
    let valor = e.target.dato.value;
    if (tipoDato == "number") {
      valor = parseFloat(valor);
    }
    const newProduct = product;
    newProduct[tipo] = valor;
    newProduct.subtotal = (newProduct.precio) * product.cantidad;
    newProduct.total = newProduct.subtotal - newProduct.descuento;
    updateVistaDescripcion(newProduct);

    const element = (
      <p
        onDoubleClick={(e) => {
          handleClickDescripcion(e, newProduct, tipo, tipoDato);
        }}
      >
        {product[tipo]}
      </p>
    );
    ReactDOM.render(element, padre);
  };
  const handleClickDescripcion = (
    e: any,
    product: any,
    tipo: string,
    tipoDato: string
  ) => {
    let boxs = e.target.parentNode;
    const element = (
      <form
        onSubmit={(e) => {
          updateDataTableDescripcion(e, product, boxs, tipo, tipoDato);
        }}
      >
        <input
          type={tipoDato}
          name="dato"
          className="input-cambio"
          defaultValue={product[tipo]}
          min="0"
          step="any"
        />
      </form>
    );
    ReactDOM.render(element, boxs);
  };


  return (
    <MyContain>
      <MyTable size="sm" variant="striped">
        <Thead>
          <Tr>
            <Th>Descripción</Th>
            <Th>Precio Unitario</Th>
            <Th>Cantidad</Th>
            <Th>Subtotal</Th>
            <Th>Descuento</Th>
            <Th>Total</Th>
            <Th>Borrar</Th>
          </Tr>
        </Thead>
        <Tbody>
          {props.vistaDescripcion.length > 0 &&
            props.vistaDescripcion.map((product: any, idx: number) => {
              return (
                <Tr key={product.PRD_ID +'_'+idx}>
                  <Td> {product.PRO_NAME}</Td>
                  <Td> {product.precio} </Td>
                  <Td>
                    <NumberInput
                      size="xs"
                      precision={3}
                      step={0.5}
                      value={product.cantidad}
                      min={0}
                      max={product.stock}
                      onChange={(e:any) => {
                        let nuevo = e;
                        let nuevoProducto = product;
                        nuevoProducto.cantidad = nuevo;
                        nuevoProducto.subtotal =
                          (product.precio) * product.cantidad;
                        if (product.DIS_PERCENTAGE != null) {
                          nuevoProducto.descuento =
                            (nuevoProducto.subtotal / 1.18) *
                            parseFloat(product.DIS_PERCENTAGE) *
                            0.01 *
                            1.18;
                        }
                        nuevoProducto.total =
                          nuevoProducto.subtotal - nuevoProducto.descuento;

                        updateVistaDescripcion(nuevoProducto);
                      }}
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </Td>
                  <Td>{product.subtotal.toFixed(2)}</Td>

                  <Td> {product.descuento.toFixed(2)} </Td>
                  <Td>{product.total.toFixed(2)}</Td>
                  <Td>
                    <Stack
                      direction={{
                        base: "column",
                        md: "column",
                        xl: "row",
                      }}
                    >
                      <IconButton
                        size="xs"
                        icon={<AiFillDelete />}
                        aria-label="Eliminar"
                        colorScheme="red"
                        onClick={() => {
                          deleteVistaDescripcion(product);
                        }}
                      />
                    </Stack>
                  </Td>
                </Tr>
              );
            })}
        </Tbody>
      </MyTable>
    </MyContain>
  );
};
