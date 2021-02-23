import React from "react";
import NavMenu from "./NavMenu";
import ReactNotification from "react-notifications-component";


const Base = ({
  className = "bg-dark text-white p-0 m-0",
  children,
  cartProdCount,
}) => (
  <div>
    <NavMenu cartProdCount={cartProdCount} />
    <div className="container-fluid">
      <div className={className} style={{ marginButtom: "100px" }}>
        {children}
      </div>
    </div>
    <ReactNotification />
  </div>
);

export default Base;
