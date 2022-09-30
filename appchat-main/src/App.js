import React from 'react';
import './App.css';
import SideNavbar from './component/SideNavbar';
import MyChat from './component/MyChat';
import ChattingPage from './component/ChattingPage';
function App() {
  return (
    <div>
      <SideNavbar/>
      <MyChat/>
      <ChattingPage/>
    </div>
  );
}

export default App;
