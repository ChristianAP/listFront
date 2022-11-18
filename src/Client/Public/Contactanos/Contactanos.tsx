import { Button } from '@chakra-ui/button';
import { Input } from '@chakra-ui/input';
import { Box, List, ListItem, ListIcon, Flex } from '@chakra-ui/layout';
import { useToast } from '@chakra-ui/react';
import React, { useEffect } from 'react'
import { AiFillInstagram } from 'react-icons/ai';
import { FaFacebookF, FaWhatsapp } from 'react-icons/fa';
import { FiMail, FiMapPin } from 'react-icons/fi';
import { MdCall, MdPlace } from 'react-icons/md';
import { useSetRecoilState } from 'recoil';
import { HeaderClient, NavClient } from '../../../Data/Atoms/Client';
import { sendEmailContactanos } from '../../../Service/TiendaOnlineService';
import './Contactanos.css'
export const Contactanos = () => {
    const setNavClient = useSetRecoilState(NavClient);
    const setHeadClient = useSetRecoilState(HeaderClient);
    const messageToast = useToast();

    useEffect(() => {
        setNavClient(false)
        setHeadClient(true)
    }, [])

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        let formDataObject = Object.fromEntries((new FormData(e.target)).entries());
        e.target.reset()
        sendEmailContactanos(formDataObject).then((data) => {
            messageToast({
                title: "Correo enviado",
                description:
                    "Nos Comunicaremos lo antes posible con usted",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
        })
    };
    return (
        <>
            {/* <Box w={"100%"}>
                <Center>
                    <Text fontSize={50} fontWeight={600}>Contactanos</Text>
                </Center>
                <Flex bg={"#2397fe"} minH={"150px"} justifyContent="space-around" alignItems={"center"}>
                    <Box color={"white"}>
                        <Center >
                            <img width={50} src="https://cdn-icons-png.flaticon.com/512/0/191.png" alt="icon Cell Phone" />
                        </Center>
                        <Text>Teléfono</Text>
                    </Box>
                    <Box color={"white"}>
                        <Center fontSize={50}>
                            <FiMail />
                        </Center>
                        <Text>E-mail</Text>
                    </Box>
                    <Box color={"white"}>
                        <Center fontSize={50}>
                            <FiMapPin />
                        </Center>
                        <Text>Derección</Text>
                    </Box>
                </Flex>
            </Box> */}
            <Box w={"100%"} bg="white">
                <Box className="contenedor">

                    <h3><b>Envianos un mensaje</b></h3>
                    <Box className="contenido" boxShadow={"lg"} >
                        <Flex>
                            <Box className="info">
                                <List fontSize="20px" color="blackAlpha.700" marginY="10" spacing={8}>
                                    <ListItem >
                                        <ListIcon as={MdCall} color="green.500" />
                                        +51 994 034 030
                                    </ListItem>
                                    <ListItem>
                                        <ListIcon as={FiMail} color="green.500" />
                                        ventas@gallinitadecorral.com
                                    </ListItem>
                                </List>
                                <Box className="redes-s">
                                    <a href="https://www.facebook.com/La-Gallinita-de-Corral-112035834934660"><FaFacebookF /></a>
                                    <a href="https://www.instagram.com/lagallinitadecorral/"><AiFillInstagram /></a>
                                </Box>
                            </Box>
                            <form id="form_agregar" className="formulario" onSubmit={handleSubmit}>
                                <Input type="text" name="nombre" id="nombre" placeholder="Nombre" />
                                <Input type="text" name="correo" id="correo" placeholder="Correo" />
                                <Input type="text" name="asunto" id="asunto" placeholder="Asunto" />
                                <textarea name="descripcion" id="descripcion" placeholder="Descripción"></textarea>
                                <Button type="submit" colorScheme="teal" variant="outline"><span>ENVIAR</span></Button>
                            </form>
                        </Flex>
                    </Box>
                </Box>
            </Box>
        </>
    )
}
