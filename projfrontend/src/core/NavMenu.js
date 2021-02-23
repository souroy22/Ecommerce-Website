import React, { Fragment, useState } from "react";
import { Link, withRouter } from "react-router-dom";
import { isAutheticated, signout } from "./../auth/helper/index";
import "./navmenu.css";

const currentTab = (history, path) => {
  if (history.location.pathname === path) {
    return { color: "#2ecc72" };
  } else {
    return { color: "#FFFFFF" };
  }
};

const NavMenu = ({ history, cartProdCount }) => {
  // console.log(cartProdCount);
  return (
    <div style={{ borderBottom: "1px solid white" }}>
      <ul className="bg-dark nav-container" style={{ fontSize: "21px" }}>
        <li className="" style={{ fontWeight: "bolder" }}>
          <Link style={currentTab(history, "/")} className="nav-link" to="/">
            Home
          </Link>
        </li>

        {isAutheticated() && (
          <li className="" style={{ fontWeight: "bolder" }}>
            <Link
              className="nav-link"
              to="/user/dashboard"
              style={currentTab(history, "/user/dashboard")}
            >
              User Dashboard
            </Link>
          </li>
        )}

        {isAutheticated() && isAutheticated().user.role === 1 && (
          <li className="" style={{ fontWeight: "bolder" }}>
            <Link
              className="nav-link"
              to="/admin/dashboard"
              style={currentTab(history, "/admin/dashboard")}
            >
              Admin Dashboard
            </Link>
          </li>
        )}

        <li
          className=""
          style={{ fontWeight: "bolder", marginTop: "-4px" }}
        >
          <Link
            style={currentTab(history, "/cart")}
            className="nav-link"
            to="/cart"
          >
            Cart
            {cartProdCount > 0 && (
              <h3
                style={{
                  color: "white",
                  fontWeight: "bolder",
                  border: "2px solid navy",
                  borderRadius: "50%",
                  height: "35px",
                  width: "35px",

                  display: "inline-block",
                  margin: "0px",

                  backgroundColor: "navy",
                  textAlign: "center",
                }}
              >
                {cartProdCount}
              </h3>
            )}
          </Link>
        </li>

        {!isAutheticated() && (
          <Fragment>
            <li className="" style={{ fontWeight: "bolder" }}>
              <Link
                className="nav-link"
                to="/signin"
                style={currentTab(history, "/signin")}
              >
                Signin
              </Link>
            </li>
            <li className="" style={{ fontWeight: "bolder" }}>
              <Link
                className="nav-link"
                to="/signup"
                style={currentTab(history, "/signup")}
              >
                Signup
              </Link>
            </li>
          </Fragment>
        )}

        {isAutheticated() && (
          <li
            className=""
            style={{
              fontWeight: "bolder",
              cursor: "pointer",
              marginRight: "0px",
            }}
          >
            <span
              className="nav-link text-warning"
              onClick={() => {
                signout(() => {
                  history.push("/");
                });
              }}
            >
              Signout
            </span>
          </li>
        )}
      </ul>
    </div>
  );
};

export default withRouter(NavMenu);
