import React, { useState, useEffect } from "react";
import Base from "../core/Base";
import { isAutheticated } from "../auth/helper/index";
import { Link } from "react-router-dom";
import { loadCart } from "../core/helper/cartHelper";
import "./admindashboard.css";

const AdminDashBoard = () => {
  const {
    user: { name, email, role },
  } = isAutheticated();

  const [cartProducts, setCartProducts] = useState([]);

  const adminLeftSide = () => {
    return (
      <div className="card">
        <h4 className="card-header bg-dark text-white">Admin Navigation</h4>
        <ul className="list-group" style={{ fontSize: "25px" }}>
          <li className="list-group-item">
            <Link to="/admin/create/category" className="nav-link text-success">
              Create Categories
            </Link>
          </li>
          <li className="list-group-item">
            <Link to="/admin/categories" className="nav-link text-success">
              Manage Categories
            </Link>
          </li>
          <li className="list-group-item">
            <Link to="/admin/create/product" className="nav-link text-success">
              Create Product
            </Link>
          </li>
          <li className="list-group-item">
            <Link to="/admin/products" className="nav-link text-success">
              Manage Products
            </Link>
          </li>
          <li className="list-group-item">
            <Link to="/admin/orders" className="nav-link text-success">
              Manage Orders
            </Link>
          </li>
        </ul>
      </div>
    );
  };

  const adminRightSide = () => {
    return (
      <div className="card mb-4">
        <h4 className="card-header">Admin Information</h4>
        <ul className="list-group">
          <li className="list-group-item">
            <span
              className="badge badge-success mr-2"
              style={{ fontSize: "22px" }}
            >
              Name:
            </span>{" "}
            {name.toUpperCase()}
          </li>
          <li className="list-group-item">
            <span
              className="badge badge-success mr-2"
              style={{ fontSize: "22px" }}
            >
              Email:
            </span>{" "}
            {email}
          </li>

          <li className="list-group-item">
            <span className="badge badge-danger">Admin Area</span>
          </li>
        </ul>
      </div>
    );
  };

  useEffect(() => {
    setCartProducts(loadCart());
  }, []);

  return (
    <Base
      cartProdCount={cartProducts.length}
      title="Welcome to admin area"
      description="Manage all of your products here"
      className="container bg-success p-4 mt-5"
    >
      <div id="admin-container">
        <div id="adminright">{adminRightSide()}</div>
        <div id="adminleft" style={{textAlign: "center", margin: "0 auto"}}>{adminLeftSide()}</div>
      </div>
    </Base>
  );
};

export default AdminDashBoard;
