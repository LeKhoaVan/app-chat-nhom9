import React from 'react';
import './App.css';
import DefaultLayout from './component/Chat'
import Auth from './component/Auth';
import Landing from './component/Landing';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {useState} from 'react'
import AuthContextProvider from './contexts/AuthContext'
import LoginForm from './component/Auth/Login'
import RegisterForm from './component/Auth/Register'
import ProtectedRoute from './routing/ProtectedRoute'
import Mes from './component/Chat/MyChatAo'

function App() {
  return (
    <AuthContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element= {<Landing />} />
          
          <Route
							path='/login'
							element={ <Auth/>}
						/> 
          <Route path='/chat' element= {
            <ProtectedRoute>
              <DefaultLayout />
            </ProtectedRoute>
          
          } />
          <Route path='/chat2' element= {
            <ProtectedRoute>
              <Mes />
            </ProtectedRoute>
          
          } />
        </Routes>
      </BrowserRouter>
    </AuthContextProvider>
  );
}

export default App;
