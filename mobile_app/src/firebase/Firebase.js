import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

export const firebaseConfig = {
  apiKey: "AIzaSyC-SvFb4gP8TJDjn-tht_85KXKJIf8hnPw",
  authDomain: "appchatmobile-group9.firebaseapp.com",
  projectId: "appchatmobile-group9",
  storageBucket: "appchatmobile-group9.appspot.com",
  messagingSenderId: "1068794345387",
  appId: "1:1068794345387:web:a379bfcfb3a740730d84ee"
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
