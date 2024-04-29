import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { UserLogin } from "../redux/extraReducer";
import { intagram_text } from "../constants";
import "./Login.scss";

const Login = () => {
  const { error } = useSelector((state) => state.login);
  const dispatch = useDispatch();
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(UserLogin(data));
  };

  return (
    <>
      <div className="login-container">
        <div className="login-content">
          <img src={intagram_text} alt="Instagram" className="logo" />
          <div className="card login-card">
            <div className="card-body">
              <h2 className="text-center mb-4">Log in to Instagram</h2>
              {error && <div className="alert alert-danger">{error}</div>}
              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    placeholder="Enter your email"
                    value={data.email}
                    onChange={(e) =>
                      setData((prev) => ({ ...prev, email: e.target.value }))
                    }
                    style={{ height: "40px" }}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    placeholder="Enter your password"
                    value={data.password}
                    onChange={(e) =>
                      setData((prev) => ({ ...prev, password: e.target.value }))
                    }
                    style={{ height: "40px" }}
                  />
                </div>
                <div className="mb-3 text-center">
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg btn-block"
                  >
                    Log in
                  </button>
                </div>
              </form>
            </div>
          </div>
          <div className="text-center mt-3">
            <p className="mb-0">Don't have an account yet?</p>
            <a href="/sign-up" className="link-primary">
              Sign up Here
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
