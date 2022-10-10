import React from 'react';
import './App.css';
import DefaultLayout from './component/Chat'
import Login from './component/Login/Login';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import {useState} from 'react'

function App() {
  const [ checkLogin, setCheckLogin ] = useState(false)
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path='/login' element= {<Login />} />
          <Route element= {<PrivateRoute isLogged={checkLogin} />} >
            <Route path='/' element= {<DefaultLayout />} />
            <Route path='*' />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
