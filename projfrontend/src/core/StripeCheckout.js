import React, { useState, useEffect } from "react";
import { isAutheticated } from "../auth/helper";
import { cartEmpty, loadCart, countcartprod } from "./helper/cartHelper";
import { Link } from "react-router-dom";
import StripeCheckoutButton from "react-stripe-checkout";
import { API } from "../backend";
import { createOrder } from "./helper/orderHelper";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDollarSign, faUserShield } from "@fortawesome/free-solid-svg-icons";
import "./stripeCheckout.css";
import swal from "sweetalert";

const StripeCheckout = ({
  products,
  setReload = (f) => f,
  reload = undefined,
}) => {
  const [data, setData] = useState({
    loading: false,
    success: false,
    error: "",
    address: "",
  });

  const token = isAutheticated() && isAutheticated().token;
  const userId = isAutheticated() && isAutheticated().user._id;

  const getFinalAmount = () => {
    let amount = 0;
    if (products.length > 0) {
      products.map((p) => {
        amount = amount + p.price;
        amount = amount * countcartprod(p, true);
      });
      if (amount < 7) {
        amount += 1;
      }
      return amount;
    }
  };

  const makePayment = (token) => {
    products.map((product) => {
      product.count = countcartprod(product, true);
    })
    const body = {
      token,
      products,
    };
    const headers = {
      "Content-Type": "application/json",
    };
    return fetch(`${API}/payment/stripe`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    })
      .then((response) => {
        var todayDate = new Date();

        const orderData = {
          products: products,
          amount: getFinalAmount(),
          updated: todayDate.toDateString(),
        };
        createOrder(
          isAutheticated().user._id,
          isAutheticated().token,
          orderData
        );
        //call further methods
        swal({
          title: "Order Successfully Recieved",
          text: "Thanks for Ordering",
          icon: "success",
          button: "Thank You",
        });

        cartEmpty(() => {
          console.log("");
        });
        setReload(!reload);
      })
      .catch((error) => console.log(error));
  };

  const showStripeButton = () => {
    return isAutheticated() ? (
      <StripeCheckoutButton
        stripeKey={process.env.REACT_APP_PUBLISHABLEKEY}
        token={makePayment}
        amount={getFinalAmount() * 100}
        name="Buy Products"
        shippingAddress
        billingAddress
      >
        <button className="btn btn-success" style={{ width: "130px" }}>
          Buy Now
        </button>
      </StripeCheckoutButton>
    ) : (
      <Link to="/signin">
        <button className="btn btn-warning">Signin</button>
      </Link>
    );
  };

  return (
    <div style={{ alignItems: "center", marginLeft: "20%", marginTop: "20px" }}>
      <div id="payment-details-container">
        <h2
          style={{
            color: "#6b6b6b",
            width: "70%",
            textAlign: "initial",
            margin: "0",
          }}
        >
          Price Details
        </h2>
        <div className="dotted-line" style={{ marginBottom: "20px" }}></div>
        <div className="eachDetails">
          <h4>
            {`Price(${products.length}`}
            {products.length < 2 ? " item)" : " items)"}
          </h4>
          <h4>
            <FontAwesomeIcon
              style={{ fontSize: "22px", color: "black", marginRight: "3px" }}
              icon={faDollarSign}
            />
            {getFinalAmount() <= 7 ? getFinalAmount() - 1 : getFinalAmount()}
          </h4>
        </div>

        <div className="eachDetails">
          <h4>Delivery Charges</h4>
          <h4 c>
            {getFinalAmount() < 7 ? (
              <FontAwesomeIcon
                style={{ fontSize: "22px", color: "black", marginRight: "3px" }}
                icon={faDollarSign}
              />
            ) : (
              ""
            )}
            {getFinalAmount() <= 7 ? "1" : "Free"}
          </h4>
        </div>

        <div className="dotted-line"></div>

        <div className="eachDetails text-success">
          <h3>Total Billing Amount</h3>
          <h3>
            <FontAwesomeIcon
              style={{ fontSize: "25px", color: "gold", marginRight: "3px" }}
              icon={faDollarSign}
            />
            {getFinalAmount()}
          </h3>
        </div>
      </div>
      <div className="total-amount-container">
        <h5 className="text-white">
          <FontAwesomeIcon
            style={{ fontSize: "25px", color: "white", marginRight: "3px" }}
            icon={faUserShield}
          />
          Pay Securely
        </h5>
        {products.length >= 1 && showStripeButton()}
      </div>
    </div>
  );
};

export default StripeCheckout;
