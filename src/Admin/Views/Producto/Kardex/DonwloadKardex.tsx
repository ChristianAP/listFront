import React, { useState } from "react";
import { jsPDF } from "jspdf";
import { AdminState } from "../../../../Data/Atoms/Admin";
import { useRecoilState } from "recoil";
import { Button, useToast } from "@chakra-ui/react";
import { FaFileDownload } from "react-icons/fa";

export const DonwloadKardexPDF = ({
  infoProducto,
  kardexListProducto,
  isDonwloading,
}: {
  infoProducto: any;
  kardexListProducto: Array<any>;
  isDonwloading: any,
}) => {
    let date: Date = new Date();
    const [admin, setAdmin] = useRecoilState(AdminState);
    const [ isDonwload, setIsDonwload ] = useState(isDonwloading);
    const toast = useToast();

    let today = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + "  " + date.getHours() + ":" + date.getMinutes() +":"+ date.getSeconds();

    async function generateKardexProduct() {
        setIsDonwload(true);
        let status = infoProducto.PRO_STATUS == 1 ? "Activo" : "Inactivo";

      if(kardexListProducto.length != 0){
        let productArray = "";
        kardexListProducto.map((val:any, idx:any )=>{
            if(val.SDT_ACTION == "1"){
                val.SDT_ACTION = "ENTRADA";
                val.SDT_DETAILS = `Compra ${val.SDT_DETAILS}`;
            }else if(val.SDT_ACTION == null){
                val.SDT_ACTION = "SALIDA";
                val.SDT_DETAILS = `Venta ${val.SDT_DETAILS}`;
            }

          productArray = productArray + `
            <table style='font-family:Verdana,sans-serif;box-sizing:border-box;margin-bottom:16px' width='100%' cellpadding='0' cellspacing='0'>
                <tbody style='font-family:Verdana,sans-serif;box-sizing:border-box'>
                    <tr>
                        <td style='font-family:Verdana,sans-serif;box-sizing:border-box;word-break:break-word' colspan='2'>
                            <table style='font-family:Verdana,sans-serif;box-sizing:border-box' width='100%' cellpadding='0' cellspacing='0'>
                                <tbody style='font-family:Verdana,sans-serif;box-sizing:border-box'>
                                    <tr>
                                        <th style='font-family:Verdana,sans-serif;box-sizing:border-box' width='12.5%'>
                                            <p style='font-family:Verdana,sans-serif;box-sizing:border-box;line-height:1.5em;text-align:left;margin:0;margin-top:0;font-size:12px;font-weight:600;margin-bottom:8px'>
                                                `+val.SDT_ACTION+`</p>
                                        </th>
                                        <th style='font-family:Verdana,sans-serif;box-sizing:border-box' width='12.5%'>
                                            <p style='font-family:Verdana,sans-serif;box-sizing:border-box;line-height:1.5em;text-align:center;margin:0;margin-top:0;font-size:12px;font-weight:600;margin-bottom:8px'>
                                            `+val.SDT_DATE+`</p>
                                        </th>
                                        <th style='font-family:Verdana,sans-serif;box-sizing:border-box' width='20%'>
                                            <p style='font-family:Verdana,sans-serif;box-sizing:border-box;line-height:1.5em;text-align:center;margin:0;margin-top:0;font-size:12px;font-weight:600;margin-bottom:8px'>
                                            `+val.SDT_DETAILS+`</p>
                                        </th>
                                        <th style='font-family:Verdana,sans-serif;box-sizing:border-box' width='12.5%'>
                                            <p style='font-family:Verdana,sans-serif;box-sizing:border-box;line-height:1.5em;text-align:right;margin:0;margin-top:0;font-size:12px;font-weight:600;margin-bottom:8px'>
                                            `+val.SDT_AMOUNT+`</p>
                                        </th>
                                        <th style='font-family:Verdana,sans-serif;box-sizing:border-box' width='12.5%'>
                                            <p style='font-family:Verdana,sans-serif;box-sizing:border-box;line-height:1.5em;text-align:right;margin:0;margin-top:0;font-size:12px;font-weight:600;margin-bottom:8px'>
                                            `+val.SDT_PRICE+`</p>
                                        </th>
                                            <th style='font-family:Verdana,sans-serif;box-sizing:border-box' width='12.5%'>
                                                <p style='font-family:Verdana,sans-serif;box-sizing:border-box;line-height:1.5em;text-align:right;margin:0;margin-top:0;font-size:12px;font-weight:600;margin-bottom:8px'>
                                                `+val.SDT_TOTAL+`</p>
                                        </th>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                </tbody>
            </table> 
            <hr>
            `;
        });

        let kardexProduct = `
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
                              <p style='font-family:Verdana,sans-serif;box-sizing:border-box;line-height:1.5em;text-align:center;margin:0;margin-top:0;font-size:22px;font-weight:600;margin-bottom:8px'>
                                  KARDEX - `+infoProducto.PRO_NAME+`</p>
                              <p style='font-family:Verdana,sans-serif;box-sizing:border-box;line-height:1.5em;text-align:center;margin:0;margin-top:0;font-size:10px;font-weight:200;margin-bottom:8px'>
                                  Usuario descarga: `+admin.user+`</p>
                                  <p style='font-family:Verdana,sans-serif;box-sizing:border-box;line-height:1.5em;text-align:center;margin:0;margin-top:0;font-size:10px;font-weight:200;margin-bottom:8px'>
                                  Fecha descarga: `+today+`</p>
                          </table>
                          <hr>
                          <table style='font-family:Verdana,sans-serif;box-sizing:border-box;margin-bottom:16px' width='100%' cellpadding='0' cellspacing='0'>
                              <tbody style='font-family:Verdana,sans-serif;box-sizing:border-box'>
                                  <tr>
                                      <td style='font-family:Verdana,sans-serif;box-sizing:border-box;word-break:break-word' colspan='2'>
                                          <table style='font-family:Verdana,sans-serif;box-sizing:border-box' width='100%' cellpadding='0' cellspacing='0'>
                                              <tbody style='font-family:Verdana,sans-serif;box-sizing:border-box'>
                                                  <tr>
                                                      <th style='font-family:Verdana,sans-serif;box-sizing:border-box' width='30%'>
                                                          <p style='font-family:Verdana,sans-serif;box-sizing:border-box;line-height:1.5em;text-align:left;margin:0;margin-top:0;font-size:15px;font-weight:600;margin-bottom:8px'>
                                                              ITEM:<span style="font-weight: 100;">`+infoProducto.PRO_NAME+`</span></p>
                                                      </th>
                                                      <th style='font-family:Verdana,sans-serif;box-sizing:border-box' width='30%'>
                                                          <p style='font-family:Verdana,sans-serif;box-sizing:border-box;line-height:1.5em;text-align:center;margin:0;margin-top:0;font-size:15px;font-weight:600;margin-bottom:8px'>
                                                              CATEGORIA: <span style="font-weight: 100;">`+infoProducto.CAT_NAME+`</span></p>
                                                      </th>
                                                      <th style='font-family:Verdana,sans-serif;box-sizing:border-box' width='40%'>
                                                          <p style='font-family:Verdana,sans-serif;box-sizing:border-box;line-height:1.5em;text-align:center;margin:0;margin-top:0;font-size:15px;font-weight:600;margin-bottom:8px'>
                                                              DESCRIPCIÓN: <span style="font-weight: 100;">`+infoProducto.PRO_DESCRIPTION+`</span></p>
                                                      </th>
                                                  </tr>
                                              </tbody>
                                          </table>
                                      </td>
                                  </tr>
                                  <tr>
                                      <td style='font-family:Verdana,sans-serif;box-sizing:border-box;word-break:break-word' colspan='2'>
                                          <table style='font-family:Verdana,sans-serif;box-sizing:border-box' width='100%' cellpadding='0' cellspacing='0'>
                                              <tbody style='font-family:Verdana,sans-serif;box-sizing:border-box'>
                                                  <tr>
                                                      <th style='font-family:Verdana,sans-serif;box-sizing:border-box' width='30%'>
                                                          <p style='font-family:Verdana,sans-serif;box-sizing:border-box;line-height:1.5em;text-align:center;margin:0;margin-top:0;font-size:15px;font-weight:600;margin-bottom:8px'>
                                                              CÓDIGO: <span style="font-weight: 100;">`+infoProducto.PRO_CODE+`</span></p>
                                                      </th>
                                                      <th style='font-family:Verdana,sans-serif;box-sizing:border-box' width='40%'>
                                                          <p style='font-family:Verdana,sans-serif;box-sizing:border-box;line-height:1.5em;text-align:center;margin:0;margin-top:0;font-size:15px;font-weight:600;margin-bottom:8px'>
                                                              FECHA DE CREACIÓN: <span style="font-weight: 100;">`+infoProducto.PRO_CREATE_DATE+`</span></p>
                                                      </th>
                                                  </tr>
                                              </tbody>
                                          </table>
                                      </td>
                                  </tr>

                                  <tr>
                                      <td style='font-family:Verdana,sans-serif;box-sizing:border-box;word-break:break-word' colspan='2'>
                                          <table style='font-family:Verdana,sans-serif;box-sizing:border-box' width='100%' cellpadding='0' cellspacing='0'>
                                              <tbody style='font-family:Verdana,sans-serif;box-sizing:border-box'>
                                                  <tr>
                                                      <th style='font-family:Verdana,sans-serif;box-sizing:border-box' width='30%'>
                                                          <p style='font-family:Verdana,sans-serif;box-sizing:border-box;line-height:1.5em;text-align:left;margin:0;margin-top:0;font-size:15px;font-weight:600;margin-bottom:8px'>
                                                              ESTADO DE ITEM:<span style="font-weight: 100;">`+ status +`</span>
                                                          </p>
                                                      </th>
                                                      <th style='font-family:Verdana,sans-serif;box-sizing:border-box' width='30%'>
                                                          <p style='font-family:Verdana,sans-serif;box-sizing:border-box;line-height:1.5em;text-align:center;margin:0;margin-top:0;font-size:15px;font-weight:600;margin-bottom:8px'>
                                                              STOCK INICIAL: <span style="font-weight: 100;">`+infoProducto.STK_INITIAL_STOCK+`</span></p>
                                                      </th>
                                                      <th style='font-family:Verdana,sans-serif;box-sizing:border-box' width='40%'>
                                                          <p style='font-family:Verdana,sans-serif;box-sizing:border-box;line-height:1.5em;text-align:center;margin:0;margin-top:0;font-size:15px;font-weight:600;margin-bottom:8px'>
                                                              STOCK ACTUAL: <span style="font-weight: 100;">`+infoProducto.STK_TODAY+`</span></p>
                                                      </th>
                                                  </tr>
                                              </tbody>
                                          </table>
                                      </td>
                                  </tr>
                              </tbody>
                          </table>
                          <br>
                          <hr>
                            <table style='font-family:Verdana,sans-serif;box-sizing:border-box;margin-bottom:16px' width='100%' cellpadding='0' cellspacing='0'>
                              <tbody style='font-family:Verdana,sans-serif;box-sizing:border-box'>
                                  <tr>
                                      <td style='font-family:Verdana,sans-serif;box-sizing:border-box;word-break:break-word' colspan='2'>
                                          <table style='font-family:Verdana,sans-serif;box-sizing:border-box' width='100%' cellpadding='0' cellspacing='0'>
                                              <tbody style='font-family:Verdana,sans-serif;box-sizing:border-box'>
                                                  <tr>
                                                      <th style='font-family:Verdana,sans-serif;box-sizing:border-box' width='12.5%'>
                                                          <p style='font-family:Verdana,sans-serif;box-sizing:border-box;line-height:1.5em;text-align:left;margin:0;margin-top:0;font-size:12px;font-weight:600;margin-bottom:8px'>
                                                              MOVIMIENTO</p>
                                                      </th>
                                                      <th style='font-family:Verdana,sans-serif;box-sizing:border-box' width='12.5%'>
                                                          <p style='font-family:Verdana,sans-serif;box-sizing:border-box;line-height:1.5em;text-align:center;margin:0;margin-top:0;font-size:12px;font-weight:600;margin-bottom:8px'>
                                                              FECHA</p>
                                                      </th>
                                                      <th style='font-family:Verdana,sans-serif;box-sizing:border-box' width='12.5%'>
                                                          <p style='font-family:Verdana,sans-serif;box-sizing:border-box;line-height:1.5em;text-align:center;margin:0;margin-top:0;font-size:12px;font-weight:600;margin-bottom:8px'>
                                                              DETALLE</p>
                                                      </th>
                                                      <th style='font-family:Verdana,sans-serif;box-sizing:border-box' width='12.5%'>
                                                          <p style='font-family:Verdana,sans-serif;box-sizing:border-box;line-height:1.5em;text-align:right;margin:0;margin-top:0;font-size:12px;font-weight:600;margin-bottom:8px'>
                                                              CANTIDAD</p>
                                                      </th>
                                                      <th style='font-family:Verdana,sans-serif;box-sizing:border-box' width='12.5%'>
                                                          <p style='font-family:Verdana,sans-serif;box-sizing:border-box;line-height:1.5em;text-align:right;margin:0;margin-top:0;font-size:12px;font-weight:600;margin-bottom:8px'>
                                                              VALOR UNITARIO</p>
                                                      </th>
                                                          <th style='font-family:Verdana,sans-serif;box-sizing:border-box' width='12.5%'>
                                                              <p style='font-family:Verdana,sans-serif;box-sizing:border-box;line-height:1.5em;text-align:right;margin:0;margin-top:0;font-size:12px;font-weight:600;margin-bottom:8px'>
                                                                  VALOR TOTAL</p>
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
                    </td>
                </tr>
            </tbody>
        </table >`;
       
        await savePDF(await kardexProduct);
        toast({
            title: 'Descarga Exitosa.',
            description: `La descarga del Kardex de ${infoProducto.PRO_NAME}, ha sido exitosa. `,
            status: 'success',
            duration: 9000,
            isClosable: true,
          });
        setIsDonwload(false);

      }
    }

    async function savePDF(kardexProduct: any) {
      var doc = new jsPDF();
      doc.html(kardexProduct, {
        callback: function (doc) {
          doc.save("Kardex_Producto_" + infoProducto.PRO_CODE);
        },
        x: 5,
        y: 9,
        margin: [8,0,10,0],
        windowWidth: 10,
        width: 2.2,
      });
    }

    async function nonData() {
     return toast({
        title: 'Sin movimientos registrados.',
        description: 'El producto no tiene movimientos registrados.',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    }

    return (
        <>
            <Button variant="solid" colorScheme="red" mr={3} isLoading={kardexListProducto.length === 0 ? false:isDonwload} onClick={() => kardexListProducto.length === 0 ? nonData(): generateKardexProduct()}>
                Descargar Kardex <FaFileDownload style={{ margin: "4" }} />{" "}
            </Button>
        </>
    );
};
