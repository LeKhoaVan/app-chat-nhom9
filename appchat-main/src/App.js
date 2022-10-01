import React from 'react';
import './App.css';
import DefaultLayout from './component/Chat'
import Login from './component/Login/Login';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
function App() {
  return (
    <BrowserRouter>
      <div>
        <Routes>
        <Route path='/login' element= {<Login />} />
        <Route path='/' element= {<DefaultLayout />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
