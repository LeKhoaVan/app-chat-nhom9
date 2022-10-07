import React from 'react';
import './App.css';
import Message  from './component/MyChat';
import Message2 from './component/MyChatAo';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
function App() {
  return (
    <BrowserRouter>
      <div>
        <Routes>
        <Route path='/message' element= {<Message/>} />
        <Route path='/message2' element= {<Message2/>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
