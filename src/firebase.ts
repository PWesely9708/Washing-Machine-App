import { initializeApp, getApps } from "firebase/app";
import { getAuth, initializeAuth, browserLocalPersistence } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAkBaaWDF01d6OelR7P_HzT8nu1i8whxDs",
  authDomain: "washing-machine-app-1e88c.firebaseapp.com",
  projectId: "washing-machine-app-1e88c",
  storageBucket: "washing-machine-app-1e88c.firebasestorage.app",
  messagingSenderId: "758204800707",
  appId: "1:758204800707:web:c6e0df439638004d88cc76"
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

let auth;
try { auth = initializeAuth(app, { persistence: browserLocalPersistence }); }
catch { auth = getAuth(app); }

export { app, auth };
