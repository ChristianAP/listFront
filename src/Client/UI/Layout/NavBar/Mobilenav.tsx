import { FiChevronDown, FiMenu } from "react-icons/fi";
import { useRecoilValue, useSetRecoilState } from "recoil";
import React, { useState } from "react";
import {
  Avatar,
  Box,
  Flex,
  FlexProps,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
  useColorModeValue,
  VStack,
  useToast,
  Image,
  ButtonGroup,
  Button,
  Divider,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  useDisclosure,
} from "@chakra-ui/react";
import { Link, Redirect } from "react-router-dom";
import { ClientState, NavClient } from "../../../../Data/Atoms/Client";
import { BiSearch } from "react-icons/bi";
import { SearcherState } from "../../../../Data/Atoms/Product";
import { CartHeader } from "./CartHeader";
import Cookies from "universal-cookie";
import { useQuery } from "react-query";
import { getCompany } from "../../../../Service/CompanyService";
import { CategoriaComp } from "../../Component/CategoriaComp";
import { GiHamburgerMenu } from "react-icons/gi";
import { getCategories } from "../../../../Service/TiendaOnlineService";


interface MobileProps extends FlexProps {
  onOpen: () => void;
}
export const MobileNav = ({ onOpen, ...rest }: MobileProps) => {

  const cookies = new Cookies();
  const [buscador, setBuscador] = useState("");
  const [redirect, setRedirect] = useState(false);

  const auth = useRecoilValue(ClientState);
  const setAuth = useSetRecoilState(ClientState);
  const navclient = useRecoilValue(NavClient);
  const setSearcherState = useSetRecoilState(SearcherState);

  const { data, isLoading, isError, refetch } = useQuery(
    "categoriess",
    getCategories,
    { refetchOnWindowFocus: false }
  );

  const MobileNavBorderBottom = useColorModeValue("gray.200", "gray.700");
  const menuListBG = useColorModeValue("white", "gray.900");
  const menuListBorder = useColorModeValue("gray.200", "gray.700");
  function LogOut() {
    cookies.remove("clientToken")
    //@ts-ignore
    setAuth({ auth: false, user: '', roles: [], accesos: [] }

    )
  }
  const { isOpen, onOpen: onOpenDrawer, onClose } = useDisclosure()
  const btnRef = React.useRef(null)
  return (
    <Box
      background="linear-gradient(90deg, rgba(124,157,103) 0%, rgba(202,247,136) 100%)">
      <Flex
        px={{ base: 4, md: 4 }}
        flexWrap="nowrap"
        alignItems="center"

        borderBottomColor={MobileNavBorderBottom}
        justifyContent={{
          base: "space-between",
          md: navclient ? "flex-end" : "space-between",
        }}>
        {auth && navclient ? (
          <IconButton
            display={{ base: "flex", md: "none" }}
            onClick={onOpen}
            variant="outline"
            aria-label="open menu"
            icon={<FiMenu />}
          />
        ) : (
          <></>
        )}
        <IconButton onClick={onOpenDrawer} ref={btnRef} display={{ base: "inline-flex", md: "none" }}
          variant='outline'
          colorScheme='teal'
          aria-label='Call Sage'
          fontSize='20px'
          icon={<GiHamburgerMenu />}
        />

        <>

          <Drawer
            isOpen={isOpen}
            placement='left'
            onClose={onClose}
            finalFocusRef={btnRef}
          >
            <DrawerOverlay />
            <DrawerContent>
              <DrawerCloseButton />


              <DrawerBody>
                {!isLoading &&
                  <><VStack textAlign={"left"}   paddingTop={"5"}  >
                    
                      {data.map((val: any, idx: number) =>
                        <>
                        <Link
                          className="link__cat"
                          key={idx}
                          to={"/categoria/" + val.CAT_NAME.replace(" ", "-")}
                        >
                          <Button variant={"link"} color={"black"} fontSize={"xl"} key={val}>{val.CAT_NAME}</Button>
                        </Link><br /></>


                      )}
                      <Link
                        className="link__cat"
                        to={"/nosotros"}
                      >
                        <Button variant={"link"}  color={"black"} fontSize={"xl"}> Nosotros</Button>
                      </Link>
                    
                  </VStack></>
                }

              </DrawerBody>


            </DrawerContent>
          </Drawer>

        </>


        {!navclient &&
          <Link to="/">
            <Image
              w='235px'
              objectFit='cover'
              src={import.meta.env.VITE_APP_LOGO + '/upload/logo.jpg'}
              alt='Dan Abramov'
            />
          </Link>}
        <Flex justifyContent="center" mr={{ base: "40px", md: "100px" }} display={{ base: "none", md: "block" }}>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              setRedirect(true);
              setSearcherState({ where: true, key: buscador });
            }}>
            {redirect && <Redirect to={"/buscador/" + buscador} />}
            <InputGroup margin="5">
              <InputLeftElement pointerEvents="painted" children={<BiSearch />} />
              <Input
                bgColor="white"
                onChange={(event) => {
                  if (event.target.value != "") {
                    setBuscador(event.target.value);
                    setRedirect(false);
                  }
                }}
                focusBorderColor=""
                type="text"
                placeholder="Buscar producto"
              />
            </InputGroup>
          </form>
        </Flex>
        <HStack spacing={{ base: "2", md: "6" }}>
          <CartHeader />
          <Flex alignItems={"center"}>
            <Menu>
              <MenuButton
                py={2}
                transition="all 0.3s"
                _focus={{ boxShadow: "none" }}>
                <HStack>
                  {auth.auth && <>
                    <Avatar
                      size={"sm"}
                      src={
                        "https://images.unsplash.com/photo-1619946794135-5bc917a27793?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9"
                      }
                    />
                    <NameClientUser name={auth.user} />
                  </>}
                  <Box display={{ base: "auto", md: "flex" }}>
                    <FiChevronDown />
                  </Box>
                </HStack>
              </MenuButton>
              {auth.auth ?
                <MenuList bg={menuListBG} borderColor={menuListBorder}>
                  <Link to="/perfil">
                    <MenuItem>
                      Perfil
                    </MenuItem>
                  </Link>
                  <Link to="/pedidos">
                    <MenuItem>
                      Pedidos
                    </MenuItem>
                  </Link>
                  <Link to="/soporte">
                    <MenuItem>
                      Soporte
                    </MenuItem>
                  </Link>
                  <MenuDivider />
                  <MenuItem onClick={LogOut}>Cerrar Sesión</MenuItem>
                </MenuList>
                :
                <MenuList bg={menuListBG} borderColor={menuListBorder}>
                  <Link to="/login">
                    <MenuItem>
                      Iniciar Sesión
                    </MenuItem>
                  </Link>
                  <Link to="/registrar">
                    <MenuItem>
                      Registrar
                    </MenuItem>
                  </Link>
                </MenuList>
              }
            </Menu>
          </Flex>
        </HStack>
      </Flex>
      <Flex justifyContent="center" display={{ base: "block", md: "none" }}>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            setRedirect(true);
            setSearcherState({ where: true, key: buscador });
          }}>
          {redirect && <Redirect to={"/buscador/" + buscador} />}
          <InputGroup margin="5" w={"auto"} >
            <InputLeftElement pointerEvents="painted" children={<BiSearch />} />
            <Input
              bgColor="white"
              onChange={(event) => {
                if (event.target.value != "") {
                  setBuscador(event.target.value);
                  setRedirect(false);
                }
              }}
              focusBorderColor=""
              type="text"
              placeholder="Buscar producto"
            />
          </InputGroup>
        </form>
      </Flex>
      <Divider />
      <CategoriaComp />
    </Box>
  );
};
const NameClientUser = ({ name }: any) => {
  return (
    <VStack
      display={{ base: "none", md: "flex" }}
      alignItems="flex-start"
      spacing="1px"
      ml="2">
      <Text fontSize="sm">{name}</Text>
      <Text fontSize="xs" color="gray.600">
        Cliente
      </Text>
    </VStack>
  );
};
