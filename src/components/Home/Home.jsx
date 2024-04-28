import React, { useEffect, useState } from "react";
import "./Home.scss"; // css design
import { Link, useNavigate } from "react-router-dom";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { firestore, auth } from "../../firebase/firebase";
import CreatePost from "../Post/CreatePost/CreatePost";
import Likes from "../Likes/Likes";
import Comment from "../Likes/Comments/Comment";
import SearchedUser from "./SearchedUser";
// import { useSelector } from "react-redux";
import { intagram_text } from "../../constants";

const Home = ({ user }) => {
  // const { postLoading } = useSelector((state) => state.posts);
  const [modalState, setModalState] = useState(false);
  const [commentModal, setCommentModal] = useState(true);
  const [article, setArticles] = useState([]);
  const [searchTerm, setSearchTerm] = useState(null);
  const [users, setUsers] = useState([]);
  const [filteredData, setFilteredData] = useState(users);

  useEffect(() => {
    const fetchArticles = async () => {
      const articleRef = collection(firestore, "Articles");
      const q = query(articleRef, orderBy("createdAt", "desc"));
      onSnapshot(q, (snapshot) => {
        const articlesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setArticles(articlesData);
      });
    };

    const fetchUsers = async () => {
      const userRef = collection(firestore, "Users");
      const q = query(userRef, orderBy("userPhoto", "asc"));
      onSnapshot(q, (snapshot) => {
        const usersData = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((userData) => userData.id !== user.uid);
        setUsers(usersData);
      });
    };

    fetchArticles();
    fetchUsers();
  }, [user]);

  const handleLogOut = () => {
    auth
      .signOut()
      .then(() => {
        console.log("sign out successfully");
        navigate("/"); // page
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  };

  const navigate = useNavigate();

  const handleDeletePost = async (postId) => {
    const postRef = doc(firestore, "Articles", postId);

    try {
      await deleteDoc(postRef);
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handleInputChange = (event) => {
    const newSearchTerm = event.target.value.toLowerCase();
    setSearchTerm(newSearchTerm);

    // Filter the data based on the search term, excluding the current user
    const filteredResults = users.filter(
      (item) =>
        item.userName.toLowerCase().includes(newSearchTerm) &&
        item.userName !== user.displayName
    );

    setFilteredData(filteredResults);
  };

  return (
    <>
      {/* TODO: */}
      <div className="home">
        {/* ----INSTAGRAM NAVBAR---- */}
        <header className="grid main-header">
          <div className="flex-container header-container">
            <span className="logo logo-nav header-item">
              <a href="/">
                <img src={intagram_text} alt="logo" width={200} />
              </a>
            </span>
            <div className="header-item searchbar">
              <div className="flex-container position-relative">
                <div className="search-icon-container">
                  <i className="fas fa-search search-nav-icon" />
                </div>
                <input
                  id="searchbar"
                  type="text"
                  className="form-control searchbar-input"
                  placeholder="Serach by name..."
                  onChange={handleInputChange}
                />
                {searchTerm ? <SearchedUser data={filteredData} /> : null}
              </div>
            </div>
            <nav className="header-item main-nav mt-3">
              <ul className="navbar flex-container">
                <li className="navbar-item">
                  <Link
                    to="/home"
                    className="d-flex align-items-center justify-content-center gap-2"
                  >
                    <p>Home</p>
                  </Link>
                </li>
                <li
                  className="navbar-item"
                  onClick={() => setModalState(!modalState)}
                >
                  <div className="d-flex align-items-center justify-content-center gap-2">
                    <p>Add</p>
                  </div>
                </li>
                <li className="navbar-item">
                  <Link to="/profile">
                    <div className="d-flex align-items-center rjustify-content-center gap-2">
                      <p>Profile</p>
                      <img src={user?.photoURL} alt="profilephoto" />
                    </div>
                  </Link>
                </li>
                <li className="navbar-item no-hover">
                  <button
                    onClick={handleLogOut}
                    className="px-5 py-3 btn btn-danger d-flex align-items-center justify-content-center gap-2"
                  >
                    <p className="h4 m-0 p-0">Log Out</p>
                    <i className="fas fa-sign-out-alt h3" />
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </header>
        {/* ----INSTAGRAM MAIN FEED CONTENT---- */}
        <section className="main-content grid">
          <div className="main-gallery-wrapper flex-container">
            {article?.map((item) => (
              <div key={item.id} className="card card-wrapper">
                <div className="card-header d-flex align-items-center">
                  <div className="m-2">
                    <img
                      className="rounded-circle"
                      src={item.createdUserPhoto}
                      alt=""
                      width={40}
                    />
                  </div>
                  <div className="div">
                    <span className="card-title">{item.createdBy}</span> <br />
                    <span className="card-subtitle">Title: {item.title}</span>
                  </div>
                  <div
                    style={{
                      margin: "5px 5px 0 auto",
                    }}
                  >
                    {item.createdBy === user.displayName && (
                      <span
                        className="text-danger d-flex align-items-center gap-1 h3"
                        onClick={() => handleDeletePost(item.id)}
                      >
                        <p>Delete</p>
                      </span>
                    )}
                  </div>
                </div>

                <div className="card-img-container">
                  <img src={item.imageUrl} className="card-img" alt={item.id} />
                </div>
                {/* Created Data */}
                <span
                  className="px-2"
                  style={{
                    opacity: "65%",
                    marginLeft: "auto",
                  }}
                >
                  <i className="fa-regular fa-calendar-days mx-2"></i>
                  {item.createdAt.toDate().toLocaleString()}
                </span>

                {/* Post Comments Section */}
                <div className="card-data">
                  {/* icons & buttons */}
                  <div className="d-flex card-icons gap-2">
                    <div
                      style={{
                        marginRight: "auto",
                      }}
                    >
                      {/* FIXME: LIKE BUTTON */}
                      <span className="card-icon d-flex">
                        <Likes id={item.id} likes={item.likes} />
                      </span>
                    </div>
                    <span
                      className="card-icon"
                      onClick={() => setCommentModal(item.id)}
                    >
                      <i className="fa-regular fa-comment" />
                    </span>
                    <span className="card-icon">
                      <i className="fa-regular fa-paper-plane" />
                    </span>
                    <span className="card-icon ml-auto">
                      <i className="fa-regular fa-bookmark" />
                    </span>
                  </div>
                  {/* Comment */}
                  <span className="d-flex gap-1">
                    <span className="font-weight-bold">{item.createdBy}:</span>
                    {item.description}
                  </span>
                  <span
                    style={{
                      fontWeight: "bolder",
                      cursor: "pointer",
                    }}
                    className="link-success link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover"
                    onClick={() => setCommentModal(item.id)}
                  >
                    Open All Comments
                  </span>

                  {commentModal === item.id && (
                    <Comment
                      id={item.id}
                      postImg={item.imageUrl}
                      setCommentModal={setCommentModal}
                      createdUserPhoto={item.createdUserPhoto}
                    />
                  )}

                  <div className="add-comment-container ml-3">
                    <span className="card-icon">
                      <i className="bi bi-emoji-smile"></i>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="sidebar">
            <div className="sidebar-menu-container">
              <div className="sidebar-card sidebar-header grid">
                <img
                  src={user?.photoURL}
                  alt=""
                  className="sidebar-img sidebar-hd-img"
                />
                <span className="sidebar-title card-title">
                  {user ? user?.displayName : null}
                </span>
                <span className="card-subtitle sidebar-subtitle">
                  {user ? user?.email : null}
                </span>
                <span className="sidebar-btn">
                  <Link to="/profile">Change</Link>
                </span>
              </div>
              <div className="suggestions-header grid">
                <span className="suggestions-text">Suggestions for you</span>
                <span className="sidebar-btn-alt">See all</span>
              </div>
              {users
                .filter((item) => item.userName !== user.displayName)
                .map((item) => (
                  <div
                    className="sidebar-card sidebar-card-alt grid"
                    key={item.id}
                  >
                    <img
                      src={item.userPhoto}
                      alt=""
                      className="sidebar-img side-bar-img-alt"
                    />
                    <span className="sidebar-title card-title">
                      {item.userName}
                    </span>
                    <Link to={`/${item.userName}`} className="sidebar-btn">
                      Follow
                    </Link>
                  </div>
                ))}
            </div>
          </div>
        </section>
      </div>
      {modalState ? (
        <CreatePost user={user} setModalState={setModalState} />
      ) : null}
    </>
    // TODO:
  );
};

export default Home;
