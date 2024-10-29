import './UserProfile.css'

import { useEffect } from "react"

import { Link } from 'react-router-dom'

import { useUserContext } from "../../context/userContext"


const UserProfile = () => {
    const {user, updateUser, userRecipes, fetchUserRecipes} = useUserContext()

    useEffect(() => {
        updateUser()
    }, [])

    useEffect(() => {
        if(user) {
            fetchUserRecipes()
        }
    }, [user])

    return (
        <>
        {user && (
            <>
                <div className='profileDescription'>
                    <div>
                        <Link to={'/profile'}> <h2>{user.displayName}</h2> </Link>
                        <img className='profileImg' src={user.photoURL || '../../assets/defaultProfilePic.jpg'} alt="foto de perfil" />
                    </div>
                    <div>
                        <button>Configuración</button>
                        <Link to={'/profile/savedrecipes'}> <button>Guardados</button> </Link>
                        <p>Mi hobby es cocinar porque es catártico para mí, ponele que lo que mejor hago son los postres</p>
                    </div>
                </div>
                <div>
                    {userRecipes.length > 0 ? userRecipes.map(recipe => {
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
                    }) : <h3>No has guardado niguna receta aún</h3>
                    }
                </div>
            </>
        )}
        </>
    )
}

export default UserProfile