export interface IDicount {
    DIS_ID?: number,
    DIS_NAME: string,
    DIS_DESCRIPTION:string,
    DIS_AMOUNT:string,
    DIS_PERCENTAGE:string,
    DIS_START_DATE:string,
    DIS_END_DATE:string,
    DIS_STATUS:string,
    DIS_ONLINE?:string
}
export interface IDicountDetail {
    DSP_ID?: number,
    DIS_ID:number | null,
    PRO_ID: number
}