import React, { useEffect, useState } from "react";
import { auth, firestore } from "../../firebase/firebase";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
const Likes = ({ likes, id }) => {
  const [user, setUser] = useState();
  const likesRef = doc(firestore, "Articles", id);
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setUser(user);
    });
  }, []);
  const handleLike = () => {
    if (likes?.includes(user.uid)) {
      updateDoc(likesRef, {
        likes: arrayRemove(user.uid),
      });
    } else {
      updateDoc(likesRef, {
        likes: arrayUnion(user.uid),
      });
    }
  };
  return (
    <div>
      <i
        className={`fa fa-heart ${
          !likes?.includes(user?.uid) ? "-o" : ""
        } fa-lg`}
        style={{
          cursor: "pointer",
          color: likes?.includes(user?.uid) ? "red" : null,
          transition: "all 0.5 ease-in-out",
        }}
        onClick={handleLike}
      />

      <span className="h3 mx-2">{likes?.length}</span>
    </div>
  );
};

export default Likes;
