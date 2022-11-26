import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

export const firebaseConfig = {
  apiKey: "AIzaSyDO81BQW_rEK4mbjqWD_uaVzW5psw_Mrno",
  authDomain: "cynochat-876b8.firebaseapp.com",
  projectId: "cynochat-876b8",
  storageBucket: "cynochat-876b8.appspot.com",
  messagingSenderId: "493963636588",
  appId: "1:493963636588:web:0fddb671c4e7e1ef5e0d49",
  measurementId: "G-V42D3TFXSJ"
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
