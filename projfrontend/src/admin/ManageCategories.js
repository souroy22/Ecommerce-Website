import React, { useState, useEffect } from "react";
import { isAutheticated } from "../auth/helper";
import Base from "./../core/Base";
import { getAllCategories, deleteCategory } from "./helper/adminapicall";
import { Link } from "react-router-dom";
import { loadCart } from "../core/helper/cartHelper";

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [cartProducts, setCartProducts] = useState([]);

  const { user, token } = isAutheticated();

  const preload = () => {
    getAllCategories().then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setCategories(data);
      }
    });
  };

  useEffect(() => {
    setCartProducts(loadCart());
    preload();
  }, []);

  const deleteACategory = (productId) => {
    deleteCategory(productId, user._id, token).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        preload();
      }
    });
  };

  return (
    <Base
      title="Manage Categories"
      description="Manage categories"
      cartProdCount={cartProducts.length}
    >
      <h2 className="mb-4">All products:</h2>
      <Link className="btn btn-info" to={`/admin/dashboard`}>
        <span className="">Admin Home</span>
      </Link>
      <div className="row">
        <div className="col-12">
          <h2 className="text-center text-white my-3">
            {" "}
            {categories.length
              ? `Total ${categories.length} product`
              : "Sorry! No Product found in your store"}{" "}
          </h2>

          {categories
            .slice()
            .reverse()
            .map((category, index) => {
              return (
                <div key={index} className="row text-center mb-2 ">
                  <div className="col-4">
                    <h3 className="text-white text-left">{category.name}</h3>
                  </div>
                  <div className="col-4">
                    <Link
                      className="btn btn-success"
                      to={`/admin/category/update/${category._id}`}
                    >
                      <span className="">Update</span>
                    </Link>
                  </div>
                  <div className="col-4">
                    <button
                      onClick={() => {
                        deleteACategory(category._id);
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

export default ManageCategories;
