import React, { useEffect } from "react";
import { ListSoporteAbiertos } from "../../../Service/SoporteService";
import { ActionCell, InfoCell, TablaGeneral } from "./TablaGeneral";

export const TicketAbiertos = () => {

  useEffect(() => {
    //@ts-ignore
    document.getElementById('title_view').textContent = 'Tickets Abiertos';
  }, [])

  const columns = [
    {
      Header: "ID",
      filter: "fuzzyText",

      // @ts-ignore
      Cell: ({ row }) => <InfoCell info={row.original} />,
    },
    {
      Header: "Asunto",
      accessor: "ASUNTO",
      filter: "fuzzyText",
    },
    {
      Header: "Solicitante",
      accessor: "PERSON",
    },
    {
      Header: "Solicitado",
      accessor: "SOLICITADO",
      disableFilters: true,
    },
    {
      Header: "Asignado",
      accessor: "USUARIO",
      disableFilters: true,
    },
    {
      Header: "Lugar de solicitud",
      accessor: "LOCACION",
      disableFilters: true,
    },

    {
      Header: "Acciones",
      id: "actions",

      // @ts-ignore
      Cell: ({ row }) => <ActionCell act={row.original} />,
    },
  ];

  return (
    <>
      <TablaGeneral
        title="Nuevos Tickets"
        viewColumns={columns}
        atom={"soporte"}
        query={ListSoporteAbiertos}
      />
    </>
  );
};
