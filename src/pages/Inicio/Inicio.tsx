import { useEffect } from "react"

import './Inicio.css'

import {useRecipesContext } from "../../context/recipesContext"

import AddNewRecipe from "../../components/AddNewRecipe/AddNewRecipe"

const Inicio = () => {
    const {fetchRecipes, recipes, setLoading} = useRecipesContext()

    useEffect(() => {
        fetchRecipes()
        setLoading(false)
    }, [])

    if(recipes.length < 0) {
        return (<h3>No es posible recuperar los datos</h3>)
    }

    return (
        <div className="recipesContainer">
            {recipes && recipes.map(recipe => {
                return (
                    <div key={recipe.id} className="recipeCard">
                        {recipe.user && (
                            <div className="userInfo">
                                <img src={recipe.user.photoURL || 'defaultProfilePic.jpg'} className="userPhoto" alt="foto de perfil" />
                                <span>{recipe.user.displayName || 'Usuario Anónimo'}</span>
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
                    </div>
                )
            })}
            <AddNewRecipe />
        </div>
    )
}

export default Inicio