import { Recipe } from "../../types";

import { auth } from "../../services/firebaseConfig"

import { Link, useParams } from "react-router-dom"

import { useSavedRecipesContext } from "../../context/savedRecipesContext"

import EditRecipe from "../EditRecipeButton/EditRecipeButton"


const RecipeDetail = ({recipes}: {recipes: Recipe[]}) => {
    const { id } = useParams<{ id: string }>(); 
    const {handleSaveRecipe} = useSavedRecipesContext()


    const recipe = recipes && recipes.length > 0 ?
                    recipes.find(r => r.id === id)
                    : null;

    if(!recipe) {
        return (<h3>No se encontró la receta</h3>);
    }

    const currentUser = auth.currentUser; 
    const isOwner = currentUser?.uid === recipe.user?.userId;
    
    const handleShare = () => {

        const recipeUrl = `${window.location.origin}/receta/${recipe.id}`;
        navigator.clipboard.writeText(recipeUrl)
            .then(() => {
                alert('Enlace copiado al portapapeles');
            })
            .catch(err => console.error('Error al copiar el enlace: ', err));
    };

    const shareOnWhatsApp = () => {
        const recipeUrl = `${window.location.origin}/receta/${recipe.id}`;
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`Mira esta receta: ${recipeUrl}`)}`;
        window.open(whatsappUrl, '_blank');
    };

    return (
        <>
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
                    {Array.isArray(recipe.ingredients) 
                    ? ( recipe.ingredients.map((ingredient, id) => (
                    <li key={id}>{ingredient}</li> )))
                    : (<li>{String(recipe.ingredients)}</li>)}
                </ul>
                <h4>Tiempo de preparación: {recipe.timeOfPreparation}</h4>
                <h4>{`Rinde ${recipe.servings} porciones`}</h4>
                <h4>Categoria: {recipe.category}</h4>
                <div className="buttons">
                    <button onClick={() => handleSaveRecipe(recipe)}><h4>Guardar en favoritos</h4></button>
                    <button onClick={handleShare}>Compartir enlace</button>
                    <button onClick={shareOnWhatsApp}>Compartir en whatsapp</button>
                    <button className={isOwner ? 'editButton' : 'cannotEdit'}> {isOwner && <EditRecipe/>} </button>
                </div>
            </div>
        </>
    )
}

export default RecipeDetail