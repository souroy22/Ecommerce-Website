import React, { useState, useEffect } from "react";

import Base from "../core/Base";
import { Link } from "react-router-dom";
import { isAutheticated } from "../auth/helper";
import { getAllProducts, deleteProduct } from "./helper/adminapicall";
import { loadCart } from "../core/helper/cartHelper";


const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [cartProducts, setCartProducts] = useState([]);

  const { user, token } = isAutheticated();

  const preload = () => {
    getAllProducts().then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setProducts(data);
      }
    });
  };

  useEffect(() => {
    setCartProducts(loadCart());
    preload();
  }, []);

  const deleteThisProduct = (productId) => {
    deleteProduct(productId, user._id, token).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        preload();
      }
    });
  };

  return (
    <Base title="Welcome admin" description="Manage products here" className="mt-5"  cartProdCount={cartProducts.length}>
      <Link className="btn btn-info" to={`/admin/dashboard`}>
        <span className="">Admin Home</span>
      </Link>
      <h2
        className="mt-5"
        style={{
          borderBottom: "4px solid green",
          marginBottom: "40px",
          borderRadius: "10px",
          textAlign: "center"
        }}
      >
        All Products  &nbsp; 
        <h2 style={{display: "inline-block"}} className="text-center text-white my-3">
        ({" "}
        {products.length
          ? `Total ${products.length} product`
          : "Sorry! No Product found in your store"}{" "})
      </h2>
      </h2>
      <div className="row">
        <div className="col-12">
          

          {products.map((product, index) => {
            return (
              <div key={index} className="row text-center mb-2 ">
                <div className="col-4">
                  <h3 className="text-white text-left">{product.name}</h3>
                </div>
                <div className="col-4">
                  <Link
                    className="btn btn-success"
                    to={`/admin/product/update/${product._id}`}
                  >
                    <span className="">Update</span>
                  </Link>
                </div>
                <div className="col-4">
                  <button
                    onClick={() => {
                      deleteThisProduct(product._id);
                    }}
                    className="btn btn-danger"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Base>
  );
};

export default ManageProducts;
