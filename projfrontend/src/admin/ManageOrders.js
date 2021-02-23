import React, { useState, useEffect } from "react";
import { isAutheticated } from "../auth/helper";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserEdit, faHouseUser } from "@fortawesome/free-solid-svg-icons";
import Base from "./../core/Base";
import { loadCart } from "../core/helper/cartHelper";
import "./manageOrder.css";
import { getAllOrders } from "./helper/adminapicall";
import { Link } from "react-router-dom";

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [cartProducts, setCartProducts] = useState([]);

  const { user, token } = isAutheticated();

  const loadData = () => {
    getAllOrders(user._id, token).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setOrders(data);
      }
    });
  };

  useEffect(() => {
    setCartProducts(loadCart());
    loadData();
  }, []);

  return (
    <Base
      title="Manage Categories"
      description="Manage categories"
      cartProdCount={cartProducts.length}
    >
      <h2
        className="heading"
        style={{ color: "#2be877", marginTop: "30px" }}
      >
        --------: Manage All Orders Here :--------
      </h2>
      <Link
        className="btn btn-info"
        style={{ marginBottom: "15px" }}
        to={`/admin/dashboard`}
      >
        <span className="">
          Admin Home
          <FontAwesomeIcon
            style={{ fontSize: "25px", color: "#fbbc20" }}
            icon={faHouseUser}
          />
        </span>
      </Link>
      <table className="table table-warning">
        <thead>
          <tr style={{ fontSize: "23px", color: "green" }}>
            <th scope="col">Product Details</th>
            <th scope="col">Customer Name</th>
            <th scope="col">Total Amount ($)</th>
            <th scope="col">Order Status</th>
            <th scope="col">Last Update</th>
          </tr>
        </thead>
        <tbody>
          {orders
            .slice()
            .reverse()
            .map((order, index) => {
              return (
                <tr
                  className="text-black bg-info"
                  style={{ fontWeight: "bolder" }}
                  key={index}
                >
                  <td>
                    {order.products.map((product, index) => {
                      return (
                        <ul className="list-group mt-2" key={index}>
                          {order.products.length > 1 && (
                            <h3
                              style={{ color: "#b90234", fontWeight: "bolder" }}
                            >
                              Product {index + 1}
                            </h3>
                          )}
                          <li className="list-group-item">
                            <span
                              className="badge badge-success mr-2"
                              style={{ fontSize: "19px" }}
                            >
                              Product Name:
                            </span>{" "}
                            {product.name}
                          </li>
                          <li className="list-group-item">
                            <span
                              className="badge badge-success mr-2"
                              style={{ fontSize: "19px" }}
                            >
                              Product Count:
                            </span>{" "}
                            {product.count}
                          </li>
                          <li className="list-group-item">
                            <span
                              className="badge badge-success mr-2"
                              style={{ fontSize: "19px" }}
                            >
                              Product Amount:
                            </span>{" "}
                            {product.price}
                          </li>
                        </ul>
                      );
                    })}
                  </td>
                  <td style={{ fontSize: "26px" }}>{order.user.name}</td>
                  <td style={{ fontSize: "26px" }}>{order.amount}</td>
                  <td style={{ fontSize: "26px" }}>
                    {order.status}
                    <Link
                      style={{ color: "#7bf985", marginLeft: "10px" }}
                      to={`/admin/order/update/${order._id}`}
                    >
                      <FontAwesomeIcon
                        style={{ fontSize: "20px" }}
                        icon={faUserEdit}
                      />
                    </Link>
                  </td>
                  <td style={{ fontSize: "26px" }}>{order.updated}</td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </Base>
  );
};

export default ManageOrders;
