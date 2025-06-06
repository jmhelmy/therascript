import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

const firebaseCompatApp = firebase.initializeApp({
  // your config here (or however you're handling shared init)
});

export const CompatTimestamp = firebase.firestore.Timestamp;

export const compatServerTimestamp = (): firebase.firestore.FieldValue => {
  return firebase.firestore.FieldValue.serverTimestamp();
};
