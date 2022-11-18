import { IconButton, Text } from "@chakra-ui/react"
import { IoReload } from "react-icons/io5"
import React from "react";
import { MyContain } from "./MyContain";

export const TablaSinDatos = ({ message }: { message: string }) => {
    return (
        <>
            <MyContain>
                <Text align="center"
                    //@ts-ignore
                    size="xl">
                        { message }
                </Text>
            </MyContain>
        </>
    )
}
