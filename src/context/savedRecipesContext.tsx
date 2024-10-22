import { collection, deleteDoc, doc, getDocs, setDoc } from "firebase/firestore"
import { db } from "../services/firebaseConfig"

import { createContext, Dispatch, SetStateAction, useContext, useState } from "react"

import { Recipe } from "../types"

import { useUserContext } from "./userContext"

interface SavedRecipesContextType {
    savedRecipes: Recipe[] | null
    setSavedRecipes: Dispatch<SetStateAction<Recipe[] | null>>
    handleSaveRecipe: (formattedRecipe: Recipe) => Promise<void>
    fetchUserSavedRecipes: () => Promise<void>
    deleteRecipe: (recipeId: string) => Promise<void>
}

export const SavedRecipesContext = createContext<SavedRecipesContextType | null>(null)

export const SavedRecipesContextProdivder = ({children}: { children: React.ReactNode }) => {
    const [savedRecipes, setSavedRecipes] = useState<Recipe[] | null>(null)
    const {updateUser, user} = useUserContext()

    const handleSaveRecipe = async (recipe: Recipe): Promise<void> => {
        updateUser()

        if(!user) {
            console.error('Usuario no autenticado');
            return;
        }

        const formattedRecipe = {
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

        const userSavedRecipesRef = doc(db, `profile/${user.uid}/savedRecipes`, formattedRecipe.id);
        await setDoc(userSavedRecipesRef, formattedRecipe); // Guardar receta en el perfil del usuario
        setSavedRecipes((prev) => (prev ? [...prev, formattedRecipe] : [formattedRecipe]))
    }

    const fetchUserSavedRecipes = async () => {
        if(user) {
            const userSavedRecipesRef = collection(db, `profile/${user.uid}/savedRecipes`)
            const querySnapshot = await getDocs(userSavedRecipesRef)
            const recipes: Recipe[] = querySnapshot.docs.map(doc => doc.data() as Recipe)
            setSavedRecipes(recipes)
        }
    }

    const deleteRecipe = async (recipeId: string) => {
        if(!user) {
            return ;
        }

        const userSavedRecipesRef = doc(db, `profile/${user.uid}/savedRecipes`, recipeId);
        await deleteDoc(userSavedRecipesRef)
        setSavedRecipes(prev => (prev ? prev.filter(recipe => recipe.id !== recipeId) : null))
    }

    return (
        <SavedRecipesContext.Provider value={{savedRecipes, setSavedRecipes, handleSaveRecipe, fetchUserSavedRecipes, deleteRecipe}}>
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
