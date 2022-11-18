import {
    Box,
    Divider,
    Spacer,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper
} from "@chakra-ui/react";
import React from "react";

export const CalculadorTotal = (props: any) => {
    function CambiarTotal(val: string) {
        if (val == "") {
            val = "0";
        }
        props.SetDescuentoGeneral(parseFloat(val));
    }

    return (
        <Box display={"flex"} justifyContent="end" alignContent={'end'}>
            <Spacer />
            <Divider />
            <Spacer />
            <table >
                <tbody  >

                    <tr>
                        <th style={{ textAlign: 'right', paddingRight: '10px' }}>Total Bruto</th>
                        <td>{props.subtotalGeneral.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <th style={{ textAlign: 'right', paddingRight: '10px' }}>Descuento</th>
                        <td>
                            <NumberInput
                                size="xs"
                                min={0}
                                max={props.subtotalGeneral}
                                defaultValue={0}
                                onChange={(e: string) => {
                                    CambiarTotal(e);
                                }}
                            >
                                <NumberInputField />
                                <NumberInputStepper>
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                </NumberInputStepper>
                            </NumberInput>
                        </td>
                    </tr>
                    <tr>
                        <th style={{ textAlign: 'right', paddingRight: '10px' }}>IGV</th>
                        <td>{(props.totalIGV).toFixed(2)}</td>
                    </tr>
                    <tr>
                        <th style={{ textAlign: 'right', paddingRight: '10px' }}>Total a Pagar</th>
                        <td>{props.total.toFixed(2)}</td>
                    </tr>
                </tbody>

            </table>
        </Box>
    );
};
