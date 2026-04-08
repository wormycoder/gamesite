import { auth, db } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  doc,
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Sign up a new user
export async function signup(username, email, password) {
  try {
    // Create the account
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Set their display name to the username they chose
    await updateProfile(user, { displayName: username });

    // Save their profile to Firestore so other users can see it
    await setDoc(doc(db, "users", user.uid), {
      username: username,
      email: email,
      createdAt: new Date(),
      bio: "",
      gamesPlayed: 0
    });

    return { success: true };
  } catch (error) {
    return { success: false, message: friendlyError(error.code) };
  }
}

// Log in an existing user
export async function login(email, password) {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    return { success: true };
  } catch (error) {
    return { success: false, message: friendlyError(error.code) };
  }
}

// Log out
export async function logout() {
  await signOut(auth);
  window.location.href = "login.html";
}

// Watch if user is logged in or not
// Calls onLoggedIn(user) or onLoggedOut() depending on state
export function watchAuth(onLoggedIn, onLoggedOut) {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      onLoggedIn(user);
    } else {
      onLoggedOut();
    }
  });
}

// Turn Firebase error codes into friendly messages
function friendlyError(code) {
  switch (code) {
    case "auth/email-already-in-use":
      return "That email is already registered. Try logging in instead.";
    case "auth/invalid-email":
      return "That doesn't look like a valid email address.";
    case "auth/weak-password":
      return "Password should be at least 6 characters.";
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Incorrect email or password.";
    default:
      return "Something went wrong. Please try again.";
  }
}