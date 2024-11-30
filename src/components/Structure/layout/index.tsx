import SidebarByAntMenu from "components/Structure/sidebar";
import React, { FC } from "react";
import Header from "../header";
import "./style.scss";

const Layout: FC<{ children: React.ReactNode }> = ({ children }): JSX.Element => {

  return (
    <div className="layout">
      <Header />
      <SidebarByAntMenu />
      <div className="content">
        {children}
      </div>
    </div>
  )
}

export default React.memo(Layout);