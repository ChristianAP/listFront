import { Box, Flex, Image, ListItem, Text, UnorderedList } from '@chakra-ui/react';
import React, { useEffect } from 'react'
import { useSetRecoilState } from 'recoil';
import { HeaderClient, NavClient } from '../../../Data/Atoms/Client';
import { MyContain } from '../../UI/Component/MyContain';

export const Nosotros = () => {
    const setNavClient = useSetRecoilState(NavClient);
    const setHeadClient = useSetRecoilState(HeaderClient);
    useEffect(() => {
        setNavClient(false)
        setHeadClient(true)
    }, [])
    return (
        <Box padding={{ base: "1", md: "8" }} margin="8" flex="4" bg={"whiteAlpha.700"} >
            <Box m="1" p={3} alignItems="start">
                <Text fontSize="2xl"><b>Nuestros huevos se diferencian en sabor, textura, olor, coloración de la yema y la frescura que nos caracteriza.</b></Text>
                <Flex flexDirection={{ base: "column", lg: "row" }} mt={"2"} bg={"white"}>
                    <Box
                        paddingX={{ base: "2", lg: "8" }}
                        borderRadius="lg"
                        paddingY={{ base: "1", lg: "4" }}
                        flex={"5"}
                        margin="2"
                        fontSize="md">
                        <Text fontSize="xl"><b>Beneficios de comer huevo orgánico.</b></Text>
                        <UnorderedList mt={"2"}>
                            <ListItem>
                                El consumo de Omega 3 tiene beneficios para el desempeño cerebral y ayuda a prevenir enfermedades cardiacas.
                            </ListItem>
                            <ListItem>
                                Los huevos orgánicos tienen una mayor concentración de vitamina D, la cual ayuda a la prevención del colesterol y la diabetes.
                            </ListItem>
                            <ListItem>
                                Tres veces más vitamina E.
                            </ListItem>
                            <ListItem>
                                25% menos grasa saturada.
                            </ListItem>
                            <ListItem>
                                70% más de vitamina B12.
                            </ListItem>
                            <ListItem>
                                33% menos colesterol.
                            </ListItem>
                            <ListItem>
                                50% más de ácido fólico.
                            </ListItem>
                        </UnorderedList>
                    </Box>
                    <Box p={"3"}
                        flex={"5"}>
                        <Image
                            objectFit={"cover"}
                            src='https://i.pinimg.com/736x/4e/98/b1/4e98b1659da797c47315c34b261814c1.jpg' />
                    </Box>
                </Flex>
                <Flex justifyContent={"space-around"} mt={"8"}>
                    <Text fontSize="lg"><b>Huevos Orgánicos</b></Text>
                    <Text fontSize="lg"><b>Huevos Convencionales</b></Text>
                </Flex>
                <UnorderedList mt={"8"}>
                    <ListItem>
                        Las principales diferencias entre los huevos convencionales y los orgánicos radica en la alimentación que reciben las gallinas, así como las condiciones en las que éstas se desarrollan.
                    </ListItem>
                    <ListItem>
                        Los huevos convencionales, normalmente, son producidos en granjas avícolas industriales, en donde las gallinas sufren condiciones de vida algunas veces deplorables.
                    </ListItem>
                    <ListItem>
                        Al cumplir 18 semanas de vida, se les coloca en "jaulas de batería", junto con otras 5 o 10 aves más, teniendo un mínimo de espacio para moverse mucho menos para dormir.
                    </ListItem>
                    <ListItem>
                        Al ser incapaces de bañarse en tierra, cuidar sus plumas o tan siquiera estirar sus alas, las gallinas entran en un estado de estrés físico y psicológico constante, sin mencionar demás técnicas a las que se ven sometidas cuando su proceso reproductivo se ve deteriorado.
                    </ListItem>
                    <ListItem>
                        Por el contrario, los huevos orgánicos provienen de gallinas que son criadas con alimentos orgánicos libres de residuos químicos agrícolas, como pesticidas, herbicidas y fertilizantes. No son tratadas con hormonas, antibióticos u otros fármacos.
                    </ListItem>
                    <ListItem>
                        Asimismo, las aves viven en condiciones más aceptables, teniendo la posibilidad de andar al aire libre, con mayor espacio para moverse y consumir una dieta que incluya plantas e insectos. Por supuesto, su nivel de estrés es nula debido a estas circunstancias.
                    </ListItem>
                    <ListItem>
                        Nuestras aves no sufren mutilación de pico como las granjas convencionales.
                    </ListItem>
                    <ListItem>
                        En su dieta no consume harina de pescado ni promotores postura, hormonas.
                    </ListItem>
                </UnorderedList>
            </Box>
            <Box m="1" p={3} alignItems="end">
                <Text fontSize="2xl"><b>¿Sabías que la piel del pollo no es amarilla?</b></Text>
                <Flex flexDirection={{ base: "column", lg: "row" }} mt={"2"} bg={"white"}>
                    <Box p={"3"}
                        flex={"5"}>
                        <Image
                            objectFit={"cover"}
                            src='http://146.190.44.4:4000/upload/polloversus.jpg' />
                    </Box>
                    <Box
                        paddingX={{ base: "2", lg: "8" }}
                        borderRadius="lg"
                        paddingY={{ base: "1", lg: "4" }}
                        flex={"5"}
                        margin="2"
                        fontSize="md">
                        <Text fontSize="xl"><b>Los pollos por naturaleza tienen piel blanca; los colorantes y aditivos que se agregan a su dieta son los que ocasionan esta coloración artificial amarilla.</b></Text>
                        <Text fontSize="xl"><b>Beneficios de comer pollo orgánico.</b></Text>
                        <UnorderedList mt={"2"} style={{ direction: "rtl", textAlign: "right" }}>
                            <ListItem>
                                Su carne es baja en grasas
                            </ListItem>
                            <ListItem>
                                Contiene aminoácidos esenciales que facilitan la digestión
                            </ListItem>
                            <ListItem>
                                Es rico en vitaminas y minerales.
                            </ListItem>
                        </UnorderedList>
                    </Box>

                </Flex>
                <Flex justifyContent={"space-around"} mt={"8"}>
                    <Text fontSize="lg"><b>Diferencias de nuestros Pollos orgánicos.</b></Text>
                </Flex>
                <UnorderedList mt={"8"}>
                    <ListItem>
                        Nuestros pollos orgánicos no tienen antibióticos, ni son expuestos a ningún tóxico.
                    </ListItem>
                    <ListItem>
                        Su alimentación se basa solo en productos de procedencia orgánica.
                    </ListItem>
                    <ListItem>
                        Comparado con el convencional, el pollo orgánico tiene menos grasa, más sabor y proteínas de mejor calidad.
                    </ListItem>
                    <ListItem>
                        Su carne además de saludable es blanca, lo que significa que es beneficiosa para la salud y es sumamente jugosa.
                    </ListItem>
                    <ListItem>
                        Lo más importante es que el pollo orgánico mantiene todas las cualidades nutricionales que debe tener el pollo sin aportarle al cuerpo químicos peligrosos para la salud.
                    </ListItem>
                </UnorderedList>
            </Box>
        </Box>
    )
}
