import { db } from "./firebase.js";
import {
  collection, addDoc, onSnapshot, doc,
  updateDoc, serverTimestamp, query, where
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Send a game invite to a friend
export async function sendInvite(fromUid, fromName, toUid, gameName) {
  await addDoc(collection(db, "users", toUid, "invites"), {
    fromUid, fromName, gameName,
    status: "pending",
    sentAt: serverTimestamp()
  });
}

// Watch for incoming invites in real time
export function watchInvites(uid, callback) {
  const q = query(
    collection(db, "users", uid, "invites"),
    where("status", "==", "pending")
  );
  onSnapshot(q, (snap) => {
    snap.docChanges().forEach(change => {
      if (change.type === "added") {
        callback({ id: change.doc.id, ...change.doc.data() });
      }
    });
  });
}

// Decline an invite (marks it so it doesn't show again)
export async function declineInviteById(uid, inviteId) {
  await updateDoc(doc(db, "users", uid, "invites", inviteId), { status: "declined" });
}