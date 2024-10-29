import { BrowserRouter, Route, Routes } from 'react-router-dom'

import './App.css'

import { RecipesContextProvider, useRecipesContext } from './context/recipesContext'
import { UserContextProvider } from './context/userContext'
import { NewRecipesContextProvider } from './context/newRecipesContext'
import { SavedRecipesContextProdivder } from './context/savedRecipesContext'

import NavBar from './components/NavBar/NavBar'
import RecipeDetail from './components/RecipeDetail/RecipeDetail'

import Home from './pages/Home/Home'
import Signin from './pages/Signin/Signin'
import Inicio from './pages/Main/Main'
import UserProfile from './pages/UserProfile/UserProfile'
import SavedRecipes from './pages/SavedRecipes/SavedRecipes'
import RecipesByCat from './pages/RecipesByCat/RecipesByCat'

import { useEffect } from 'react'
import { SearchContextProvider } from './context/searchContext'

function App() {
  const {recipes, fetchRecipes, setLoading, loading} = useRecipesContext()

  useEffect(() => {
    fetchRecipes();
    setLoading(false)
}, [fetchRecipes]);

if(loading) {
  return (<h3>Cargando...</h3>)
}

  return (
    <>

    <RecipesContextProvider>
    <UserContextProvider>
    <NewRecipesContextProvider>
    <SearchContextProvider>
    <SavedRecipesContextProdivder>

      <BrowserRouter>

        <NavBar/>

        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/signin' element={<Signin/>}/>
          <Route path='/inicio' element={<Inicio/>}/>
          <Route path='/receta/:id' element={<RecipeDetail recipes={recipes}/>}/>
          <Route path='/recetas/categoria/:cat' element={<RecipesByCat/>}/>
          <Route path='/profile' element={<UserProfile/>}/>
          <Route path='/profile/savedrecipes' element={<SavedRecipes/>}/>
        </Routes>

      </BrowserRouter>

    </SavedRecipesContextProdivder>
    </SearchContextProvider>
    </NewRecipesContextProvider>
    </UserContextProvider>
    </RecipesContextProvider>

    </>
  )
}

export default App
