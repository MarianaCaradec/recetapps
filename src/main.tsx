import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
import { RecipesContextProvider } from './context/recipesContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
        <RecipesContextProvider>
        <App />
        </RecipesContextProvider>
  </StrictMode>,
)
