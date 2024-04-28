import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./CreatePost.scss";
import { publishPosts } from "../../../redux/extraReducer";

const CreatePost = ({ setModalState, user }) => {
  const { postLoading } = useSelector((state) => state.posts);
  const [selectedImg, setSelectedImg] = useState(null);
  const [data, setData] = useState({
    user: user,
    title: "",
    imageUpload: null,
    description: "",
  });
  const dispatch = useDispatch();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImg(e.target.result);
    };
    reader.readAsDataURL(file);
    setData((prev) => ({ ...prev, imageUpload: file }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const publishPost = () => {
    if (data.title.trim() !== "" && data.imageUpload !== null) {
      dispatch(publishPosts(data))
        .then(() => {
          setTimeout(() => setModalState(false), 0);
        })
        .catch((error) => {
          console.error("Error publishing post:", error);
        });
    }
  };

  return (
    <>
      {postLoading ? (
        <h2>Loading...</h2>
      ) : (
        <>
          <div className="modal-container">
            {selectedImg ? (
              <>
                <div className="selected__img__container">
                  <img src={selectedImg} alt="Selected" />
                </div>
                <form>
                  <div className="mb-3">
                    <label htmlFor="title" className="form-label">
                      Title
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="title"
                      name="title"
                      value={data.title}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="description" className="form-label">
                      Description
                    </label>
                    <textarea
                      className="form-control"
                      id="description"
                      name="description"
                      value={data.description}
                      onChange={handleInputChange}
                    />
                  </div>
                  <button
                    className="btn btn-danger"
                    onClick={() => setModalState(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-primary ms-2"
                    onClick={publishPost}
                  >
                    Publish
                  </button>
                </form>
              </>
            ) : (
              <>
                <label
                  htmlFor="fileInput"
                  className="form-label h1 text-secondary"
                >
                  Select Your File <i className="fa-regular fa-folder-closed" />
                </label>
                <input
                  type="file"
                  className="form-control"
                  id="fileInput"
                  onChange={handleFileChange}
                  accept="image/*"
                />
              </>
            )}
          </div>
          {/* for backdrop blur */}
          <div className="w-screen"></div>
        </>
      )}
    </>
  );
};

export default CreatePost;
