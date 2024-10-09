import { BrowserRouter, Route, Routes } from 'react-router-dom'

import './App.css'

import NavBar from './pages/NavBar/NavBar'
import Home from './pages/Home/Home'
import Signin from './pages/Signin/Signin'
import Inicio from './pages/Inicio/Inicio'

function App() {

  return (
    <>
    <BrowserRouter>
    <NavBar/>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/signin' element={<Signin/>}/>
      <Route path='/inicio' element={<Inicio/>}/>
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
