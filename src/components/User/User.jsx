import React, { useState, useEffect } from "react";
import { auth, firestore } from "../../firebase/firebase";
// import Likes from "../Likes/Likes";
// import Comment from "../Likes/Comment";
// import { useSelector } from "react-redux";
import ModalItem from "../Post/EditModalItem/ModalItem";
import SearchedUser from "../Home/SearchedUser";
import "./User.scss";
import {
  getDocs,
  collection,
  where,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { Link } from "react-router-dom";
import { intagram_text } from "../../constants";

const User = ({ user }) => {
  const [userSetting, setUserSetting] = useState(false);
  const [userPosts, setUserPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState(null);
  const [users, setUsers] = useState([]);
  const [filteredData, setFilteredData] = useState(users);

  useEffect(() => {
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

    const fetchUserPosts = async () => {
      try {
        const q = query(
          collection(firestore, "Articles"),
          where("createdBy", "==", user.displayName)
        );
        const snapshot = await getDocs(q);

        const userPostsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setUserPosts(userPostsData);
      } catch (error) {
        console.error("Error fetching user posts:", error);
      }
    };

    fetchUsers();
    fetchUserPosts();
  }, [user.displayName, user]);

  const handleLogOut = async () => {
    try {
      await auth.signOut();
      alert("Logout successful");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  // const handleDelete = async (postId) => {
  //   const postRef = firestore.collection("Articles").doc(postId);

  //   try {
  //     await postRef.delete();
  //   } catch (error) {
  //     console.error("Error deleting post:", error);
  //   }
  // };

  //   console.log(user)

  const handleInputChange = (itemm) => {
    const newSearchTerm = itemm.target.value.toLowerCase();
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
      <header className="grid main-header">
        <div className="flex-container header-container">
          <a href="/">
            <img src={intagram_text} alt="logo" width={200} />
          </a>
          <div className="header-item searchbar">
            <label htmlFor="searchbar">
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
            </label>
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
      {/* Content */}
      <div className="userprofile">
        <header className="d-flex">
          <div className="profile mx-auto">
            <div className="profile-image">
              <img src={user?.photoURL} alt={user.id} />
            </div>

            <div
              style={{
                marginTop: "30px",
              }}
            >
              <h1>{user?.displayName}</h1>
              <p
                style={{
                  cursor: "pointer",
                  fontSize: "12px",
                }}
                className="text-primary"
                onClick={() => setUserSetting(!userSetting)}
              >
                Edit Profile <i className="fa-regular fa-pen-to-square" />
              </p>
            </div>
            <div>
              <li className="d-flex gap-4 h2 text-secondary">
                {/* Subscribers */}
                <div className="d-flex">
                  <span className="profile-stat-count">0</span>
                  <p className="mx-1">Subscribers</p>
                  <i
                    className="fa-solid fa-user"
                    style={{
                      color: "dodgerblue",
                      marginLeft: "2px",
                    }}
                  />
                </div>
                |{/* Likes */}
                <div className="d-flex">
                  <span className="profile-stat-count">1</span>
                  <p className="mx-2">Likes</p>
                  <i
                    className="fa-solid fa-heart"
                    style={{
                      color: "rgb(245, 66, 66)",
                    }}
                  />
                </div>
                |{/* Posts */}
                <div className="d-flex">
                  <span className="profile-stat-count">{userPosts.length}</span>
                  <p className="mx-2">Posts</p>
                  <i
                    className="fa-solid fa-camera"
                    style={{
                      color: "tomato",
                    }}
                  />
                </div>
              </li>
            </div>
          </div>
        </header>

        <main>
          <div className="container">
            <div className="gallery">
              {userPosts.map((coontent) => (
                <div key={coontent.id} className="gallery-item">
                  <img
                    src={coontent.imageUrl}
                    className="gallery-image"
                    alt={`content ${coontent.id}`}
                  />
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
      {userSetting ? <ModalItem setUserSetting={setUserSetting} /> : null}
    </>
  );
};

export default User;
