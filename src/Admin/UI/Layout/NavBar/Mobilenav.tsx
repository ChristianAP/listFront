import { FiChevronDown, FiMenu } from "react-icons/fi";
import { AdminState } from "../../../../Data/Atoms/Admin";
import { useRecoilState } from "recoil";
import React from "react";
import {
  Avatar,
  Box,
  Flex,
  FlexProps,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
  useColorModeValue,
  VStack,
  Spacer,
  Image,
} from "@chakra-ui/react";
import "./styles.css";
import { Link } from "react-router-dom";
import { SalesAlert } from "./SalesAlerts";
import { StockAlert } from "./StockAlerts";
import { TicketAlert } from "./TicketAlerts";
import { getCompany } from "../../../../Service/CompanyService";
import { useQuery } from "react-query";

interface MobileProps extends FlexProps {
  onOpen: () => void;
}
export const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
  const [admin, setAdmin] = useRecoilState(AdminState);
  const LogOut = () => setAdmin({ ...admin, auth: false });
  const { } = useQuery("company", getCompany, { refetchOnWindowFocus: false })
  return (
    <>
      <Flex
        color={"white"}
        ml={{ base: 0, lg: 60 }}
        px={{ base: 4, md: 4 }}
        key="mobile-nav"
        height="20"
        alignItems="center"
        bg={"#0f1e49"}
        borderBottomWidth="1px"
        borderBottomColor={useColorModeValue("gray.200", "gray.700")}
        justifyContent={{ base: "space-between", md: "flex-end" }}
        {...rest}
      >
        <IconButton
          display={{ base: "flex", lg: "none", }}
          // w="lg"
          onClick={onOpen}
          variant="outline"
          aria-label="open menu"
          icon={<FiMenu />}
          key="open_menu"
        />
        <Spacer display={{ "base": "none", "md": "block" }} />

        <Box display={{ "base": "none", "md": "block" }}>
          <Text fontSize="xl" fontWeight={"bold"} id="title_view">
            FIONA APPs
          </Text>
        </Box>

        <Spacer display={{ "base": "none", "md": "block" }} />
        <HStack spacing={{ base: "5", md: "6" }}>
          <SalesAlert />
          <StockAlert />
          <TicketAlert />
          <Flex alignItems={"center"}>
            <Menu>
              <MenuButton
                py={2}
                transition="all 0.3s"
                _focus={{ boxShadow: "none" }}
              >
                <HStack>
                  <Avatar
                    size={"sm"}
                  />
                  <VStack
                    display={{ base: "none", md: "flex" }}
                    alignItems="flex-start"
                    spacing="1px"
                    ml="2"
                  >
                    <Text fontSize="sm">{admin.user}</Text>
                    <Text fontSize="xs" color="gray.600">
                      {admin.roles}
                    </Text>
                  </VStack>
                  <Box display={{ base: "none", md: "flex" }}>
                    <FiChevronDown />
                  </Box>
                </HStack>
              </MenuButton>
              <MenuList
                bg={useColorModeValue("white", "gray.900")}
                borderColor={useColorModeValue("gray.200", "gray.700")}
                color={"black"}
              >
                <MenuItem as={Link} to="/admin/opciones/perfil" key="Perfil">
                  Perfil
                </MenuItem>
                <MenuItem
                  as={Link}
                  to="/admin/opciones/configuracion"
                  key="Configuracion"
                >
                  Configuración
                </MenuItem>
                <MenuDivider />
                <MenuItem onClick={LogOut}>Cerrar Sesión</MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </HStack>
      </Flex>
    </>
  );
};

export const AlertMessageAtom = ({ data }: { data: any }) => {
  return (
    <>
      <Box p={1}>
        <Text ml={2} mr={2}>
          {data}
        </Text>
      </Box>
    </>
  );
};
