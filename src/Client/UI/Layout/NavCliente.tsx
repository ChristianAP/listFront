import { Box, Flex, Heading, Skeleton, Text } from "@chakra-ui/react";
import React from "react";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import { getPersonByIdUser } from "../../../Service/TiendaOnlineService";

export const NavCliente = () => {
    //getPersonByIdUser
    const { data, isLoading, isError } = useQuery('datanombre', () => getPersonByIdUser(), { refetchOnWindowFocus: false })

    if (isError && data.message) return <h1>Ocurrio algo inesperado</h1>;

    return (
        <>
            <Box p="5" m="8" rounded={16}>
                <Flex justifyContent="center">
                    <img style={{ width: "150px", borderRadius: "50%" }} src="https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-social-media-user-image-182145777.jpg" alt="" />
                </Flex>
                {isLoading ?
                    <Skeleton height="50px" />
                    :
                    <Heading textAlign="center" mb={6} fontSize="xl" alignItems="center">
                        {(data.PER_TRADENAME.length > 0) ? data.PER_TRADENAME : data.PER_NAME + " " + data.PER_LASTNAME}
                    </Heading>
                }

                <Flex gridGap="1" direction="column">
                    <Link to="/perfil"><Box _hover={{ bg: "gray.200" }} height="8" alignItems="center" display="flex" fontSize="xl"> Perfil </Box></Link>
                    <Link to="/pedidos"><Box _hover={{ bg: "gray.200" }} height="8" alignItems="center" display="flex" fontSize="xl"> Pedidos </Box></Link>
                    <Link to="/soporte"><Box _hover={{ bg: "gray.200" }} height="8" alignItems="center" display="flex" fontSize="xl"> Soporte </Box></Link>
                </Flex>
            </Box>

        </>)
}