import React from 'react';
import './App.css';
import SideNavbar from './component/SideNavbar';
import MyChat from './component/MyChat';
import ChattingPage from './component/ChattingPage';
import Login from './component/Login/Login';
function App() {
  return (
    <div>
      <Login/>
      {/* <SideNavbar/>
      <MyChat/>
      <ChattingPage/> */}
    </div>
  );
}

export default App;
