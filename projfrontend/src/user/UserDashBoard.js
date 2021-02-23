import React, { Fragment, useEffect, useState } from "react";
import { isAutheticated } from "../auth/helper";
import { orderDetails } from "./helper/userapicalls";
import Base from "../core/Base";
import { loadCart } from "../core/helper/cartHelper";
import { Modal } from "react-bootstrap";
import "./userdashBoard.css";
import emailjs from "emailjs-com";
import swal from "sweetalert";

const UserDashBoard = () => {
  const { user, token } = isAutheticated();
  const [orders, setOrders] = useState([]);
  const {
    user: { name, email, role },
  } = isAutheticated();

  const [cartProducts, setCartProducts] = useState([]);

  const [showCart, setShowCart] = useState(false);

  const showingContactPage = () => {
    setShowCart(true);
  };
  const sendEmail = (e) => {
    e.preventDefault();
    emailjs
      .sendForm(
        "service_d1pld4t",
        "template_igiztjj",
        e.target,
        "user_t6g7XtPPRVhNiAKN8GnuY"
      )
      .then(
        (result) => {
          console.log("");
        },
        (error) => {
          console.log(error.text);
        }
      );
    closeCart();
    setTimeout(displaySuccessMessage, 2500)
  };

  const displaySuccessMessage = () => {
    swal({
      title: "We got your issue",
      text: "Your issue is successfully mailed to the seller",
      icon: "success",
      button: "Thanks for Contacting Us",
    });
  }

  const ContactUsPage = () => {
    return (
      <Modal show={showCart} onHide={() => closeCart()}>
        <div className="modal-header">
          <h3 className="modal-title" id="exampleModalLabel">
            Submit your issue
          </h3>
          <button
            onClick={() => closeCart()}
            style={{
              backgroundColor: "transparent",
              textAlign: "right",
              borderStyle: "none",
              width: "40px",
              fontSize: "21px",
              textAlign: "center",
              fontWeight: "bolder"
            }}
          >
            X
          </button>
        </div>
        <Modal.Body style={{paddingTop: "0"}}>
          <form onSubmit={sendEmail}>
            <input
              onChange={() => console.log("")}
              style={{ display: "none" }}
              name="name"
              value={user.name}
            />
            <input
              onChange={() => console.log("")}
              style={{ display: "none" }}
              name="useremail"
              value={user.email}
            />
            <div className="mb-3">
              <select className="form-control" name="ordername">
                <option>Select Order</option>
                {orders
                  .slice()
                  .reverse()
                  .slice(0, 8)
                  .map((order, index) => (
                    <option key={index}>{order.name}</option>
                  ))}
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="recipient-name" className="col-form-label">
                Subject of Your Issue:
              </label>
              <input
                type="text"
                className="form-control"
                id="recipient-name"
                name="subject"
                placeholder="Subject"
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="recipient-name" className="col-form-label">
                Describe Your Issue:
              </label>
              <textarea
                type="text"
                className="form-control"
                id="recipient-name"
                name="description"
                placeholder="Description"
                style={{height: "100px"}}
                required
              ></textarea>
            </div>
            <button
              style={{ fontSize: "20px", width: "120px", marginLeft: "38%", borderRadius: "20px" }}
              type="submit"
              className="btn btn-sm btn-dark"
            >
              Submit
            </button>
          </form>
        </Modal.Body>
      </Modal>
    );
  };

  const closeCart = () => {
    setShowCart(false);
  };

  const preload = () => {
    orderDetails(user._id, token).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setOrders(data);
      }
    });
  };

  useEffect(() => {
    preload();
    setCartProducts(loadCart());
  }, []);

  const userLeftSide = () => {
    return (
      <div className="card">
        <div
          className="card-header"
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}
        >
          <h4 className="text-dark fw-bolder" style={{ width: "60%" }}>
            User Info:{" "}
          </h4>
          <button
            onClick={() => showingContactPage()}
            className="btn btn-warning btn-sm"
            style={{ width: "30%", fontSize: "17px", fontWeight: "bold" }}
          >
            Contact Us
          </button>
        </div>
        <ul className="list-group">
          <li className="list-group-item">
            <span
              className="badge badge-success mr-2"
              style={{ fontSize: "22px" }}
            >
              Name:
            </span>{" "}
            <h4 className="text-dark mt-2" style={{ display: "inline-block" }}>
              {name.toUpperCase()}
            </h4>
          </li>
          <li className="list-group-item">
            <span
              className="badge badge-success mr-2"
              style={{ fontSize: "22px" }}
            >
              Email:
            </span>{" "}
            <h4 className="text-dark" style={{ display: "inline-block" }}>
              {email}
            </h4>
          </li>
        </ul>
        {ContactUsPage()}
      </div>
    );
  };

  const userRightSide = () => {
    return (
      <Fragment>
        <h3
          style={{
            display: "inline-block",
            borderBottom: "4px solid green",
            marginBottom: "10px",
            borderRadius: "10px",
          }}
        >
          -------: Your Order History :-------
        </h3>
        <table className="table table-warning">
          <thead>
            <tr style={{ fontSize: "23px", color: "green" }}>
              <th scope="col">Order Name</th>
              <th scope="col">Order Description</th>
              <th scope="col">Order Category</th>
              <th scope="col">Order Amount ($)</th>
            </tr>
          </thead>
          <tbody>
            {orders
              .slice()
              .reverse()
              .map((order, index) => {
                return (
                  <tr
                    className="text-black"
                    style={{ fontWeight: "bolder" }}
                    key={index}
                  >
                    <td>{order.name}</td>
                    <td>{order.description}</td>
                    <td>{order.category.name}</td>
                    <td>{order.amount}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </Fragment>
    );
  };

  return (
    <Base title="UserDashBoard page" cartProdCount={cartProducts.length}>
      <div className="mt-5" id="userdashboard-container">
        <div id="userDetails" style={{ margin: "0 auto" }}>
          {userLeftSide()}
        </div>
        <div id="orderDetails">{userRightSide()}</div>
      </div>
    </Base>
  );
};

export default UserDashBoard;
