import React, { useState, useEffect } from "react";
import Base from "../core/Base";
import { Link } from "react-router-dom";
import { getACategory, updateCategory } from "./helper/adminapicall";
import { isAutheticated } from "../auth/helper/index";
import { loadCart } from "../core/helper/cartHelper";


const UpdateCategory = ({ match }) => {
  const { user, token } = isAutheticated();

  const [values, setValues] = useState({
    name: "",
    loading: false,
    error: "",
    getaRedirect: false,
    createdCategory: "",
  });
  const [cartProducts, setCartProducts] = useState([]);

  const { name, loading, error, getaRedirect, createdCategory } = values;

  const preload = (categoryId) => {
    getACategory(categoryId, user._id, token).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({
          ...values,
          name: data.name,
        });
      }
    });
  };

  useEffect(() => {
    setCartProducts(loadCart());
    preload(match.params.categoryId);
  }, []);

  const onSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, error: "", loading: true });
    updateCategory(match.params.categoryId, user._id, token, { name }).then(
      (data) => {
        if (data.error) {
          setValues({ ...values, error: data.error });
        } else {
          setValues({
            ...values,
            name: "",
            loading: false,
            createdCategory: data.name,
          });
        }
      }
    );
  };

  const handleChange = (event) => {
    const name = event.target.value;
    setValues({ ...values, name });
  };

  const successMessage = () => (
    <div
      className="alert alert-success mt-3"
      style={{ display: createdCategory ? "" : "none" }}
    >
      <h4>{createdCategory} updated successfully</h4>
    </div>
  );

  const createCategoryForm = () => (
    <form>
      <div className="form-group">
        <input
          name="name"
          className="form-control"
          placeholder="Name"
          value={name}
          onChange={handleChange}
        />
      </div>
      <button
        type="submit"
        onClick={onSubmit}
        className="btn btn-outline-success mb-3"
      >
        Update Category
      </button>
    </form>
  );

  return (
    <Base
    cartProdCount={cartProducts.length}
      title="Add a product here!"
      description="Welcome to product creation section"
      className="container bg-info p-4"
    >
      <Link to="/admin/dashboard" className="btn btn-md btn-dark mb-3">
        Admin Home
      </Link>
      <Link to="/admin/categories" className="btn btn-md btn-dark ml-4 mb-3">
        Manage Category
      </Link>
      <div className="row bg-dark text-white rounded">
        <div className="col-md-8 offset-md-2">
          {successMessage()}
          {createCategoryForm()}
        </div>
      </div>
    </Base>
  );
};

export default UpdateCategory;
