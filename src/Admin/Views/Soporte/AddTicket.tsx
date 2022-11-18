import React, { useState } from "react";
import {
  Box,
  Button,
  Center,
  Circle,
  HStack,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  Switch,
  Stack,
  Heading,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  useBoolean,
  Text,
  Flex,
  AlertIcon,
  Skeleton,
} from "@chakra-ui/react";
import { BsPlusSquare } from "react-icons/bs";
import {
  AdminCreateTicket,
  EvidenceTicket,
  StatusTicket,
  TicketHistory,
} from "../../../Model/Tickets";
import {
  CreateTicket,
  CreateTicketHistory,
  ListStatus,
} from "../../../Service/Tickets";
import { ModalAlertMessage } from "../../UI/Components/ModalAlert/MyModal";
import { UserForTicket } from "../../../Model/UserModel";
import { ListUsersForTicket, SearchUser } from "../../../Service/User";
import { socketApi } from "../../../Routes/Admin/Socket";
import { InputSearch, MyImageInput } from "../../../GlobalUI/Forms/MyInputs";
import { AdminState } from "../../../Data/Atoms/Admin";
import { useRecoilState, useSetRecoilState } from "recoil";
import { CreateEvidenceTicket } from "../../../Service/SoporteService";
import { listaTickets } from "../../../Data/Atoms/Ticket";
import { FaPlus } from "react-icons/fa";

