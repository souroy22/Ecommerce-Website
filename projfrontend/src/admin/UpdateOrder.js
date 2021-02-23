import React, { useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import { isAutheticated } from "../auth/helper";
import Base from "./../core/Base";
import { loadCart } from "../core/helper/cartHelper";

import {
  getAllStatusCode,
  getAOrder,
  updateOrderStatus,
} from "./helper/adminapicall";

const UpdateOrder = ({ match }) => {
  const { user, token } = isAutheticated();

  const [values, setValues] = useState({
    status: "",
    loading: false,
    error: "",
    getaRedirect: false,
    createdOrder: "",
  });
  const [cartProducts, setCartProducts] = useState([]);

  const [statusCode, setStatusCode] = useState([]);

  const { status, loading, error, getaRedirect, createdOrder } = values;

  const preload = (orderId) => {
    getAOrder(orderId, user._id, token).then((data) => {
      console.log("Success Message ", createdOrder);
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({
          ...values,
          status: data.status,
        });
      }
    });
  };

  useEffect(() => {
    setCartProducts(loadCart());
    preload(match.params.orderId);
  }, []);

  const performRedirect = () => {
    if (getaRedirect) {
      return <Redirect to="/admin/orders" />;
    }
  };

  const onSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, error: "", loading: true });
    updateOrderStatus(match.params.orderId, user._id, token, { status }).then(
      (data) => {
        console.log(data);
        if (data.error) {
          setValues({ ...values, error: data.error });
        } else {
          console.log("Success Message ", createdOrder);
          setValues({
            ...values,
            status: "",
            loading: false,
            createdOrder: data.status,
            getaRedirect: true,
          });
        }
      }
    );
  };

  const handleChange = (name) => (event) => {
    console.log(event.target.value);
    const value = event.target.value;
    setValues({ ...values, [name]: value });
  };

  const successMessage = () => (
    <div
      className="alert alert-success mt-3"
      style={{ display: createdOrder ? "" : "none" }}
    >
      <h4>{createdOrder} updated successfully</h4>
    </div>
  );

  const updateStatusForm = () => {
    return (
      <form>
        <div className="form-group">
          <select onChange={handleChange("status")} className="form-control">
            <option>Select</option>
            <option value="Recieved">Recieved</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <button
            type="submit"
            onClick={onSubmit}
            className="btn btn-outline-success mt-3"
          >
            Update Status
          </button>
        </div>
      </form>
    );
  };

  return (
    <Base
    cartProdCount={cartProducts.length}
      title="Add a product here!"
      description="Welcome to product creation section"
      className="container bg-info p-4 mt-5"
    >
      <Link to="/admin/dashboard" className="btn btn-md btn-dark mb-3">
        Admin Home
      </Link>
      <div className="row bg-dark text-white rounded">
        <div className="col-md-8 offset-md-2">
          {successMessage()}
          {updateStatusForm()}
          {performRedirect()}
        </div>
      </div>
    </Base>
  );
};

export default UpdateOrder;
