import { IconButton, Tooltip } from "@chakra-ui/react"
import { IoReload } from "react-icons/io5"
import React from "react";

export const ButtonRefetch = ({ refetch }: { refetch: any }) => {
    return (
        <><Tooltip label='Actualizar'>
            <IconButton m="2" onClick={ () => refetch() } aria-label="Recargar" icon={ <IoReload /> } />
            </Tooltip>
        </>
    )
}
