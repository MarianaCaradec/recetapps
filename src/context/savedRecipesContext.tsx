import { addDoc, collection, doc, setDoc } from "firebase/firestore"
import { db } from "../services/firebaseConfig"

import { createContext, Dispatch, SetStateAction, useContext, useState } from "react"

import { Recipe } from "../types"

import { useUserContext } from "./userContext"

interface SavedRecipesContextType {
    savedRecipes: Recipe[] | null
    setSavedRecipes: Dispatch<SetStateAction<Recipe[] | null>>
    saveRecipe: (formattedRecipe: Recipe) => Promise<void>
    handleSaveRecipe: (formattedRecipe: Recipe) => Promise<void>
}

export const SavedRecipesContext = createContext<SavedRecipesContextType | null>(null)

export const SavedRecipesContextProdivder = ({children}: { children: React.ReactNode }) => {
    const [savedRecipes, setSavedRecipes] = useState<Recipe[] | null>(null)
    const {updateUser, user} = useUserContext()

    const saveRecipe = async (formattedRecipe: Recipe): Promise<void> => {
        const savedRef = collection(db, 'savedRecipes')
        await addDoc(savedRef, formattedRecipe)
    }

    const handleSaveRecipe = async (recipe: Recipe): Promise<void> => {
        updateUser()

        if(!user) {
            console.error('Usuario no autenticado');
            return;
        }

        const formattedRecipe: Recipe = {
            id: recipe.id, 
            user: {
                userId: user.uid,
                displayName: user.displayName || '', 
                photoURL: user.photoURL || '', 
            },
            title: recipe.title,
            img: recipe.img,
            ingredients: recipe.ingredients, 
            description: recipe.description,
            timeOfPreparation: recipe.timeOfPreparation,
            servings: recipe.servings,
            category: recipe.category,
            };

        await saveRecipe(formattedRecipe)
        const userSavedRecipesRef = doc(db, `profile/${user.uid}/savedRecipes`, formattedRecipe.id);
        await setDoc(userSavedRecipesRef, formattedRecipe); // Guardar receta en el perfil del usuario
        setSavedRecipes((prev) => (prev ? [...prev, formattedRecipe] : [formattedRecipe]))
    }
    return (
        <SavedRecipesContext.Provider value={{savedRecipes, setSavedRecipes, saveRecipe, handleSaveRecipe}}>
            {children}
        </SavedRecipesContext.Provider>
    )
}

export const useSavedRecipesContext = () => {
    const context = useContext(SavedRecipesContext)
    if(!context) {
        throw new Error('useRecipeContext debe ser usado dentro de un RecipeProvider');
    }
    return context
}
