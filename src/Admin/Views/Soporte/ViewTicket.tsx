import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  AspectRatio,
  Avatar,
  Box,
  Button,
  Divider,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  FormControl,
  Heading,
  HStack,
  Image,
  Skeleton,
  Tag,
  Text,
  useToast,
  useDisclosure,
  Tooltip,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { BsFileEarmarkMinus, BsPlusSquareFill } from "react-icons/bs";
import { InputMessage, MySelect } from "../../../GlobalUI/Forms/MyInputs";
import { ListUsersForTicket } from "../../../Service/User";
import { UserForTicket } from "../../../Model/UserModel";
import {
  MessageTicket,
  NewMessageTicket,
  OneTicket,
  StatusTicket,
} from "../../../Model/Tickets";
import {
  GetOneTicket,
  GetAllMessageOfTicket,
  ListStatus,
  NewMessageOfTicket,
  updateStartHour,
} from "../../../Service/Tickets";
import { socketApi } from "../../../Routes/Admin/Socket";
import { EditSoporte } from "../../../Service/SoporteService";
import { listaTickets } from "../../../Data/Atoms/Ticket";
import { useSetRecoilState } from "recoil";
import "./styles.css";
import { AiOutlineMinusSquare, AiOutlinePlusSquare } from "react-icons/ai";