export const AddTicket = ({
  title,
  length,
  view,
}: {
  title: any;
  length: any;
  view: any;
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [size, setSize] = React.useState("lg");
  const [flag, setFlag] = useBoolean(false);
  const [disable, setdisable] = useState(true);
  const [isLoading, setLoading] = useState(false);

  const [viewModal, setViewModal] = useState(false);
  const [messageModal, setMessageModal] = useState();
  const [statusModal, setStatusModal] = useState("");

  const [listPerson, setPersonTicket] = useState<[]>([]);
  const [listStatus, setStatus] = useState<StatusTicket[]>([]);
  const [listUsers, setUsers] = useState<UserForTicket[]>([]);

  const [valueId, setValueId] = React.useState(String);
  const [valueName, setValueName] = React.useState(String);
  const [searchInput, setSearchInput] = useState("");

  const [setDateTime, setDate] = useState("");
  const [setHourTime, setHour] = useState("");

  const [admin, setAdmin] = useRecoilState(AdminState);

  const [image, setImage] = useState(
    "https://ayjoe.engrave.site/img/default.jpg"
  );
  const [file, setFile] = useState([]);

  const updated = useSetRecoilState(listaTickets);

  const [ticket, setTicket] = useState<AdminCreateTicket>({
    STC_ID: "",
    USR_ID: "",
    PER_ID: "",
    TCK_DESCRIPTION: "",
    TCK_FINAL_LOCATION: "",
    TCK_PETITIONER: "",
    TCK_ESTIMATE_HOUR: "",
    TCK_SUPPORT_TYPE: "",
    TCK_TAG: "",
  });

  const [historyTicket, setHistory] = useState<TicketHistory>({
    USR_ID: "",
    PER_ID: "",
    STC_ID: "",
    TCH_DESCRIPTION: "Crear ticket",
    TCK_ID: "",
  });

  // const [evidence, setEvidence] = useState<EvidenceTicket>({
  //   EVO_IMAGE: "",
  //   TCK_ID: "",
  // });

  async function searchPerson(event: any) {
    event.preventDefault();
    if (
      searchInput != "" ||
      event.type == "click" ||
      event.type == "keypress"
    ) {
      var user= await SearchUser(searchInput);
      await setPersonTicket(user.PER_ID);
    }
  }

  async function changeSelect(changeValueId: any, changeValueName: any) {
    console.log(changeValueName);

    await setValueId(changeValueId);
    await setValueName(changeValueName);
  }

  async function getValuesForSelects() {
    await setStatus(await ListStatus());
    await setUsers(await ListUsersForTicket());
  }

  function handleChangeSelect(
    name: any,
    e: React.ChangeEvent<HTMLSelectElement>
  ) {
    if (name == "USR_ID") {
      setdisable(false);
    }
    setTicket({
      ...ticket,
      [name]: e.target.value,
    });
  }

  function handleChangeInput(
    name: any,
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    setTicket({
      ...ticket,
      [name]: e.target.value,
    });
  }

  function handleChangeTextArea(
    name: any,
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) {
    setTicket({
      ...ticket,
      [name]: e.target.value,
    });
  }

  function handleChangeTime(name: any, e: React.ChangeEvent<HTMLInputElement>) {
    name == "date" ? setDate(e.target.value) : setHour(e.target.value);
  }

  function getIdUser() {
    setFlag.toggle();
    setTicket({
      ...ticket,
      USR_ID: String(admin.iu),
    });
    setdisable(false);
  }

  async function saveTicket() {
    setLoading(true);
    ticket.PER_ID = valueId;
    ticket.TCK_ESTIMATE_HOUR = setDateTime + " " + setHourTime;
    let createTicket = await CreateTicket(ticket);
    if (createTicket.data) {
      if (file[0]) {
        let formData = new FormData();
        //@ts-ignore
        formData.append("IMAGE", file[0]);
        //@ts-ignore
        formData.append("TCK_ID", createTicket.data);
        await CreateEvidenceTicket(formData);
      }
      historyTicket.TCK_ID = createTicket.data;
      historyTicket.PER_ID = ticket.PER_ID;
      historyTicket.STC_ID = ticket.STC_ID;
      historyTicket.USR_ID = ticket.USR_ID;
      await CreateTicketHistory(historyTicket);
      socketApi.emit("createTicket", {
        id: createTicket.data,
        client: ticket.PER_ID,
        asunto: ticket.TCK_DESCRIPTION,
        date: "",
        hour: "",
        type: "new",
      });
      setMessageModal(createTicket.message);
      setStatusModal("success");
      setViewModal(true);
      clearInputs();
      setLoading(false);
      setViewModal(false);
      updated((val) => !val);
      onClose();
    } else {
      setMessageModal(createTicket.message);
      setStatusModal("error");
      clearInputs();
      setLoading(false);
      setViewModal(true);
      onClose();
    }
  }

  async function closeAll() {
    setPersonTicket([]);
    setValueId("");
    setValueName("");
    setSearchInput("");
    setLoading(false);
    setViewModal(false);
    onClose();
  }

  function clearInputs() {
    setTicket({
      PER_ID: "",
      STC_ID: "",
      TCK_DESCRIPTION: "",
      TCK_FINAL_LOCATION: "",
      TCK_PETITIONER: "",
      TCK_SUPPORT_TYPE: "",
      TCK_ESTIMATE_HOUR: "",
      TCK_TAG: "",
      USR_ID: "",
    });
  }

  return (
    <>
      {viewModal == true ? (
        <>
          <ModalAlertMessage
            message={messageModal}
            status={statusModal}
            icon={<AlertIcon boxSize="40px" mr={0} />}
            buttons={
              <Button colorScheme="blue" mr={3} onClick={() => closeAll()}>
                SALIR
              </Button>
            }
          />
        </>
      ) : (
        <></>
      )}
      <HStack>
        <Button
          onClick={onOpen}
          onClickCapture={() => getValuesForSelects()}
          leftIcon={<FaPlus />} colorScheme="green"
          w="110px">
          Agregar
        </Button>
      </HStack>
      <br />
      <Drawer onClose={closeAll} isOpen={isOpen} size={size}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader>Crear Ticket</DrawerHeader>
          <DrawerBody>
            <FormControl>
              <Flex color="white">
                <Box flex="1" color="black">
                  <FormLabel>Solicitante</FormLabel>
                  {valueId == "" ? (
                    <InputSearch
                      setValueSearch={setSearchInput}
                      sendValueSearch={searchPerson}
                      valueSearch={searchInput}
                      dataGet={listPerson}
                      selectedValue={changeSelect}
                    />
                  ) : (
                    <Text fontWeight="bold">{valueName}</Text>
                  )}
                </Box>
                <Box flex="1" color="black">
                  <FormLabel>Estado</FormLabel>
                  {listUsers.length != 0 ? (
                    <Select
                      w="250px"
                      placeholder="Selecciona un estado"
                      onChange={(e) => handleChangeSelect("STC_ID", e)}>
                      {listStatus.map((sts, idx) => {
                        return (
                          <option key={idx} value={sts.STC_ID}>
                            {sts.STC_NAME}
                          </option>
                        );
                      })}
                    </Select>
                  ) : (
                    <>
                      <Skeleton isLoaded={false}>CARGANDO... </Skeleton>
                    </>
                  )}
                </Box>
              </Flex>
            </FormControl>
            <br />
            <FormControl>
              <FormLabel>Asunto</FormLabel>
              <Input
                placeholder="Aqui va el asunto"
                onChange={(e) => handleChangeInput("TCK_PETITIONER", e)}
              />
            </FormControl>
            <br />
            <FormControl>
              <FormLabel>Descripción</FormLabel>
              <Textarea
                placeholder="Aqui va una Descripción"
                onChange={(e) => handleChangeTextArea("TCK_DESCRIPTION", e)}
              />
            </FormControl>
            <br />
            <FormControl>
              <FormLabel>Lugar</FormLabel>
              <Input
                placeholder="Aqui va el lugar"
                onChange={(e) => handleChangeInput("TCK_FINAL_LOCATION", e)}
              />
            </FormControl>
            <br />

            <FormControl>
              <FormLabel>Tiempo Estimado de cierre</FormLabel>
              <Input
                style={{ width: "250px", marginRight: "10px" }}
                placeholder="HH:MM:SS"
                type="date"
                min="2021-12-27"
                onChange={(e) => handleChangeTime("date", e)}
              />
              <Input
                style={{ width: "250px" }}
                type="time"
                onChange={(e) => handleChangeTime("hour", e)}
              />
            </FormControl>
            <br />
            <FormControl>
              <Flex color="white">
                <Box flex="1" color="black" marginRight="20px">
                  <FormLabel>Tipo de soporte</FormLabel>
                  <Input
                    placeholder="Producto Dañado / Producto Vencido / Otros"
                    onChange={(e) => handleChangeInput("TCK_SUPPORT_TYPE", e)}
                  />
                </Box>
                <Box flex="1" width="150px" color="black">
                  <FormLabel>TAG</FormLabel>
                  <Input
                    placeholder="Importante"
                    onChange={(e) => handleChangeInput("TCK_TAG", e)}
                  />
                </Box>
              </Flex>
            </FormControl>
            <br />
            <FormControl>
              <Stack direction={["column", "row"]} spacing="24px">
                <FormLabel>Asignar a</FormLabel>
                <Switch
                  colorScheme="blue"
                  defaultChecked={false}
                  onChange={getIdUser}
                />
                <Text fontSize="sm">Asignarmelo</Text>
              </Stack>
              {flag == false ? (
                <Select
                  placeholder="Selecciona un usuario"
                  onChange={(e) => handleChangeSelect("USR_ID", e)}>
                  {/* TO DO --> Traer todos los usuarios sin el rol cliente */}
                  {listUsers.map((user, idx) => {
                    return (
                      <option key={idx} value={user.USR_ID}>
                        {user.USR_USER}
                      </option>
                    );
                  })}
                </Select>
              ) : (
                <></>
              )}
            </FormControl>
            <br />
            <FormControl>
              <MyImageInput
                image={image}
                setImage={setImage}
                setFile={setFile}
              />
            </FormControl>

            <FormControl>
              <Button
                colorScheme="blue"
                mr={3}
                onClick={saveTicket}
                disabled={disable}
                isLoading={isLoading}>
                Agregar
              </Button>
              <Button onClick={closeAll} disabled={isLoading}>
                Cancel
              </Button>
            </FormControl>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};
