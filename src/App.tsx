import { BrowserRouter, Route, Routes } from 'react-router-dom'

import './App.css'

import NavBar from './components/NavBar/NavBar'
import Home from './components/Home/Home'
import Signin from './components/Signin/Signin'
import Inicio from './components/Inicio/Inicio'

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
