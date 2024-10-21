import { createContext, Dispatch, SetStateAction, useContext, useState } from "react"

import { Recipe } from "../types"

import { addDoc, collection } from "firebase/firestore"
import { db, storage } from "../services/firebaseConfig"


import {getDownloadURL, ref, uploadBytesResumable} from 'firebase/storage'

import { useRecipesContext } from "./recipesContext"
import { useUserContext } from "./userContext"

interface NewRecipesContextType {
    newRecipe: Recipe
    setNewRecipe: Dispatch<SetStateAction<Recipe>>
    newRecipeIsVisible: boolean
    setNewRecipeIsVisible: Dispatch<SetStateAction<boolean>>
    image: File | null
    setImage: Dispatch<SetStateAction<File | null>>
    imageUrl: string
    setImageUrl: Dispatch<SetStateAction<string>>
    uploadingImage: boolean
    setUploadingImage: Dispatch<SetStateAction<boolean>>
    manageNewRecipeData: () => void
}

export const NewRecipesContext = createContext<NewRecipesContextType | null>(null)

export const NewRecipesContextProvider = ({children}: any) => {
    const [newRecipe, setNewRecipe] = useState<Recipe>({
        id: '',
        title: '',
        img: '',
        ingredients: '',
        description: '',
        timeOfPreparation: '',
        servings: 0,
        category: '',
        user: {
            userId: '',
            displayName: '',
            photoURL: ''
        }
    })
    const [newRecipeIsVisible, setNewRecipeIsVisible] = useState<boolean>(false)
    const [image, setImage] = useState<File | null>(null)
    const [imageUrl, setImageUrl] = useState<string>('')
    const [uploadingImage, setUploadingImage] = useState<boolean>(false)

    const {recipes, setRecipes} = useRecipesContext()
    const {user} = useUserContext()



    const manageNewRecipeData = () => {
        if(!user) {
            console.error('No existe ningún usuario creado');
            return ;
        }

        if(!image) {
            console.error('No existe ninguna imagen disponible');
            return ;
        }

        try {
            const storageRef = ref(storage, `userimages/${image.name}`);
            const uploadTask = uploadBytesResumable(storageRef, image);
            setUploadingImage(true);

            uploadTask.on(
                "state_changed",
                (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log(`Subida en progreso: ${progress}%`);
                },
                (error) => {
                console.error("Error al subir la imagen:", error);
                setUploadingImage(false);
                },
                async () => {
                    setUploadingImage(true)
                    try {
                        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                        
                        setImageUrl(downloadURL)

                        const formattedIngredients = typeof newRecipe.ingredients === 'string' ? 
                        newRecipe.ingredients.split(',').map(ingredient => ingredient.trim()) 
                        : newRecipe.ingredients
                        
                        const formattedRecipe = {
                            title: newRecipe.title,
                            img: downloadURL,
                            ingredients: formattedIngredients,
                            description: newRecipe.description,
                            timeOfPreparation: newRecipe.timeOfPreparation,
                            servings: newRecipe.servings,
                            category: newRecipe.category,
                            user: {
                                userId: user.uid,
                                displayName: user.displayName,
                                photoURL: user.photoURL
                            }
                        };

                        const newRecipeRef = await addDoc(collection(db, 'recipes'), formattedRecipe);
                        const newRecipeRefId = newRecipeRef.id;

                            setNewRecipe({
                                id: '',
                                title: '',
                                img: '',
                                ingredients: '',
                                description: '',
                                timeOfPreparation: '',
                                servings: 0,
                                category: '',
                                user: { 
                                    userId: user.uid,
                                    displayName: user.displayName,
                                    photoURL: user.photoURL}
                            })

                        setRecipes([...recipes, { id: newRecipeRefId, ...formattedRecipe }]);
                } catch (error) {
                    console.error('No se ha podido cargar la receta');
                }

                setUploadingImage(false);
                }
            );
            } catch (error) {
                console.error('Error al subir la imagen y guardar la receta');
                setUploadingImage(false);
            }
    }

    return (
        <NewRecipesContext.Provider 
        value={{newRecipe, 
        setNewRecipe, 
        newRecipeIsVisible, 
        setNewRecipeIsVisible, 
        image, 
        setImage, 
        imageUrl, 
        setImageUrl, 
        uploadingImage, 
        setUploadingImage,
        manageNewRecipeData}}>
            {children}
        </NewRecipesContext.Provider>
    )
}

export const useNewRecipesContext = () => {
    const context = useContext(NewRecipesContext)
    if(!context) {
        throw new Error('useNewRecipesContext debe ser usado dentro de un RecipeProvider');
    }
    return context
}
