import React, { useState, ReactNode } from "react";
import { jsPDF } from "jspdf";
import { getInfoVoucher } from "../../../../Service/VoucherService";

export const DonwloadPDF = ({
  children,
  venta,
  disabled
}: {
  children: ReactNode;
  venta?: any;
  disabled?: boolean;
}) => {
  async function generateVoucherFile() {

    // TO DO -> cambiar company por id de compañia
    let generateVoucher = {
      COMPANY: 2,
      PERSON: venta.IDCLIENT,
      PEDIDO: venta.PEDIDO
    }

    let info = await getInfoVoucher(generateVoucher)
    let dnioruc;

    if(info.client[0].DNI == "" || info.client[0].DNI == null){
        dnioruc = info.client[0].RUC
    }else{
        dnioruc = info.client[0].DNI
    }

    if(!info.message){
      let productArray = "";
      info.products.map((val:any, idx:any )=>{
        productArray = productArray + `
        <table style='font-family:Verdana,sans-serif;box-sizing:border-box;margin-bottom:16px' width='100%' cellpadding='0' cellspacing='0'>
            <tbody style='font-family:Verdana,sans-serif;box-sizing:border-box'>
                <tr>
                    <td style='font-family:Verdana,sans-serif;box-sizing:border-box;word-break:break-word' colspan='2'>
                        <table style='font-family:Verdana,sans-serif;box-sizing:border-box' width='100%' cellpadding='0' cellspacing='0'>
                            <tbody style='font-family:Verdana,sans-serif;box-sizing:border-box'>
                                <tr>
                                    <th style='font-family:Verdana,sans-serif;box-sizing:border-box' width='4%'>
                                        <p style='font-family:Verdana,sans-serif;box-sizing:border-box;line-height:1.5em;text-align:left;margin:0;margin-top:0;font-size:12px;font-weight:600;margin-bottom:8px'>
                                            `+val.PRODUCTO+`</p>
                                    </th>
                                    <th style='font-family:Verdana,sans-serif;box-sizing:border-box' width='12.5%'>
                                        <p style='font-family:Verdana,sans-serif;box-sizing:border-box;line-height:1.5em;text-align:center;margin:0;margin-top:0;font-size:12px;font-weight:600;margin-bottom:8px'>
                                        `+val.PRO_CODE+`</p>
                                    </th>
                                    <th style='font-family:Verdana,sans-serif;box-sizing:border-box' width='12.5%'>
                                        <p style='font-family:Verdana,sans-serif;box-sizing:border-box;line-height:1.5em;text-align:center;margin:0;margin-top:0;font-size:12px;font-weight:600;margin-bottom:8px'>
                                        `+val.DESCRIPCION+`</p>
                                    </th>
                                    <th style='font-family:Verdana,sans-serif;box-sizing:border-box' width='12.5%'>
                                        <p style='font-family:Verdana,sans-serif;box-sizing:border-box;line-height:1.5em;text-align:right;margin:0;margin-top:0;font-size:12px;font-weight:600;margin-bottom:8px'>
                                        s/. `+val.CANTIDAD+`</p>
                                    </th>
                                    <th style='font-family:Verdana,sans-serif;box-sizing:border-box' width='12.5%'>
                                        <p style='font-family:Verdana,sans-serif;box-sizing:border-box;line-height:1.5em;text-align:right;margin:0;margin-top:0;font-size:12px;font-weight:600;margin-bottom:8px'>
                                        s/. `+val.PRECIO+`</p>
                                    </th>
                                    <th style='font-family:Verdana,sans-serif;box-sizing:border-box' width='12.5%'>
                                        <p style='font-family:Verdana,sans-serif;box-sizing:border-box;line-height:1.5em;text-align:right;margin:0;margin-top:0;font-size:12px;font-weight:600;margin-bottom:8px'>
                                        s/. `+val.SUBTOTAL+`</p>
                                    </th>
                                    <th style='font-family:Verdana,sans-serif;box-sizing:border-box' width='12.5%'>
                                        <p style='font-family:Verdana,sans-serif;box-sizing:border-box;line-height:1.5em;text-align:right;margin:0;margin-top:0;font-size:12px;font-weight:600;margin-bottom:8px'>
                                            s/. 00.0</p>
                                    </th>
                                    <th style='font-family:Verdana,sans-serif;box-sizing:border-box' width='12.5%'>
                                        <p style='font-family:Verdana,sans-serif;box-sizing:border-box;line-height:1.5em;text-align:right;margin:0;margin-top:0;font-size:12px;font-weight:600;margin-bottom:8px'>
                                        s/. `+val.SUBTOTAL+`</p>
                                    </th>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
            </tbody>
        </table>`;
      })

      let voucher = `
        <table class='m_7441485788288210047email-body' style='font-family:Verdana,sans-serif;box-sizing:border-box;width:900px;margin:0 auto;padding:0;background-color:#fff' align='center' width='600' cellpadding='0' cellspacing='0'>
          <tbody style='font-family:Verdana,sans-serif;box-sizing:border-box'>
              <tr>
                  <td style='font-family:Verdana,sans-serif;box-sizing:border-box;word-break:break-word'>
                      <table style='font-family:Verdana,sans-serif;box-sizing:border-box' width='100%' height='5px' cellspacing='0'>
                          <tbody style='font-family:Verdana,sans-serif;box-sizing:border-box'>
                              <tr>
                                  <td style='font-family:Verdana,sans-serif;box-sizing:border-box;word-break:break-word' bgcolor='#24468A'></td>
                              </tr>
                          </tbody>
                      </table>
                  </td>
              </tr>
              <tr>
                  <td style='font-family:Verdana,sans-serif;box-sizing:border-box;word-break:break-word;padding:24px'>
                      <table style='font-family:Verdana,sans-serif;box-sizing:border-box;margin-bottom:16px' width='100%' cellpadding='0' cellspacing='0'>
                          <p style='font-family:Verdana,sans-serif;box-sizing:border-box;line-height:1.5em;text-align:center;margin:0;margin-top:0;font-size:20px;font-weight:600;margin-bottom:8px'>
                              `+info.company[0].COMPANY+`</p>
                              <br>
                              <hr>
                              <br>
                          <tbody style='font-family:Verdana,sans-serif;box-sizing:border-box'>
                            <tr>
                              <td style='font-family:Verdana,sans-serif;box-sizing:border-box;word-break:break-word' colspan='2'>
                                <table style='font-family:Verdana,sans-serif;box-sizing:border-box' width='100%' cellpadding='0' cellspacing='0'>
                                  <tbody style='font-family:Verdana,sans-serif;box-sizing:border-box'>
                                    <tr>
                                  
                                      <th style='font-family:Verdana,sans-serif;box-sizing:border-box' width='40%'>
                                        <table style='font-family:Verdana,sans-serif;box-sizing:border-box;margin-bottom:16px' width='100%' cellpadding='0' cellspacing='0'>
                                          <tbody style='font-family:Verdana,sans-serif;box-sizing:border-box'>
                                              <tr>
                                                  <td style='font-family:Verdana,sans-serif;box-sizing:border-box;word-break:break-word' width='60%' valign='middle'>
                                                      <p style='font-family:Verdana,sans-serif;box-sizing:border-box;line-height:1.5em;text-align:left;margin:0;margin-top:0;font-size:12px;font-weight:600;margin-bottom:8px'>
                                                          Descripción: <span>`+info.company[0].SECTOR+`</span> </p>

                                                  </td>
                                              </tr>
                                              <tr>
                                                  <td style='font-family:Verdana,sans-serif;box-sizing:border-box;word-break:break-word' width='60%' valign='middle'>
                                                      <p style='font-family:Verdana,sans-serif;box-sizing:border-box;line-height:1.5em;text-align:left;margin:0;margin-top:0;font-size:12px;font-weight:600;margin-bottom:8px'>
                                                          Dirección: `+info.company[0].DIRECTION+` </p>
                                                  </td>
                                              </tr>

                                              <tr>
                                                  <td style='font-family:Verdana,sans-serif;box-sizing:border-box;word-break:break-word' colspan='2'>
                                                      <table style='font-family:Verdana,sans-serif;box-sizing:border-box' width='100%' cellpadding='0' cellspacing='0'>
                                                          <tbody style='font-family:Verdana,sans-serif;box-sizing:border-box'>
                                                              <tr>
                                                                  <th style='font-family:Verdana,sans-serif;box-sizing:border-box' width='100%'>
                                                                      <p style='font-family:Verdana,sans-serif;box-sizing:border-box;line-height:1.5em;text-align:left;margin:0;margin-top:0;font-size:12px;font-weight:600;margin-bottom:8px'>
                                                                          Celular: `+info.company[0].PHONE+`</p>
                                                                      <p style='font-family:Verdana,sans-serif;box-sizing:border-box;line-height:1.5em;text-align:left;margin:0;margin-top:0;font-size:12px;font-weight:600;margin-bottom:8px'>
                                                                          Email: `+info.company[0].EMAIL+`</p>
                                                                  </th>
                                                              </tr>
                                                          </tbody>
                                                      </table>
                                                  </td>
                                              </tr>
                                          </tbody>
                                        </table>
                                      </th>
                                      <th style='font-family:Verdana,sans-serif;box-sizing:border-box; border: 1px solid black; padding: 1%;' width='30%'>
                                        <table style='font-family:Verdana,sans-serif;box-sizing:border-box;margin-bottom:16px' width='100%' cellpadding='0' cellspacing='0'>
                                          <tbody style='font-family:Verdana,sans-serif;box-sizing:border-box'>
                                            <tr>
                                                <td style='font-family:Verdana,sans-serif;box-sizing:border-box;word-break:break-word' width='60%' valign='middle'>
                                                    <p style='font-family:Verdana,sans-serif;box-sizing:border-box;line-height:1.5em;text-align:center;margin:0;margin-top:0;font-size:20px;font-weight:600;margin-bottom:8px'>
                                                        Orden Electrónica </p>

                                                </td>
                                            </tr>
                                            <tr>
                                                <td style='font-family:Verdana,sans-serif;box-sizing:border-box;word-break:break-word' width='60%' valign='middle'>
                                                    <p style='font-family:Verdana,sans-serif;box-sizing:border-box;line-height:1.5em;text-align:center;margin:0;margin-top:0;font-size:18px;font-weight:200;margin-bottom:8px'>
                                                        RUC: `+info.company[0].RUC+` </p>
                                                </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </th>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                      </table>
                      <hr>
                      <table style='font-family:Verdana,sans-serif;box-sizing:border-box;margin-bottom:16px' width='100%' cellpadding='0' cellspacing='0'>
                          <tbody style='font-family:Verdana,sans-serif;box-sizing:border-box'>
                              <tr>
                                  <td style='font-family:Verdana,sans-serif;box-sizing:border-box;word-break:break-word' width='60%' valign='middle'>
                                      <p style='font-family:Verdana,sans-serif;box-sizing:border-box;line-height:1.5em;text-align:left;margin:0;margin-top:0;font-size:15px;font-weight:600;margin-bottom:8px'>
                                          Cliente:  `+((info.client[0].NOMBRE.trim()).length > 0 ? info.client[0].NOMBRE : info.client[0].TRADENAME)+` </p>

                                  </td>
                              </tr>
                              <tr>
                                  <td style='font-family:Verdana,sans-serif;box-sizing:border-box;word-break:break-word' width='60%' valign='middle'>
                                      <p style='font-family:Verdana,sans-serif;box-sizing:border-box;line-height:1.5em;text-align:left;margin:0;margin-top:0;font-size:15px;font-weight:600;margin-bottom:8px'>
                                          Dirección: `+info.client[0].DIRECTION+` </p>
                                  </td>
                              </tr>

                              <tr>
                                  <td style='font-family:Verdana,sans-serif;box-sizing:border-box;word-break:break-word' colspan='2'>
                                      <table style='font-family:Verdana,sans-serif;box-sizing:border-box' width='100%' cellpadding='0' cellspacing='0'>
                                          <tbody style='font-family:Verdana,sans-serif;box-sizing:border-box'>
                                              <tr>
                                                  <th style='font-family:Verdana,sans-serif;box-sizing:border-box' width='30%'>
                                                      <p style='font-family:Verdana,sans-serif;box-sizing:border-box;line-height:1.5em;text-align:left;margin:0;margin-top:0;font-size:15px;font-weight:600;margin-bottom:8px'>
                                                          DNI/RUC: `+dnioruc+`</p>
                                                  </th>
                                                  <th style='font-family:Verdana,sans-serif;box-sizing:border-box' width='30%'>
                                                      <p style='font-family:Verdana,sans-serif;box-sizing:border-box;line-height:1.5em;text-align:center;margin:0;margin-top:0;font-size:15px;font-weight:600;margin-bottom:8px'>
                                                          Moneda: <span style="font-weight: 100;">Sol</span></p>
                                                  </th>
                                                  <th style='font-family:Verdana,sans-serif;box-sizing:border-box' width='40%'>
                                                      <p style='font-family:Verdana,sans-serif;box-sizing:border-box;line-height:1.5em;text-align:center;margin:0;margin-top:0;font-size:15px;font-weight:600;margin-bottom:8px'>
                                                          Fecha: <span style="font-weight: 100;">`+venta.ORD_DATE_ORDER2+`</span></p>
                                                  </th>
                                              </tr>
                                          </tbody>
                                      </table>
                                  </td>
                              </tr>
                          </tbody>
                      </table>
                      <hr>
                      <table style='font-family:Verdana,sans-serif;box-sizing:border-box;margin-bottom:16px' width='100%' cellpadding='0' cellspacing='0'>
                          <tbody style='font-family:Verdana,sans-serif;box-sizing:border-box'>
                              <tr>
                                  <td style='font-family:Verdana,sans-serif;box-sizing:border-box;word-break:break-word' colspan='2'>
                                      <table style='font-family:Verdana,sans-serif;box-sizing:border-box' width='100%' cellpadding='0' cellspacing='0'>
                                          <tbody style='font-family:Verdana,sans-serif;box-sizing:border-box'>
                                              <tr>
                                                  <th style='font-family:Verdana,sans-serif;box-sizing:border-box' width='4%'>
                                                      <p style='font-family:Verdana,sans-serif;box-sizing:border-box;line-height:1.5em;text-align:left;margin:0;margin-top:0;font-size:12px;font-weight:600;margin-bottom:8px'>
                                                          ITEM</p>
                                                  </th>
                                                  <th style='font-family:Verdana,sans-serif;box-sizing:border-box' width='12.5%'>
                                                      <p style='font-family:Verdana,sans-serif;box-sizing:border-box;line-height:1.5em;text-align:center;margin:0;margin-top:0;font-size:12px;font-weight:600;margin-bottom:8px'>
                                                          CÓDIGO</p>
                                                  </th>
                                                  <th style='font-family:Verdana,sans-serif;box-sizing:border-box' width='12.5%'>
                                                      <p style='font-family:Verdana,sans-serif;box-sizing:border-box;line-height:1.5em;text-align:center;margin:0;margin-top:0;font-size:12px;font-weight:600;margin-bottom:8px'>
                                                          DESCRIPCIÓN</p>
                                                  </th>
                                                  <th style='font-family:Verdana,sans-serif;box-sizing:border-box' width='12.5%'>
                                                      <p style='font-family:Verdana,sans-serif;box-sizing:border-box;line-height:1.5em;text-align:right;margin:0;margin-top:0;font-size:12px;font-weight:600;margin-bottom:8px'>
                                                          CANTIDAD</p>
                                                  </th>
                                                  <th style='font-family:Verdana,sans-serif;box-sizing:border-box' width='12.5%'>
                                                      <p style='font-family:Verdana,sans-serif;box-sizing:border-box;line-height:1.5em;text-align:right;margin:0;margin-top:0;font-size:12px;font-weight:600;margin-bottom:8px'>
                                                          PRECIO UNITARIO</p>
                                                  </th>
                                                  <th style='font-family:Verdana,sans-serif;box-sizing:border-box' width='12.5%'>
                                                      <p style='font-family:Verdana,sans-serif;box-sizing:border-box;line-height:1.5em;text-align:right;margin:0;margin-top:0;font-size:12px;font-weight:600;margin-bottom:8px'>
                                                          PRECIO SUBTOTAL</p>
                                                  </th>
                                                  <th style='font-family:Verdana,sans-serif;box-sizing:border-box' width='12.5%'>
                                                      <p style='font-family:Verdana,sans-serif;box-sizing:border-box;line-height:1.5em;text-align:right;margin:0;margin-top:0;font-size:12px;font-weight:600;margin-bottom:8px'>
                                                          DESCUENTO</p>
                                                  </th>
                                                  <th style='font-family:Verdana,sans-serif;box-sizing:border-box' width='12.5%'>
                                                      <p style='font-family:Verdana,sans-serif;box-sizing:border-box;line-height:1.5em;text-align:right;margin:0;margin-top:0;font-size:12px;font-weight:600;margin-bottom:8px'>
                                                          PRECIO TOTAL</p>
                                                  </th>
                                              </tr>
                                          </tbody>
                                      </table>
                                  </td>
                              </tr>
                          </tbody>
                      </table>
                      <hr>
                      `+productArray+`
                      <hr>
                      <br>
                      <table style='font-family:Verdana,sans-serif;box-sizing:border-box;margin-bottom:16px' width='100%' cellpadding='0' cellspacing='0'>
                          <tbody style='font-family:Verdana,sans-serif;box-sizing:border-box'>
                              <tr>
                                  <td style='font-family:Verdana,sans-serif;box-sizing:border-box;word-break:break-word' colspan='2'>
                                      <table style='font-family:Verdana,sans-serif;box-sizing:border-box' width='100%' cellpadding='0' cellspacing='0'>
                                          <tbody style='font-family:Verdana,sans-serif;box-sizing:border-box'>
                                              <tr>
                                                  <th style='font-family:Verdana,sans-serif;box-sizing:border-box' width='60%'>
                                                      <p style='font-family:Verdana,sans-serif;box-sizing:border-box;line-height:1.5em;text-align:left;margin:0;margin-top:0;font-size:15px;font-weight:600;margin-bottom:8px'>
                                                      SON: `+venta.TOTAL+` con 0/100 soles</p>
                                                  </th>
                                                  <th style='font-family:Verdana,sans-serif;box-sizing:border-box' width='40%'>
                                                      <table style='font-family:Verdana,sans-serif;box-sizing:border-box' width='100%' cellpadding='0' cellspacing='0'>
                                                          <tbody style='font-family:Verdana,sans-serif;box-sizing:border-box'>
                                                              <tr>
                                                                  <th style='font-family:Verdana,sans-serif;box-sizing:border-box; padding-right: 5%; border: 1px solid black;' width='50%'>
                                                                      <p style='font-family:Verdana,sans-serif;box-sizing:border-box;line-height:1.5em;text-align:right;margin:0;margin-top:0;font-size:15px;font-weight:600;margin-bottom:8px'>
                                                                          Operación grabada</p>
                                                                  </th>
                                                                  <th style='font-family:Verdana,sans-serif;box-sizing:border-box; border: 1px solid black; padding-left: 5%;' width='50%'>
                                                                      <p style='font-family:Verdana,sans-serif;box-sizing:border-box;line-height:1.5em;text-align:left;margin:0;margin-top:0;font-size:15px;font-weight:600;margin-bottom:8px'>
                                                                          s/. `+venta.TOTAL+`</p>
                                                                  </th>
                                                              </tr>
                                                          </tbody>
                                                      </table>
                                                      <table style='font-family:Verdana,sans-serif;box-sizing:border-box' width='100%' cellpadding='0' cellspacing='0'>
                                                          <tbody style='font-family:Verdana,sans-serif;box-sizing:border-box'>
                                                              <tr>
                                                                  <th style='font-family:Verdana,sans-serif;box-sizing:border-box;padding-right: 5%; border: 1px solid black;' width='50%'>
                                                                      <p style='font-family:Verdana,sans-serif;box-sizing:border-box;line-height:1.5em;text-align:right;margin:0;margin-top:0;font-size:15px;font-weight:600;margin-bottom:8px'>
                                                                          Operación exonerada</p>
                                                                  </th>
                                                                  <th style='font-family:Verdana,sans-serif;box-sizing:border-box; padding-left: 5%; border: 1px solid black;' width='50%'>
                                                                      <p style='font-family:Verdana,sans-serif;box-sizing:border-box;line-height:1.5em;text-align:left;margin:0;margin-top:0;font-size:15px;font-weight:600;margin-bottom:8px'>
                                                                      s/. 00.0</p>
                                                                  </th>
                                                              </tr>
                                                          </tbody>
                                                      </table>
                                                      <table style='font-family:Verdana,sans-serif;box-sizing:border-box' width='100%' cellpadding='0' cellspacing='0'>
                                                          <tbody style='font-family:Verdana,sans-serif;box-sizing:border-box'>
                                                              <tr>
                                                                  <th style='font-family:Verdana,sans-serif;box-sizing:border-box;padding-right: 5%;border: 1px solid black;' width='50%'>
                                                                      <p style='font-family:Verdana,sans-serif;box-sizing:border-box;line-height:1.5em;text-align:right;margin:0;margin-top:0;font-size:15px;font-weight:600;margin-bottom:8px'>
                                                                          Operación inafecta

                                                                      </p>
                                                                  </th>
                                                                  <th style='font-family:Verdana,sans-serif;box-sizing:border-box;padding-left: 5%; border: 1px solid black;' width='50%'>
                                                                      <p style='font-family:Verdana,sans-serif;box-sizing:border-box;line-height:1.5em;text-align:left;margin:0;margin-top:0;font-size:15px;font-weight:600;margin-bottom:8px'>
                                                                          s/. 00.0</p>
                                                                  </th>
                                                              </tr>
                                                          </tbody>
                                                      </table>
                                                      <table style='font-family:Verdana,sans-serif;box-sizing:border-box;' width='100%' cellpadding='0' cellspacing='0'>
                                                          <tbody style='font-family:Verdana,sans-serif;box-sizing:border-box'>
                                                              <tr>
                                                                  <th style='font-family:Verdana,sans-serif;box-sizing:border-box;padding-right: 5%;border: 1px solid black;' width='50%'>
                                                                      <p style='font-family:Verdana,sans-serif;box-sizing:border-box;line-height:1.5em;text-align:right;margin:0;margin-top:0;font-size:15px;font-weight:600;margin-bottom:8px;'>
                                                                          IGV</p>
                                                                  </th>
                                                                  <th style='font-family:Verdana,sans-serif;box-sizing:border-box;padding-left: 5%; border: 1px solid black;' width='50%'>
                                                                      <p style='font-family:Verdana,sans-serif;box-sizing:border-box;line-height:1.5em;text-align:left;margin:0;margin-top:0;font-size:15px;font-weight:600;margin-bottom:8px'>
                                                                        s/. `+  String(venta.IGV).substring(0,5) +`</p>
                                                                  </th>
                                                              </tr>
                                                          </tbody>
                                                      </table>
                                                      <table style='font-family:Verdana,sans-serif;box-sizing:border-box;' width='100%' cellpadding='0' cellspacing='0'>
                                                          <tbody style='font-family:Verdana,sans-serif;box-sizing:border-box'>
                                                              <tr>
                                                                  <th style='font-family:Verdana,sans-serif;box-sizing:border-box;padding-right: 5%; border: 1px solid black;' width='50%'>
                                                                      <p style='font-family:Verdana,sans-serif;box-sizing:border-box;line-height:1.5em;text-align:right;margin:0;margin-top:0;font-size:15px;font-weight:600;margin-bottom:8px'>
                                                                          Importe total</p>
                                                                  </th>
                                                                  <th style='font-family:Verdana,sans-serif;box-sizing:border-box; padding-left: 5%;border: 1px solid black;' width='50%'>
                                                                      <p style='font-family:Verdana,sans-serif;box-sizing:border-box;line-height:1.5em;text-align:left;margin:0;margin-top:0;font-size:15px;font-weight:600;margin-bottom:8px'>
                                                                      s/. `+venta.TOTAL+`</p>
                                                                  </th>
                                                              </tr>
                                                          </tbody>
                                                      </table>
                                                  </th>
                                              </tr>
                                          </tbody>
                                      </table>
                                  </td>
                              </tr>
                          </tbody>
                      </table>
                  </td>
              </tr>

          </tbody>
      </table>
    `;
    await savePDF(await voucher);

    }

  }

  async function savePDF(voucher: any) {
    var doc = new jsPDF();
    doc.html(voucher, {
      callback: function (doc) {
        doc.save("Detalle_Pedido_" + venta.PEDIDO);
      },
      x: 5,
      y: 10,
      windowWidth: 10,
      width: 2.2,
    });
  }
  return (
    <>
      <div onClick={() => disabled === false ? generateVoucherFile(): <></>} >{children}</div>
    </>
  );
};
