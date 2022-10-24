import React from 'react';
import './App.css';
import DefaultLayout from './component/Chat'
import FriendLayout from './component/Friends';
import Auth from './component/Auth';
import Landing from './component/Landing';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {useState} from 'react'
import AuthContextProvider from './contexts/AuthContext'
import LoginForm from './component/Auth/Login'
import ProtectedRoute from './routing/ProtectedRoute'

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
          <Route path='/friend' element= {
            <ProtectedRoute>
              <FriendLayout />
            </ProtectedRoute>
          
          } />
        
        </Routes>
      </BrowserRouter>
    </AuthContextProvider>
  );
}

export default App;
