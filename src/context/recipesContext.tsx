import { createContext, Dispatch, SetStateAction, useContext, useState } from "react"

import { collection, getDocs } from "firebase/firestore"
import { db} from "../services/firebaseConfig"

import { Recipe } from "../types"

interface RecipeContextType {
    recipes: Recipe[]
    setRecipes: Dispatch<SetStateAction<Recipe[]>>
    loading: boolean
    setLoading: Dispatch<SetStateAction<boolean>>
    fetchRecipes: () => void
}

export const RecipesContext = createContext<RecipeContextType | null>(null)

export const RecipesContextProvider = ({children}: any) => {
    const [recipes, setRecipes] = useState<Array<Recipe>>([])
    const [loading, setLoading] = useState(false)

    const fetchRecipes = () => {
        setLoading(true)
        const recipesRef = collection(db, 'recipes')
        getDocs(recipesRef)
        .then(snapshot => {
            const dataRecipes = snapshot.docs.map(doc => {
                const dataDoc = doc.data()
                return {id: doc.id, ...dataDoc}
            })
            setRecipes(dataRecipes as Recipe[])
        }).finally(() => setLoading(false))
    }

    if(loading) {
        return (<h3>Cargando...</h3>)
    }

    return (
        <RecipesContext.Provider value={{recipes, setRecipes, loading, setLoading, fetchRecipes}}>
            {children}
        </RecipesContext.Provider>
    )
    
}

export const useRecipesContext = () => {
    const context = useContext(RecipesContext);
    if (!context) {
    throw new Error('useRecipeContext debe ser usado dentro de un RecipeProvider');
    }
    return context;
};
