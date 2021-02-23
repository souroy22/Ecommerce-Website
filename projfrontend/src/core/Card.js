import React, { useState, useEffect } from "react";
import ImageHelper from "./helper/ImageHelper";
import { Link, Redirect } from "react-router-dom";
import {
  addItemToCart,
  removeItemFromCart,
  successNotification,
  loadCart,
  isExistInCart,
  increaseCartProdCount,
  decreaseCartProdCount,
  countcartprod,
} from "./helper/cartHelper";
import "./card.css";

const Card = ({
  product,
  addtoCart = true,
  removeFromCart = false,
  setReload = (f) => f,
  //   function(f){return f}
  reload = undefined,
  setReloadCartItems = (f) => f,
  //   function(f){return f}
  reloadCartItems = undefined,
}) => {
  const [redirect, setRedirect] = useState(false);
  const [prodCount, setProdCount] = useState(
    countcartprod(product, removeFromCart)
  );
  const [cartProducts, setCartProducts] = useState([]);
  const cartTitle = product ? product.name : "A photo from pexels";
  const cartDescrption = product ? product.description : "Default description";
  const cartPrice = product ? product.price : "DEFAULT";

  const errorNotification = () => {};

  const addToCart = () => {
    if (addItemToCart(product)) {
      addItemToCart(product);
      // alert(`${product.name} successfully added to the cart`);
      setReloadCartItems(!reloadCartItems);
    }
  };

  useEffect(() => {
    setCartProducts(loadCart());
  }, [reloadCartItems]);

  const getARedirect = (redirect) => {
    if (redirect) {
      return <Redirect to="/cart" />;
    }
  };

  const showAddToCart = (addtoCart) => {
    if (addToCart && !removeFromCart) {
      if (isExistInCart(product)) {
        return (
          <Link to="/cart">
            <button className="btn btn-block btn-outline-warning mt-2 mb-2">
              Go to Cart
            </button>
          </Link>
        );
      } else {
        return (
          <button
            onClick={() => {
              addToCart();
              setReloadCartItems(!reloadCartItems);
            }}
            className="btn btn-block btn-outline-success mt-2 mb-2"
          >
            Add to Cart
          </button>
        );
      }
    }
  };

  const increaseProdCount = () => {
    increaseCartProdCount(product, countcartprod(product, removeFromCart));
    setProdCount(countcartprod(product, removeFromCart));
    setReload(!reload);
  };

  const increaseBtn = (removeFromCart) => {
    return (
      removeFromCart && (
        <button
          onClick={increaseProdCount}
          className="btn increase-decrease-btns bg-success"
        >
          +
        </button>
      )
    );
  };

  const decreaseProdCount = () => {
    if (prodCount > 1) {
      decreaseCartProdCount(product, countcartprod(product, removeFromCart));
      setProdCount(countcartprod(product, removeFromCart));
      setReload(!reload);
    }
  };

  const decreaseBtn = (removeFromCart) => {
    return (
      removeFromCart && (
        <button
          onClick={decreaseProdCount}
          className="btn increase-decrease-btns bg-danger"
        >
          -
        </button>
      )
    );
  };

  const countProd = (removeFromCart) => {
    if (removeFromCart) {
      return (
        <span id="count-container">
          {countcartprod(product, removeFromCart)}
        </span>
      );
    }
  };

  const showRemoveFromCart = (removeFromCart) => {
    if (removeFromCart) {
      return (
        <button
          onClick={() => {
            removeItemFromCart(product._id);
            setReload(!reload);
          }}
          className="btn btn-block btn-outline-danger mt-2 mb-2"
        >
          Remove from Cart
        </button>
      );
    }
  };
  return (
    <div
      className="card text-white bg-dark border border-info mb-2 "
      id="card-container"
    >
      <div className="card-header lead">{cartTitle}</div>
      <div className="card-body">
        {getARedirect(redirect)}
        <ImageHelper product={product} />
        <p className="lead bg-success font-weight-normal text-wrap">
          {cartDescrption}
        </p>
        <p className="btn btn-success rounded  btn-sm px-4">$ {cartPrice}</p>
        <div className="row">
          <div className="col-12">{showAddToCart(addtoCart)}</div>
          <div className="count-container">
            {decreaseBtn(removeFromCart)}
            {countProd(removeFromCart)}
            {increaseBtn(removeFromCart)}
          </div>
          <div className="col-12">{showRemoveFromCart(removeFromCart)}</div>
        </div>
      </div>
    </div>
  );
};

export default Card;
