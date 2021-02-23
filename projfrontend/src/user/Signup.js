import React, { useState, useEffect } from "react";
import Base from "../core/Base";
import { loadCart } from "../core/helper/cartHelper";
import { Link, Redirect } from "react-router-dom";
import { GoogleLogin } from "react-google-login";
import { signup, signinWithGoogle, authenticate, isAutheticated } from "../auth/helper";
import "./style.css";


const Signup = () => {
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    error: "",
    success: false,
    didRedirect: false,
  });

  const { name, email, password, error, success,didRedirect } = values;
  const { user } = isAutheticated();
  const [cartProducts, setCartProducts] = useState([]);

  const handleChange = (name) => (event) => {
    setValues({ ...values, error: false, [name]: event.target.value });
  };

  const performRedirect = () => {
    if (didRedirect) {
      if (user && user.role === 1) {
        return <Redirect to="/admin/dashboard" />;
      } else {
        return <Redirect to="/" />;
      }
    }
    if (isAutheticated()) {
      return <Redirect to="/" />;
    }
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setValues({ ...values, error: false });
    const data = signup({ name, email, password })
      .then((data) => {
        console.log(data);
        if (data.error) {
          setValues({ ...values, error: data.error, success: false });
        } else {
          setValues({
            ...values,
            name: "",
            email: "",
            password: "",
            error: "",
            success: true,
          });
        }
      })
      .catch((err) => console.log("Error in signup", err));
  };

  const googleOnSubmit = (responce) => {
    signinWithGoogle(responce).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error, loading: false });
      } else {
        authenticate(data, () => {
          setValues({
            ...values,
            didRedirect: true,
          });
        });
      }
    });
  };

  useEffect(() => {
    setCartProducts(loadCart());
  }, []);

  const signUpForm = () => {
    return (
      <div className="box">
        <form>
          <div className="input-container">
            <input
              type="text"
              required
              onChange={handleChange("name")}
              value={name}
            />
            <div className="underline"></div>
            <label>Enter Your Name</label>
          </div>
          <div className="input-container">
            <input
              type="text"
              required
              onChange={handleChange("email")}
              value={email}
            />
            <div className="underline"></div>
            <label>Enter Your Email</label>
          </div>
          <div className="input-container">
            <input
              type="password"
              required
              onChange={handleChange("password")}
              value={password}
            />
            <div className="underline"></div>
            <label>Enter a strong Password</label>
          </div>
          <button className="submitbutton" onClick={onSubmit}>Signup</button>
        </form>
        <div>
          <GoogleLogin
            id="google-signin-btn"
            theme="dark"
            clientId={process.env.REACT_APP_GOOGLE_CLIENTID}
            buttonText="Signup ith Google"
            onSuccess={googleOnSubmit}
            onFailure={googleOnSubmit}
            cookiePolicy={"single_host_origin"}
          />
        </div>
      </div>
    );
  };

  const successMessage = () => {
    return (
      <div className="row">
        <div className="col-md-6 offset-sm-3 text-left">
          <div
            className="alert alert-success"
            style={{ display: success ? "" : "none" }}
          >
            New account was created successfully. Please{" "}
            <Link to="/signin">Login Here</Link>
          </div>
        </div>
      </div>
    );
  };

  const errorMessage = () => {
    return (
      <div className="row">
        <div className="col-md-6 offset-sm-3 text-left">
          <div
            className="alert alert-danger"
            style={{ display: error ? "" : "none" }}
          >
            {error}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Base title="Sign up page" description="A page for user to sign up!" cartProdCount={cartProducts.length}>
      {errorMessage()}
      {successMessage()}
      {signUpForm()}
      {performRedirect()}
    </Base>
  );
};

export default Signup;