export const ViewTicket = ({
  icon,
  idTicket,
  recent,
}: {
  icon?: React.ReactElement;
  idTicket?: number;
  recent?: boolean;
}) => {
  // REACTORES
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [viewemessages, setViewMessages] = useState<MessageTicket[]>([]);
  const [listStatus, setStatus] = useState<StatusTicket[]>([]);
  const [listUsers, setUsers] = useState<UserForTicket[]>([]);

  const [statusAccordion, setstatus] = useState(0);
  const [statusTicket, setstatusTicket] = useState(0);
  const [updateActivate, setupdateActivate] = useState(false);

  const [isrecent, setIsRecent] = useState(recent || false);

  const [messageInput, setMessageInput] = useState("");

  const toast = useToast();

  const updated = useSetRecoilState(listaTickets);

  // const [image, setImage] = useState(product.PRO_IMAGE || 'https://ayjoe.engrave.site/img/default.jpg')

  const [viewticket, setViewTicket] = useState<OneTicket>({
    PERSON: "",
    STC_ID: "",
    TCK_PETITIONER: "",
    TCK_DESCRIPTION: "",
    TCK_TAG: "",
    TCK_SUPPORT_TYPE: "",
    TCK_FINAL_LOCATION: "",
    TCK_REQUEST_DATE: "",
    TCK_VIEW_HOUR: "",
    TCK_END_HOUR: "",
    USR_ID: "",
    IMAGE: "",
  });

  const [sendmessages, setSendMessages] = useState<NewMessageTicket>({
    TCK_ID: 0,
    USR_RECEIVER: 1,
    MSS_MESSAGE: "",
  });

  const sendMessageInput = (event: any) => {
    event.preventDefault();
    if (messageInput != "") {
      newMessage(idTicket);
      sendmessages.TCK_ID = Number(idTicket);
      sendmessages.MSS_MESSAGE = messageInput;
      socketApi.emit("sendMessage", sendmessages, (message: any) => {
        if (message.TCK_ID == idTicket && viewemessages.length > 0) {
          setViewMessages((viewemessages) => [...viewemessages, message]);
        }
        setMessageInput("");
      });
    }
  };

  async function getOneTicket(id: number | undefined) {
    if (id !== undefined) {
      await setStatus(await ListStatus());
      await setUsers(await ListUsersForTicket());
      await setStatus(await ListStatus());
      let one = await GetOneTicket(id);
      if (!one.status) {
        await getMessages(id);
        await setViewTicket(one);
        setstatusTicket(1);
        updateStartHour(id);
      }
    }
  }

  async function getMessages(id: number) {
    let messages = await GetAllMessageOfTicket(id);
    await setViewMessages(messages);
    if (messages.status != 404) {
      setstatus(1);
    }
  }

  async function newMessage(idTicket: number | undefined) {
    sendmessages.TCK_ID = Number(idTicket);
    sendmessages.USR_RECEIVER = 1;
    sendmessages.MSS_MESSAGE = messageInput;
    let messages = await NewMessageOfTicket(sendmessages);
    if (!messages.message) {
      await getMessages(Number(idTicket));
    }
  }

  useEffect(() => {
    socketApi.on("messageSocketAdmin", (message) => {
      if (message.TCK_ID == idTicket) {
        setViewMessages((viewemessages) => [...viewemessages, message]);
      }
    });
  }, []);

  return (
    <>
      <Tooltip label='Ver'>

        <Button
          onClickCapture={() => getOneTicket(idTicket)}
          onClick={onOpen}
          colorScheme="teal"
          variant="ghost">
          {icon}
        </Button>
      </Tooltip>

      <Drawer onClose={onClose} isOpen={isOpen} size={"xl"}>
        <DrawerOverlay />
        {statusTicket != 0 ? (
          <>
            <DrawerContent>
              <DrawerHeader>
                <Flex>
                  <Box p="2">
                    <Heading size="md"> TICKET N° {idTicket} </Heading>
                  </Box>
                  <HStack spacing={4} marginLeft="4">
                    <Tag size="md" variant="solid" colorScheme="teal">
                      {viewticket.TCK_SUPPORT_TYPE == null
                        ? "N/A"
                        : viewticket.TCK_SUPPORT_TYPE}
                    </Tag>
                    <Tag size="md" variant="solid" colorScheme="teal">
                      {viewticket.TCK_TAG == null ? "N/A" : viewticket.TCK_TAG}
                    </Tag>
                  </HStack>
                </Flex>
              </DrawerHeader>

              <DrawerBody>
                <Formik
                  initialValues={viewticket}
                  onSubmit={async (values: any) => {
                    setupdateActivate(true);
                    let data = [];
                    await data.push({
                      STC_ID: values["STC_ID"],
                      USR_ID: values["USR_ID"],
                    });
                    let dataRes = await EditSoporte(idTicket, data);
                    if (dataRes.status == 200) {
                      isrecent === false ? updated((val) => !val) : "";
                      onClose();
                    } else {
                      return toast({
                        title: "Ha ocurrido un error!!",
                        description:
                          dataRes.message + " | Intentalo mas tarde.",
                        status: "error",
                        duration: 9000,
                        isClosable: true,
                        position: "top-left",
                      });
                    }
                  }}>
                  <Form>
                    <Flex color="white">
                      <Box flex="1" color="black" marginRight="20px">
                        <MySelect label="ASIGNADO" name="USR_ID">
                          {listUsers.map((user, idx) => {
                            return (
                              <option key={idx} value={user.USR_ID}>
                                {user.USR_USER}
                              </option>
                            );
                          })}
                        </MySelect>
                      </Box>
                      <Box flex="1" width="150px" color="black">
                        <MySelect label="ESTADO" name="STC_ID">
                          {listStatus.map((sts, idx) => {
                            return (
                              <option
                                key={idx}
                                value={sts.STC_ID}
                                selected={
                                  sts.STC_ID === viewticket.STC_ID
                                    ? true
                                    : false
                                }>
                                {sts.STC_NAME}
                              </option>
                            );
                          })}
                        </MySelect>
                      </Box>
                    </Flex>
                    <br />
                    <FormControl>
                      <strong> SOLICITANTE </strong>
                      <Box>► {viewticket.PERSON}</Box>
                    </FormControl>
                    <br />
                    <FormControl>
                      <strong> ASUNTO </strong>
                      <Box>► {viewticket.TCK_PETITIONER}</Box>
                    </FormControl>
                    <br />
                    <FormControl>
                      <strong> DESCRIPCIÓN </strong>
                      <Box>{viewticket.TCK_DESCRIPTION}</Box>
                    </FormControl>
                    <br />
                    <Flex color="white">
                      <Box flex="1" color="black" marginRight="20px">
                        <FormControl>
                          <strong> SOLICITADO </strong>
                          <Box>►{viewticket.TCK_REQUEST_DATE}</Box>
                        </FormControl>
                      </Box>
                      <Box flex="1" width="150px" color="black">
                        <FormControl>
                          <strong> LUGAR DE SOLICITUD </strong>
                          <Box>► {viewticket.TCK_FINAL_LOCATION}</Box>
                        </FormControl>
                      </Box>
                    </Flex>
                    <br />
                    <Accordion allowMultiple>
                      <AccordionItem>
                        {({ isExpanded }) => (
                          <>
                            <h2>
                            <Tooltip label='Ver Más'>
                              <AccordionButton>
                                <Box flex="1" textAlign="left">
                                  EVIDENCIA
                                </Box>
                                {isExpanded ? (
                                  <AiOutlineMinusSquare fontSize="12px" />
                                ) : (
                                  <AiOutlinePlusSquare fontSize="12px" />
                                )}
                              </AccordionButton>
                              </Tooltip>
                            </h2>
                            <AccordionPanel pb={4}>
                              <AspectRatio maxW="400px" ratio={4 / 3}>
                                <Image
                                  src={
                                    viewticket.IMAGE ||
                                    "https://aeasa.com.mx/wp-content/uploads/2020/02/SIN-IMAGEN.jpg"
                                  }
                                  alt="evidencia"
                                  objectFit="cover"
                                />
                              </AspectRatio>
                            </AccordionPanel>
                          </>
                        )}
                      </AccordionItem>
                    </Accordion>
                    <br />

                    <Accordion allowMultiple>
                      <AccordionItem>
                        {({ isExpanded }) => (
                          <>
                            <h2>
                            <Tooltip label='Ver Más'>
                              <AccordionButton>
                                <Box flex="1" textAlign="left">
                                  MENSAJES
                                </Box>
                                {isExpanded ? (
                                  <BsFileEarmarkMinus fontSize="12px" />
                                ) : (
                                  <BsPlusSquareFill fontSize="12px" />
                                )}
                              </AccordionButton>
                              </Tooltip>
                            </h2>

                            <AccordionPanel pb={4}>
                              <Box
                                className="boxMessages"
                                id="boxMessages"
                                pl={2}
                                pr={2}
                                mb={2}>
                                {statusAccordion == 0 ? (
                                  <>
                                    {" "}
                                    <Box
                                      flex="1"
                                      textAlign="left"
                                      mt={2}
                                      p={2}
                                      background="blue.50">
                                      SIN MENSAJES
                                    </Box>
                                  </>
                                ) : (
                                  viewemessages.map((mgs, idx) => {
                                    return (
                                      <>
                                        <Box key={idx}>
                                          <>
                                            <Box
                                              key={idx}
                                              bg={
                                                mgs.USR_SEND == 1
                                                  ? "#FFFAF0"
                                                  : "#E2E8F0"
                                              }
                                              w="100%"
                                              p={2}
                                              color="black"
                                              textAlign={
                                                mgs.USR_SEND == 1
                                                  ? "right"
                                                  : "left"
                                              }>
                                              {mgs.USR_SEND == 1 ? (
                                                <>
                                                  {mgs.MSS_MESSAGE}

                                                  <Avatar
                                                    size="sm"
                                                    name={
                                                      mgs.USR_SEND == 1
                                                        ? "Cliente"
                                                        : "Trabajador"
                                                    }
                                                    bg={
                                                      mgs.USR_SEND == 1
                                                        ? "gray"
                                                        : "teal.500"
                                                    }
                                                    color="white"
                                                    mr="2"
                                                    ml="2"
                                                  />
                                                </>
                                              ) : (
                                                <>
                                                  <Avatar
                                                    size="sm"
                                                    name={
                                                      mgs.USR_SEND == 1
                                                        ? "Cliente"
                                                        : "Trabajador"
                                                    }
                                                    bg={
                                                      mgs.USR_SEND == 1
                                                        ? "gray"
                                                        : "teal.500"
                                                    }
                                                    color="white"
                                                    mr="2"
                                                    ml="2"
                                                  />
                                                  {mgs.MSS_MESSAGE}
                                                </>
                                              )}
                                            </Box>
                                            <Text
                                              fontSize="xs"
                                              textAlign={
                                                mgs.USR_SEND == 1
                                                  ? "right"
                                                  : "left"
                                              }>
                                              {mgs.MSS_DATE +
                                                " " +
                                                mgs.MSS_TIME}
                                            </Text>
                                            <br />
                                          </>
                                        </Box>
                                      </>
                                    );
                                  })
                                )}
                              </Box>
                              <Flex color="white">
                                <InputMessage
                                  sendMessage={sendMessageInput}
                                  setMessage={setMessageInput}
                                  message={messageInput}
                                />
                              </Flex>
                            </AccordionPanel>
                          </>
                        )}
                      </AccordionItem>
                    </Accordion>
                    <br />
                    <Divider />
                    <br />
                    <FormControl>
                      <Button
                        ml={4}
                        background="#0080ff"
                        color="white"
                        type="submit"
                        isLoading={updateActivate}
                        isDisabled={updateActivate}
                        disabled={updateActivate}>
                        ACTUALIZAR
                      </Button>
                      <Button onClick={onClose} ml={4}>
                        SALIR
                      </Button>
                    </FormControl>
                  </Form>
                </Formik>
              </DrawerBody>
            </DrawerContent>
          </>
        ) : (
          <TableCharge />
        )}
      </Drawer>
    </>
  );
};

const TableCharge = () => {
  return (
    <>
      <DrawerContent>
        <DrawerHeader>
          <Heading size="md">
            <Skeleton isLoaded={false}>TICKET</Skeleton>{" "}
          </Heading>
        </DrawerHeader>
        <DrawerBody>
          <Box flex="1" color="black" marginRight="20px">
            <Skeleton height="20px" />
            <br />
            <Skeleton height="20px" />
            <br />
            <Skeleton height="20px" />
            <br />
            <Skeleton height="20px" />
          </Box>
        </DrawerBody>
      </DrawerContent>
    </>
  );
};
