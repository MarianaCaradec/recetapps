import { BrowserRouter, Route, Routes } from 'react-router-dom'

import './App.css'

import { RecipesContextProvider } from './context/recipesContext'
import { UserContextProvider } from './context/userContext'
import { NewRecipesContextProvider } from './context/newRecipesContext'
import { SavedRecipesContextProdivder } from './context/savedRecipesContext'

import NavBar from './components/NavBar/NavBar'

import Home from './pages/Home/Home'
import Signin from './pages/Signin/Signin'
import Inicio from './pages/Inicio/Inicio'
import UserProfile from './pages/UserProfile/UserProfile'
import SavedRecipes from './pages/SavedRecipes/SavedRecipes'

function App() {

  return (
    <>

    <RecipesContextProvider>
    <UserContextProvider>
    <NewRecipesContextProvider>
    <SavedRecipesContextProdivder>

      <BrowserRouter>

        <NavBar/>

        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/signin' element={<Signin/>}/>
          <Route path='/inicio' element={<Inicio/>}/>
          <Route path='/profile' element={<UserProfile/>}/>
          <Route path='/profile/savedrecipes' element={<SavedRecipes/>}/>
        </Routes>

      </BrowserRouter>

    </SavedRecipesContextProdivder>
    </NewRecipesContextProvider>
    </UserContextProvider>
    </RecipesContextProvider>

    </>
  )
}

export default App
