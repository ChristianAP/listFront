
import { MyContain } from "../../../UI/Components/MyContain";
import React from "react";
import "./InputSearch.css";
import { ProductFindComp } from "../../../../Client/UI/Component/CategoriaComp";

export const Buscador = (props: any) => {
  return (
    <React.Fragment>
      <MyContain>
        <ProductFindComp
          setProduct={props.SetProductoMuestra}
          SetFormDetalle={props.SetFormDetalle}
          remision={0}
          vistaDescripcion={props.vistaDescripcion}
          productoMuestra={props.productoMuestra}
          SetVistaDescripcion={props.SetVistaDescripcion}
          formDetalle={props.formDetalle}
          nextStep = {props.nextStep}
          setNextStep = {props.setNextStep}
        />
      </MyContain>

    </React.Fragment>
  );
};
