import { db, auth } from "./firebase.js";
import {
  collection, query, where, getDocs,
  doc, setDoc, deleteDoc, getDoc, addDoc, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Search for a user by username
export async function searchUser(username) {
  const q = query(collection(db, "users"), where("username", "==", username));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const userData = snap.docs[0].data();
  return { uid: snap.docs[0].id, ...userData };
}

// Send a friend request
export async function sendFriendRequest(fromUid, fromName, toUid) {
  if (fromUid === toUid) return { success: false, message: "You can't add yourself!" };
  const existing = await getDoc(doc(db, "users", toUid, "friendRequests", fromUid));
  if (existing.exists()) return { success: false, message: "Request already sent." };
  const alreadyFriends = await getDoc(doc(db, "users", fromUid, "friends", toUid));
  if (alreadyFriends.exists()) return { success: false, message: "Already friends!" };
  await setDoc(doc(db, "users", toUid, "friendRequests", fromUid), {
    fromUid, fromName, sentAt: serverTimestamp(), status: "pending"
  });
  return { success: true };
}

// Accept a friend request
export async function acceptFriendRequest(myUid, myName, theirUid, theirName) {
  await setDoc(doc(db, "users", myUid, "friends", theirUid), { username: theirName, addedAt: serverTimestamp() });
  await setDoc(doc(db, "users", theirUid, "friends", myUid), { username: myName, addedAt: serverTimestamp() });
  await deleteDoc(doc(db, "users", myUid, "friendRequests", theirUid));
}

// Decline a friend request
export async function declineFriendRequest(myUid, theirUid) {
  await deleteDoc(doc(db, "users", myUid, "friendRequests", theirUid));
}

// Remove a friend
export async function removeFriend(myUid, theirUid) {
  await deleteDoc(doc(db, "users", myUid, "friends", theirUid));
  await deleteDoc(doc(db, "users", theirUid, "friends", myUid));
}

// Get all pending friend requests for a user
export async function getFriendRequests(uid) {
  const snap = await getDocs(collection(db, "users", uid, "friendRequests"));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}