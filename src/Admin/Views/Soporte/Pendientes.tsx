import React, { useEffect } from "react";

import { ListSoportePendiente } from "../../../Service/SoporteService";
import { ActionCell, InfoCell, TablaGeneral } from "./TablaGeneral";

export const TicketPendiente = () => {

  useEffect(() => {
    //@ts-ignore
    document.getElementById('title_view').textContent = 'Tickets Pendientes';
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
        title="Tickets Pendientes"
        viewColumns={columns}
        atom={"nuevos"}
        query={ListSoportePendiente}
      />
    </>
  );
};