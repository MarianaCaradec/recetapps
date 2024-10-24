
import { useSavedRecipesContext } from "../../context/savedRecipesContext"
import { useEffect } from "react"
import { useUserContext } from "../../context/userContext"
import { auth } from "../../services/firebaseConfig"
import ShareRecipe from "../../components/Buttons/ShareRecipeButton/ShareRecipeButton"
import EditRecipe from "../../components/EditRecipeButton/EditRecipeButton"

const SavedRecipes = () => {
    const {savedRecipes, fetchUserSavedRecipes, deleteRecipe} = useSavedRecipesContext()
    const {user} = useUserContext()

    useEffect(() => {
        if(user) {
            fetchUserSavedRecipes()
        }
    }, [user, fetchUserSavedRecipes])

    const handleDeleteRecipe = async (recipeId: string) => {
        await deleteRecipe(recipeId)
    }

    return (
        <div>
            {savedRecipes && savedRecipes.length >= 0 ?  
            savedRecipes.map(recipe => {
                const currentUser = auth.currentUser; 
                const isOwner = currentUser?.uid === recipe.user?.userId;
                    return (
                        <div key={recipe.id} className="recipeCard">
                            <h3>{recipe.title}</h3>
                            <img src={recipe.img} alt="imagen ilustrativa" />
                            <p>{recipe.description}</p>
                            <ul className="ingredients">
                                <h4>Ingredientes: </h4>
                                {Array.isArray(recipe.ingredients) ? ( recipe.ingredients.map((ingredient, id) => (
                                        <li key={id}>{ingredient}</li> )
                                    )) : (<li>{String(recipe.ingredients)}</li>
                                )}
                            </ul>
                            <h4>Tiempo de preparación: {recipe.timeOfPreparation}</h4>
                            <h4>{`Rinde ${recipe.servings} porciones`}</h4>
                            <h4>Categoria: {recipe.category}</h4>
    
                            <div className="buttons">
                                <button onClick={() => handleDeleteRecipe(recipe.id)}><h4>Eliminar de favoritos</h4></button>
                                <button> <ShareRecipe/> </button>
                                <button className={isOwner ? 'editButton' : 'cannotEdit'}> {isOwner && <EditRecipe/>} </button>
                            </div>
                        </div>
                    )
                }) : <h3>No has guardado ninguna receta aún</h3> }
        </div>
    )
}

export default SavedRecipes