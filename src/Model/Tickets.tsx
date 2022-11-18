export interface ITicket {
  id: string;
  usr_id: string;
  per_id: string;
  ttc_id: string;
  stc_id: string;
  petitioner: string;
  description: string;
  tag: string;
  support_type: string;
  final_location: string;
  date: string;
  start_hour: string;
  end_hour: string;
}

export interface NewTicket {
  ID: string;
  PERSON: string;
  ASUNTO: string;
  ESTADO: string;
  LOCACION: string;
  SOLICITADO: string;
  STATUS_DES: string;
  USUARIO: string;
}

export interface AdminCreateTicket {
  USR_ID: string;
  PER_ID: string;
  STC_ID: string;
  TCK_TAG: string;
  TCK_PETITIONER: string;
  TCK_DESCRIPTION: string;
  TCK_SUPPORT_TYPE: string;
  TCK_FINAL_LOCATION: string;
  TCK_ESTIMATE_HOUR: string;
}

export interface ClientCreateTicket {
  USR_ID: string | null;
  PER_ID: string | null;
  STC_ID: string | null;
  TCK_TAG: string | null;
  TCK_PETITIONER: string | null;
  TCK_DESCRIPTION: string | null;
  TCK_SUPPORT_TYPE: string | null;
  TCK_FINAL_LOCATION: string | null;
}

export interface TicketHistory {
  TCK_ID: string;
  USR_ID: string;
  PER_ID: string;
  STC_ID: string;
  TCH_DESCRIPTION: string;
}

export interface EvidenceTicket {
  TCK_ID: string;
  EVO_IMAGE: string;
}

export interface StatusTicket {
  STC_ID: string;
  STC_NAME: string;
  STC_DESCRIPTION: string;
}

export interface OneTicket {
  PERSON: string;
  STC_ID: string;
  TCK_PETITIONER: string;
  TCK_DESCRIPTION: string;
  TCK_TAG: string;
  TCK_SUPPORT_TYPE: string;
  TCK_FINAL_LOCATION: string;
  TCK_REQUEST_DATE: string;
  TCK_VIEW_HOUR: string;
  TCK_END_HOUR: string;
  USR_ID: string;
  IMAGE: string;
}

export interface OneTicketClient {
  PER_ID: string;
  STC_ID: string;
  TCK_DESCRIPTION: string;
  TCK_END_HOUR: string | null;
  TCK_FINAL_LOCATION: string;
  TCK_ID: string;
  TCK_PETITIONER: string;
  TCK_REQUEST_DATE: string;
  TCK_REQUEST_HOUR: string;
  TCK_VIEW_HOUR: string | null;
  TCK_STATUS: string;
  TCK_SUPPORT_TYPE: string;
  TCK_TAG: string;
  TTC_ID: string | null;
  USR_ID: string;
  IMAGE: string;
}

export interface MessageTicket {
  TCK_ID: number;
  USR_SEND: number;
  USR_RECEIVER: number;
  MSS_MESSAGE: string;
  MSS_VIEWED: number;
  MSS_SENT: string;
  MSS_TIME: string;
  MSS_DATE: string;
}

export interface NewMessageTicket {
  TCK_ID: number;
  USR_RECEIVER: number;
  MSS_MESSAGE: string;
}

export interface NewMessageTicketClient {
  TCK_ID: number;
  USR_SEND: number;
  MSS_MESSAGE: string;
}

export interface ReportCicular {
  name: string;
  value: number;
}

export interface ReportWeek {
  NOMBRE: string;
  NUEVO: number;
  ABIERTO: number;
  PENDIENTE: number;
  CERRADO: number;
}
