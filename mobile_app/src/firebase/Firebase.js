import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

export const firebaseConfig = {
  apiKey: "AIzaSyAE-xmv27uijn5QRlhbJ-1--JbJhEYRNz4",
  authDomain: "cynoapp-f6914.firebaseapp.com",
  projectId: "cynoapp-f6914",
  storageBucket: "cynoapp-f6914.appspot.com",
  messagingSenderId: "760485233692",
  appId: "1:760485233692:web:cd73f950a0a131f9d74bd9"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
export default storage ;


// import { initializeApp } from "firebase/app";
// import { getStorage } from "firebase/storage";

// const firebaseConfig = {
//   apiKey: "AIzaSyD0ZnhEV03F-NRSjw_n1stfggEkgVdkx7Y",
//   authDomain: "profile-592e6.firebaseapp.com",
//   projectId: "profile-592e6",
//   storageBucket: "profile-592e6.appspot.com",
//   messagingSenderId: "916381926604",
//   appId: "1:916381926604:web:8143b85b704d27cecc6e69",
//   measurementId: "G-4EHCR6E2JG"
// };

// const app = initializeApp(firebaseConfig);
// const storage = getStorage(app);
// export default storage ;
