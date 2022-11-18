import React from "react";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  BoxProps,
  CloseButton,
  Flex,
  Icon,
  Image,
  List,
  ListItem,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { SideBarRoutes } from "./../../../../Data/Atoms/Admin";
import { MyIcons } from "./../../../../Data/Routes/Icons";

interface SidebarProps extends BoxProps {
  onClose: () => void;
}
export const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {

  const accesos = useRecoilValue(SideBarRoutes);

  return (
    <>
      <Box
        transition="width 3s ease"
        bg={useColorModeValue("white", "gray.900")}
        w={{ base: "full", md: 60 }}
        pos="fixed"
        h="full"
        {...rest}>
        <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
          <Image
            //   borderRadius="full"
            w={{base:"150px",md:235}}
            src={import.meta.env.VITE_APP_LOGO+"/upload/logo.jpg"}
            alt="Phiona App"
          />
          <CloseButton
            display={{ base: "flex", lg: "none" }}
            onClick={onClose}
          />
        </Flex>
        <Accordion allowMultiple style={{height:"91%",overflowY:"auto"}}>
          {accesos.map((val, idx) => (
            <AccordionItem key={idx}>
              <h2>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    <Icon
                      mr="4"
                      fontSize="16"
                      _groupHover={{
                        color: "white",
                      }}
                      //@ts-ignore
                      as={MyIcons(val.Acceso)}
                    />
                    {/* @ts-ignore */}
                    {val.Acceso}
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                <List>
                  {/* @ts-ignore */}
                  {val.SubAccesos.filter(
                    //@ts-ignore
                    (acc) => acc.nombre !== "Impresion"
                  ).map((child: any, idx: any) => (
                    <ListItem key={idx}>
                      <Box
                        as={NavLink}
                        activeStyle={{ color: "#00ffff" }}
                        onClick={onClose}
                        // @ts-ignore
                        to={"/admin" + val.Ruta + child.ruta}>
                        <Box ml={10} my={1}>
                          {child.nombre}
                        </Box>
                      </Box>
                      {/* @ts-ignore */}
                      {val.SubAccesos.length !== idx + 1 && <hr />}
                    </ListItem>
                  ))}
                </List>
              </AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>
      </Box>
    </>
  );
};
