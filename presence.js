import { rtdb, auth } from "./firebase.js";
import { ref, set, onDisconnect, onValue } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { doc, getDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { db } from "./firebase.js";

// Mark user as online, auto-mark offline when they close the tab
export async function setOnline(uid) {
  const presenceRef = ref(rtdb, "presence/" + uid);
  await set(presenceRef, { online: true, lastSeen: Date.now() });
  onDisconnect(presenceRef).set({ online: false, lastSeen: Date.now() });
}

// Watch your friends list and their online status in real time
export function watchFriends(uid, callback) {
  const friendsRef = collection(db, "users", uid, "friends");
  getDocs(friendsRef).then(async (snap) => {
    const friends = [];
    for (const docSnap of snap.docs) {
      const friendUid = docSnap.id;
      const userDoc = await getDoc(doc(db, "users", friendUid));
      const userData = userDoc.data();
      const presenceRef = ref(rtdb, "presence/" + friendUid);
      onValue(presenceRef, (presSnap) => {
        const presence = presSnap.val();
        const existing = friends.find(f => f.uid === friendUid);
        const isOnline = presence?.online || false;
        if (existing) {
          existing.online = isOnline;
        } else {
          friends.push({ uid: friendUid, username: userData?.username || "Unknown", online: isOnline });
        }
        callback([...friends]);
      });
    }
    if (snap.empty) callback([]);
  });
}