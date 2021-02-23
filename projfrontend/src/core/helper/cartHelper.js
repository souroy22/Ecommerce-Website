import ReactNotification from "react-notifications-component";
import { store } from "react-notifications-component";
import "react-notifications-component/dist/theme.css";

export const successNotification = () => {
  store.addNotification({
    title: "product added to cart",
    message: "Successfully added",
    type: "success",
    container: "top-right",
    insert: "top",
    animationIn: ["animate__animated", "animate__fadeIn"],
    animationOut: ["animate__animated", "animate__fadeOut"],
    dismiss: {
      duration: 5000,
      onScreen: true,
    },
  });
};

export const addItemToCart = (item) => {
  let cart = [];
  if (typeof window !== undefined) {
    if (localStorage.getItem("cart")) {
      cart = JSON.parse(localStorage.getItem("cart"));
    }
    const isExist = cart.find((x) => x._id === item._id);
    if (!isExist) {
      cart.push({
        ...item,
        count: 1,
      });
      localStorage.setItem("cart", JSON.stringify(cart));
      return true;
    } else {
      return false;
    }
  }
};

export const increaseCartProdCount = (item, count) => {
  let cart = [];
  if (typeof window !== undefined) {
    if (localStorage.getItem("cart")) {
      cart = JSON.parse(localStorage.getItem("cart"));
      const prodIndex = cart.findIndex((cartProd) => {
        return cartProd._id === item._id;
      });
      cart[prodIndex].count = count + 1;
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }
};

export const decreaseCartProdCount = (item, count) => {
  let cart = [];
  if (typeof window !== undefined) {
    if (localStorage.getItem("cart")) {
      cart = JSON.parse(localStorage.getItem("cart"));
      const prodIndex = cart.findIndex((cartProd) => {
        return cartProd._id === item._id;
      });
      cart[prodIndex].count = count - 1;
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }
};

export const countcartprod = (item, condition) => {
  if (condition) {
    let cart = [];
    if (typeof window !== undefined) {
      if (localStorage.getItem("cart")) {
        cart = JSON.parse(localStorage.getItem("cart"));
      }
      if (cart.length === 0) {
        return;
      }
      const prodIndex = cart.findIndex((cartProd) => {
        return cartProd._id === item._id;
      });
      if(prodIndex === -1){
        return;
      } 
      if (cart[prodIndex].count) {
        console.log(cart[prodIndex].count);
        return cart[prodIndex].count;
      }
    }
  }
};

export const isExistInCart = (item) => {
  const cart = JSON.parse(localStorage.getItem("cart"));
  const isExist = cart.find((x) => x._id === item._id);
  if (isExist) {
    return true;
  } else {
    return false;
  }
};

export const loadCart = () => {
  if (typeof window !== undefined) {
    if (localStorage.getItem("cart")) {
      return JSON.parse(localStorage.getItem("cart"));
    }
  }
};

export const setCart = () => {
  if (!localStorage.getItem("cart")) {
    console.log("Called here");
    let cart = [];
    localStorage.setItem("cart", JSON.stringify(cart));
  }
};

export const removeItemFromCart = (productId) => {
  // console.log("Called");
  let cart = [];
  if (typeof window !== undefined) {
    if (localStorage.getItem("cart")) {
      cart = JSON.parse(localStorage.getItem("cart"));
    }
    cart.map((product, i) => {
      if (product._id === productId) {
        cart.splice(i, 1);
      }
    });
    localStorage.setItem("cart", JSON.stringify(cart));
  }
  return cart;
};

export const cartEmpty = (next) => {
  if (typeof window !== undefined) {
    localStorage.removeItem("cart");
    let cart = [];
    localStorage.setItem("cart", JSON.stringify(cart));
    next();
  }
};
