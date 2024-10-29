import { createContext, useState, Dispatch, SetStateAction, useContext } from "react"

import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../services/firebaseConfig';

import { useParams } from "react-router-dom";

import { Recipe } from '../types';

interface SearchContextType {
    recipesByCat: Recipe[] | null
    setRecipesByCat: Dispatch<SetStateAction<Recipe[] | null>>
    loading: boolean
    setLoading: Dispatch<SetStateAction<boolean>>
    fetchRecipesByCat: (cat: string) => void
}

export const SearchContext = createContext<SearchContextType | null>(null)

export const SearchContextProvider = ({children}: { children: React.ReactNode }) => {
    const [recipesByCat, setRecipesByCat] = useState<Recipe[] | null>(null)
    const [loading, setLoading] = useState<boolean>(false)

    const {cat} = useParams()

    const fetchRecipesByCat = async () => {
        if(typeof cat != 'undefined') {
            setLoading(true)
            try {
                const byCatQuery = query(collection(db, 'recipes'), where('category', '==', cat))
                const snapshot = await getDocs(byCatQuery)
                const categoryRecipes = snapshot.docs.map(doc => {
                        const withId = doc.data() as Omit<Recipe, 'id'>
                        return {id: doc.id, ...withId}
                    })
                    setRecipesByCat(categoryRecipes)
            } catch (error) {
                console.error("Error al obtener las recetas por categoría:", error)
            } finally{
                () => setLoading(false)
            }
        }
    }

    return (
        <SearchContext.Provider value={{recipesByCat, setRecipesByCat, loading, setLoading, fetchRecipesByCat}}>
            {children}
        </SearchContext.Provider>
    )
}

export const useSearchContext = () => {
    const context = useContext(SearchContext)
    if(!context) {
        throw new Error('useRecipeContext debe ser usado dentro de un RecipeProvider');
    }
    return context
}

