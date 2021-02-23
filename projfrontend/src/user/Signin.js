import React, { useState, useEffect } from "react";
import Base from "../core/Base";
import { Redirect } from "react-router-dom";
import { GoogleLogin } from "react-google-login";
import "./style.css";
import { loadCart } from "../core/helper/cartHelper";
import {
  signin,
  authenticate,
  isAutheticated,
  signinWithGoogle,
} from "../auth/helper";

const Signin = () => {
  const [values, setValues] = useState({
    email: "",
    password: "",
    error: "",
    loading: false,
    didRedirect: false,
  });

  const [cartProducts, setCartProducts] = useState([]);

  const { email, password, error, loading, didRedirect } = values;
  const { user } = isAutheticated();

  const handleChange = (name) => (event) => {
    setValues({ ...values, error: false, [name]: event.target.value });
  };

  useEffect(() => {
    setCartProducts(loadCart());
  }, []);

  const onSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, error: false, loading: true });
    signin({ email, password })
      .then((data) => {
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
      })
      .catch(console.log("signin request failed"));
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

  const loadingMessage = () => {
    return (
      loading && (
        <div className="alert alert-info">
          <h2>Loading...</h2>
        </div>
      )
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

  const signInForm = () => {
    return (
      <div className="box">
        <form>
          <div className="input-container">
            <input
              type="email"
              required
              onChange={handleChange("email")}
              value={email}
            />
            <div className="underline"></div>
            <label>Enter Email</label>
          </div>
          <div className="input-container">
            <input
              type="password"
              required
              onChange={handleChange("password")}
              value={password}
            />
            <div className="underline"></div>
            <label>Enter Password</label>
          </div>
          <button className="submitbutton" onClick={onSubmit}>
            Login
          </button>
        </form>
        <div>
          <GoogleLogin
            id="google-signin-btn"
            theme="dark"
            clientId={process.env.REACT_APP_GOOGLE_CLIENTID}
            buttonText="Login with Google"
            onSuccess={googleOnSubmit}
            onFailure={googleOnSubmit}
            cookiePolicy={"single_host_origin"}
          />
        </div>
      </div>
    );
  };

  return (
    <Base className="none" cartProdCount={cartProducts.length}>
      {loadingMessage()}
      {errorMessage()}
      {signInForm()}
      {performRedirect()}
    </Base>
  );
};

export default Signin;
