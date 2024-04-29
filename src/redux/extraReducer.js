import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth, firestore, storage } from "../firebase/firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { Timestamp, addDoc, collection } from "firebase/firestore";

// create user
export const createUser = createAsyncThunk(
  "user/createUserAndProfile",
  async (data, thunkAPI) => {
    try {
      // Create user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      // Add user profile data to Firestore
      const usersData = {
        userPhoto: data.photo,
        userName: data.name,
        userEmail: data.email,
      };
      const usersRef = collection(firestore, "Users");
      await addDoc(usersRef, usersData);

      // Update user profile
      await updateProfile(userCredential.user, {
        displayName: data.name,
        photoURL: data.photo,
        phoneNumber: data.phone,
      });

      console.log("User registered successfully!");

      // Return the user credential
      return userCredential;
    } catch (error) {
      // If an error occurs, reject the action with the error message
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const UserLogin = createAsyncThunk("login", async (data, thunkAPI) => {
  try {
    const user = await signInWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );
    return user;
  } catch (error) {
    console.log(error);
  }
});

export const publishPosts = createAsyncThunk(
  "posts/publish",
  async (data, thunkAPI) => {
    const { title, imageUpload, user, description } = data;
    try {
      const storageRef = ref(
        storage,
        `/images/${Date.now()}${imageUpload?.name}`
      );

      const uploadImage = uploadBytesResumable(storageRef, imageUpload);
      await uploadImage;

      const url = await getDownloadURL(uploadImage.snapshot.ref);

      const articleData = {
        title: title,
        description: description,
        imageUrl: url,
        createdAt: Timestamp.now().toDate(),
        createdUserPhoto: user?.photoURL,
        createdBy: user?.displayName,
        userId: user?.uid,
        likes: [],
        comments: [],
      };

      const articleRef = collection(firestore, "Articles");
      await addDoc(articleRef, articleData);

      return {};
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const updateDisplayNameAsync = createAsyncThunk(
  "user/updateDisplayName",
  async (newDisplayName, { rejectWithValue }) => {
    try {
      await auth.currentUser.updateProfile({
        displayName: newDisplayName,
      });

      return newDisplayName;
    } catch (error) {
      return rejectWithValue("Failed displayName");
    }
  }
);
