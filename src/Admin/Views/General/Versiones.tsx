import { Box, Center } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { getFileVersion } from "../../../Service/VersioningService";

export const VersionamientoInfo = () => {
    const [version, setVersion] = useState<any>([]);

    useEffect(() => {
        setVersion(getFileVersion);
    })
    return (<>
        <Center>
            <Box borderWidth='1px' borderRadius='lg' overflow='hidden' w={100} background={"white"}>
                <h1>Versiones</h1>
                <h2>{ version.length > 0 ? version.version : "asdasd" }</h2>
            </Box >
        </Center>
    </>)
}