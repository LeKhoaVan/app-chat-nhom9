import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCXDIVFHFJo3azaU3TRBE92PJd_z00oScs",
  authDomain: "fir-dd703.firebaseapp.com",
  projectId: "fir-dd703",
  storageBucket: "fir-dd703.appspot.com",
  messagingSenderId: "67283041908",
  appId: "1:67283041908:web:b643cc4c4f825bade01b21",
  measurementId: "G-S7ZTDPXLY5"
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
