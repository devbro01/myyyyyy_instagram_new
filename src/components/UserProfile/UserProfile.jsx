import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  collection,
  getDocs,
  query,
  where,
  onSnapshot,
  orderBy,
  updateDoc,
  getDoc,
  doc,
} from "firebase/firestore";
import { auth, firestore } from "../../firebase/firebase";
import "./UserProfile.scss";
import SearchedUser from "../Home/SearchedUser";
import { intagram_text } from "../../constants";

const UserProfile = (user) => {
  const { username } = useParams();
  const [profileUser, setProfileUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  // const [IsFollowing, setIsFollowing] = useState(false);
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

    const fetchProfileUser = async () => {
      const userQuery = query(
        collection(firestore, "Users"),
        where("userName", "==", username)
      );
      const querySnapshot = await getDocs(userQuery);

      if (querySnapshot.empty) {
        console.error(`No user found with username: ${username}`);
        return;
      }

      const userData = querySnapshot.docs[0].data();
      setProfileUser(userData);

      const postsQuery = query(
        collection(firestore, "Articles"),
        where("createdBy", "==", userData.userName)
      );
      const postsSnapshot = await getDocs(postsQuery);
      const userPostsData = postsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUserPosts(userPostsData);
    };

    fetchUsers();
    fetchProfileUser();
  }, [user, username]);

  const handleLogOut = async () => {
    try {
      await auth.signOut();
      alert("Logout successful");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const handleInputChange = (event) => {
    const newSearchTerm = event.target.value.toLowerCase();
    setSearchTerm(newSearchTerm);

    const filteredResults = users.filter(
      (item) =>
        item.userName.toLowerCase().includes(newSearchTerm) &&
        item.userName !== user.displayName
    );

    setFilteredData(filteredResults);
  };

  const handleFollowToggle = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    try {
      const userRef = doc(firestore, "Users", currentUser.uid);
      const userDoc = await getDoc(userRef);
      if (!userDoc.exists()) {
        console.error("User document does not exist");
        return;
      }

      const userData = userDoc.data();
      const following = userData.following || [];

      if (following.includes(profileUser.id)) {
        const updatedFollowing = following.filter(
          (id) => id !== profileUser.id
        );
        await updateDoc(userRef, { following: updatedFollowing });
      } else {
        const updatedFollowing = [...following, profileUser.id];
        await updateDoc(userRef, { following: updatedFollowing });
      }
    } catch (error) {
      console.error("Error toggling follow:", error);
    }
  };

  if (!profileUser) {
    return <div>L-o-o-o-o-o-o-oading...</div>;
  }

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
      <div className="userprofile">
        <header>
          <div className="container">
            <div className="profile">
              <div className="profile-image">
                <img
                  src={profileUser.userPhoto}
                  alt={`${profileUser.userName}'s profile`}
                />
              </div>
              <div className="d-flex align-items-center justify-content-start gap-5 profile-user-settings">
                <h1 className="profile-user-name">{profileUser.userName}</h1>
                <p
                  style={{ cursor: "pointer" }}
                  className="text-white fw-light h3 border p-2 rounded-2 bg-primary"
                  onClick={handleFollowToggle}
                >
                  Follow
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
                    <span className="profile-stat-count">
                      {profileUser.likes}
                    </span>
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
                    <span className="profile-stat-count">
                      {userPosts.length}
                    </span>
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
          </div>
        </header>
        <main>
          <div className="container">
            <div className="gallery">
              {userPosts.map((post) => (
                <div key={post.id} className="gallery-item">
                  <img
                    className="gallery-image"
                    src={post.imageUrl}
                    alt={`Post by ${profileUser.userName}`}
                  />
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default UserProfile;
