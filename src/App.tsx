import { BrowserRouter, Route, Routes } from 'react-router-dom'

import './App.css'

import { RecipesContextProvider } from './context/recipesContext'
import { UserContextProvider } from './context/userContext'
import { NewRecipesContextProvider } from './context/newRecipesContext'

import NavBar from './components/NavBar/NavBar'

import Home from './pages/Home/Home'
import Signin from './pages/Signin/Signin'
import Inicio from './pages/Inicio/Inicio'


function App() {

  return (
    <>

    <RecipesContextProvider>
    <UserContextProvider>
    <NewRecipesContextProvider>

    <BrowserRouter>

      <NavBar/>

      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/signin' element={<Signin/>}/>
        <Route path='/inicio' element={<Inicio/>}/>
      </Routes>

    </BrowserRouter>

    </NewRecipesContextProvider>
    </UserContextProvider>
    </RecipesContextProvider>

    </>
  )
}

export default App
