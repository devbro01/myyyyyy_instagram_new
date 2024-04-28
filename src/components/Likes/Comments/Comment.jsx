import {
  arrayRemove,
  arrayUnion,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { firestore } from "../../../firebase/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { v4 as uuidv4 } from "uuid";
import { auth } from "../../../firebase/firebase";
import "./Comment.scss";

export default function Comment({
  id,
  postImg,
  createdUserPhoto,
  setCommentModal,
}) {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [currentlyLoggedinUser] = useAuthState(auth);
  const [showEmojis, setShowEmojis] = useState(false);
  const commentRef = doc(firestore, "Articles", id);
  const [selectedEmoji, setSelectedEmoji] = useState(null);

  useEffect(() => {
    const docRef = doc(firestore, "Articles", id);
    onSnapshot(docRef, (snapshot) => {
      setComments(snapshot.data().comments || []);
    });
  }, [id]);

  const closeModal = () => {
    setCommentModal(null);
  };

  const handleInputChange = (e) => {
    setComment(e.target.value);
  };

  const handleEmojiClick = (emoji) => {
    setSelectedEmoji(emoji);
  };

  const handleChangeComment = (e) => {
    if (e.key === "Enter") {
      const finalComment = `${comment}${selectedEmoji || ""}`;
      updateDoc(commentRef, {
        comments: arrayUnion({
          user: currentlyLoggedinUser.uid,
          userName: currentlyLoggedinUser.displayName,
          comment: finalComment,
          createdAt: new Date(),
          commentId: uuidv4(),
        }),
      }).then(() => {
        setComment("");
        setSelectedEmoji(null);
      });
    }
  };

  const handleDeleteComment = (comment) => {
    updateDoc(commentRef, {
      comments: arrayRemove(comment),
    }).catch((error) => {
      console.error("Error deleting comment:", error);
    });
  };

  const emojis = [
    "😀",
    "😍",
    "😎",
    "🔥",
    "👍",
    "❤️",
    "👏",
    "🙌",
    "🎉",
    "🥳",
    "🤩",
    "🤗",
  ];

  return (
    <>
      <div className="comment_container">
        <div className="posts_con">
          <div className="post__image">
            <img src={postImg} alt="Post" />
          </div>
        </div>

        <div className="container d-flex flex-column">
          {/* close button */}
          <div
            style={{
              cursor: "pointer",
              marginLeft: "auto",
              fontSize: "25px",
              color: "red",
            }}
            className="d-flex align-items-center justify-content-center gap-2"
          >
            <p className="fw-light">cancel</p>
            <i
              style={{
                cursor: "pointer",
                marginLeft: "auto",
                fontSize: "25px",
                color: "tomato",
              }}
              class="fa-regular fa-circle-xmark"
              onClick={closeModal}
            ></i>
          </div>

          {currentlyLoggedinUser && (
            <div className="emoji-input-container">
              <input
                type="text"
                className="form-control mt-4 mb-5 w-100 inp-comment"
                value={comment}
                onChange={handleInputChange}
                placeholder="Add a comment"
                onKeyUp={handleChangeComment}
              />
              {selectedEmoji && (
                <span className="selected-emoji">{selectedEmoji}</span>
              )}
              <span
                className="emoji"
                style={{ fontSize: "22px", cursor: "pointer" }}
                onClick={() => setShowEmojis(!showEmojis)}
              >
                😀
              </span>
              {showEmojis && (
                <div className="emoji-list">
                  {emojis.map((emoji, index) => (
                    <span
                      key={index}
                      className="emoji p-1 m-1 pb-0 mb-0"
                      onClick={() => handleEmojiClick(emoji)}
                      style={{ cursor: "pointer" }}
                    >
                      {emoji}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
          {comments.map(({ commentId, user, comment, userName }) => (
            <div key={commentId} className="border p-2 mt-2 row">
              <div className="col-11">
                <span
                  className={`badge ${
                    user === currentlyLoggedinUser.uid
                      ? "bg-success"
                      : "bg-primary"
                  }`}
                >
                  <div className="header-img-container">
                    <img
                      className="card-header-img"
                      src={createdUserPhoto}
                      alt="User"
                    />
                    <h3 className="ml-2">{userName}</h3>
                  </div>
                </span>
                <div className="d-flex">
                  <p className="ml-2">{comment}</p>
                  {user === currentlyLoggedinUser.uid && (
                    <i
                      className="fa fa-times ml-auto mr-2"
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        handleDeleteComment({
                          commentId,
                          user,
                          comment,
                          userName,
                        })
                      }
                    ></i>
                  )}
                </div>
                <hr />
              </div>
              <div className="col-1"></div>
            </div>
          ))}
        </div>
      </div>
      <div className="w-screen"></div>
    </>
  );
}
