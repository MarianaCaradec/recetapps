import { useEffect } from "react"

import './Main.css'

import {useRecipesContext } from "../../context/recipesContext"
import { useUserContext } from "../../context/userContext"



import AddNewRecipe from "../../components/AddNewRecipe/AddNewRecipe"

import { Link } from "react-router-dom"

const Inicio = () => {
    const {fetchRecipes, recipes, setLoading} = useRecipesContext()
    const {updateUser } = useUserContext()

    useEffect(() => {
        fetchRecipes()
        updateUser()
        setLoading(false)
    }, [])

    return (
        <>
        <div className="recipesContainer">
        {recipes.length > 0 ?
            recipes.map(recipe => {
                return (
                    <div className="recipeCard" key={recipe.id}>
                    {recipe.user && (
                        <div className="userInfo">
                            <img src={recipe.user.photoURL || '../../assets/defaultProfilePic.jpg'} className="userPhoto" alt="foto de perfil" />
                            <Link to={'/profile'}> <p>{recipe.user.displayName || 'Usuario Anónimo'}</p> </Link>
                        </div>
                    )}
                    <h3>{recipe.title}</h3>
                    <img src={recipe.img} alt="imagen ilustrativa" />
                    <Link to={`/receta/${recipe.id}`}> <button>Ver en detalle</button> </Link>
                </div>
                )  
            })
                : <h3>No es posible recuperar los datos</h3>}
        </div>
        <AddNewRecipe />
        </>
    )
}

export default Inicio