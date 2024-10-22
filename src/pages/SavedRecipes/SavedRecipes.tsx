
import { Link } from "react-router-dom"

import { useSavedRecipesContext } from "../../context/savedRecipesContext"

const SavedRecipes = () => {
    const {savedRecipes} = useSavedRecipesContext()

    return (
        <div>
            {savedRecipes && savedRecipes.map(recipe => {
                return (
                    <div key={recipe.id} className="recipeCard">
                        <div className="userInfo">
                            <img src={recipe.user.photoURL || '../../assets/defaultProfilePic.jpg'} className="userPhoto" alt="foto de perfil" />
                            <Link to={'/profile'}> <p>{recipe.user.displayName || 'Usuario Anónimo'}</p> </Link>
                        </div>
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
                        </div>
                )
            })}
        </div>
    )
}

export default SavedRecipes