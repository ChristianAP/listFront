
import { AdminState } from "../../../Data/Atoms/Admin";
import { useRecoilState } from "recoil";
import React from "react";
import "./Header.css";

export const Header = () => {
  const [admin, setAdmin] = useRecoilState(AdminState);

  const LogOut = () => setAdmin({ ...admin, auth: false });

  return (
    <>asdasdasd</>
  );
};
