import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createUser } from "../redux/extraReducer";
import { profile_logo, intagram_text } from "../constants";
import "./Register.scss";

const Register = () => {
  const { error } = useSelector((state) => state.login);
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    photo: { profile_logo },
  });
  const dispatch = useDispatch();
  const handleRegister = (e) => {
    e.preventDefault();
    dispatch(createUser(data));
  };

  return (
    <>
      <div className="register-container">
        <div className="register-content">
          <img src={intagram_text} alt="Instagram" className="logo" />
          <div className="card register-card">
            <div className="card-body">
              <h2 className="text-center mb-4">Sign up to Instagram</h2>
              {error && <div className="alert alert-danger">{error}</div>}
              <form onSubmit={handleRegister}>
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control input-weight"
                    id="name"
                    placeholder="Enter your full name"
                    autoFocus
                    value={data.name}
                    onChange={(e) =>
                      setData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    style={{ height: "40px" }}
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="email"
                    className="form-control input-weight"
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
                  <input
                    type="password"
                    className="form-control input-weight"
                    id="password"
                    placeholder="Enter your password"
                    value={data.password}
                    onChange={(e) =>
                      setData((prev) => ({ ...prev, password: e.target.value }))
                    }
                    style={{ height: "40px" }}
                  />
                </div>
                <div className="text-center">
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg btn-block"
                  >
                    Sign up
                  </button>
                </div>
              </form>
            </div>
          </div>
          <div className="text-center mt-3">
            <p className="mb-0">Already have an account?</p>
            <a href="/" className="link-primary">
              Log in Here
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
