import React, { useState, useEffect } from "react";
import "../styles.css";
import Base from "./Base";
import Card from "./Card";
import { loadCart, cartEmpty, countcartprod } from "./helper/cartHelper";
import StripeCheckout from "./StripeCheckout";
import "./cart.css";
import { Link } from "react-router-dom";

const Cart = () => {
  const [products, setProducts] = useState([]);
  const [reload, setReload] = useState(false);
  const [cartProducts, setCartProducts] = useState([]);
  

  useEffect(() => {
    setProducts(loadCart());
    setCartProducts(loadCart());
  }, [reload]);

  const emptyCartMessage = () => {
    return (
      <div style={{ width: "100%" }}>
        <h1 style={{ color: "chartreuse", width: "100%" }}>
          Nothing in your Cart :({" "}
        </h1>
        <Link to="/">
          <button className="btn btn-info text-white">Shop Now</button>
        </Link>
      </div>
    );
  };

  const loadAllProducts = () => {
    return (
      <div>
        <h2 className="text-white">Your Cart Items</h2>

        {products.map((product, index) => (
          <Card
            key={index}
            product={product}
            removeFromCart={true}
            addtoCart={false}
            setReload={setReload}
            reload={reload}
          />
        ))}
      </div>
    );
  };
  const loadCheckout = () => {
    return (
      <div>
        <h2>Payment Option</h2>
      </div>
    );
  };

  return (
    <Base
      cartProdCount={products.length}
      className="mt-5"
      title="Cart Page"
      description="Ready to checkout"
      totalProdCount={products.length}
    >
      {products.length > 0 && (
        <button
          className="btn btn-outline-danger mt-2 mb-2"
          onClick={() => {
            cartEmpty(() => {
              console.log("");
            });
            setReload(!reload);
          }}
        >
          Remove All
        </button>
      )}
      <div id="cart-container">
        {products.length > 0 && (
          <div
            className=""
            id="stripecheckout"
            style={{ alignItems: "center" }}
          >
            <StripeCheckout
              products={products}
              setReload={setReload}
            />
          </div>
        )}
        <div className="" id="cartProd">
          {products.length > 0 ? loadAllProducts() : emptyCartMessage()}
        </div>
      </div>
    </Base>
  );
};

export default Cart;
