import { useEffect } from "react"

import { Link } from "react-router-dom"

import './Inicio.css'

import { auth } from "../../services/firebaseConfig"

import {useRecipesContext } from "../../context/recipesContext"
import { useUserContext } from "../../context/userContext"

import AddNewRecipe from "../../components/AddNewRecipe/AddNewRecipe"

import SaveRecipe from "../../components/Buttons/SaveRecipeButton/SaveRecipeButton"
import ShareRecipe from "../../components/Buttons/ShareRecipeButton/ShareRecipeButton"
import EditRecipe from "../../components/Buttons/EditRecipeButton/EditRecipeButton"



const Inicio = () => {
    const {fetchRecipes, recipes, setLoading} = useRecipesContext()
    const {updateUser } = useUserContext()

    useEffect(() => {
        fetchRecipes()
        updateUser()
        setLoading(false)
    }, [])

    if(recipes.length <= 0) {
        return (<h3>No es posible recuperar los datos</h3>)
    }

    return (
        <div className="recipesContainer">
            {recipes && recipes.map(recipe => {
            const currentUser = auth.currentUser; 
            const isOwner = currentUser?.uid === recipe.user?.userId;
                return (
                    <div key={recipe.id} className="recipeCard">
                        {recipe.user && (
                            <div className="userInfo">
                                    <img src={recipe.user.photoURL || '../../assets/defaultProfilePic.jpg'} className="userPhoto" alt="foto de perfil" />
                                    <Link to={'/profile'}> <p>{recipe.user.displayName || 'Usuario Anónimo'}</p> </Link>
                            </div>
                        )}
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
                            <button> <SaveRecipe/> </button>
                            <button> <ShareRecipe/> </button>
                            <button className={isOwner ? 'editButton' : 'cannotEdit'}> {isOwner && <EditRecipe/>} </button>
                        </div>
                    </div>
                )
            })}
            <AddNewRecipe />
        </div>
    )
}

export default Inicio