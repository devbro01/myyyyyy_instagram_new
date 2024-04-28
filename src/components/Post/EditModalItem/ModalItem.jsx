import React, { useState } from "react";
import "./ModalItem.scss";
import { useDispatch } from "react-redux";
import { updateDisplayNameAsync } from "../../../redux/extraReducer";

const ModalItem = ({ setUserSetting }) => {
  const [newDisplayName, setDisplayName] = useState("");
  const [isActive, setIsActive] = useState(false);
  const dispatch = useDispatch();

  const handleUpdate = (e) => {
    e.preventDefault();
    dispatch(updateDisplayNameAsync(newDisplayName));
  };

  const closeModal = () => {
    setIsActive(false);
    setUserSetting(false);
  };

  return (
    <>
      <div className={`user_setting ${isActive ? "active" : ""}`}>
        <span className="close-btn" onClick={closeModal}>
          <i className="fa-solid fa-xmark text-danger mx-2" />
        </span>
        <form className="update-user-container" onSubmit={handleUpdate}>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="UserName"
              id="usernameInput"
              value={newDisplayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <input
              type="email"
              className="form-control"
              placeholder="Email"
              id="emailInput"
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              id="passwordInput"
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>
      </div>
      <div
        className={`w-screen ${isActive ? "active" : ""}`}
        onClick={closeModal}
      />
    </>
  );
};

export default ModalItem;
