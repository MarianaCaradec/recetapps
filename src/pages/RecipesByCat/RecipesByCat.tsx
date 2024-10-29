import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSearchContext } from '../../context/searchContext'

const RecipesByCat = () => {
    const {fetchRecipesByCat, loading, recipesByCat} = useSearchContext()
    const {cat} = useParams()

    useEffect(() => {
        if(cat) {
            fetchRecipesByCat(cat)
        }
    }, [cat])

    
    if(loading){
        return (
            <h2>Cargando...</h2>
        )
    }

    return (
        <>
            {recipesByCat && recipesByCat.map(byCat => {
                return (
                    <div className="recipeCard" key={byCat.id}>
                    {byCat.user && (
                        <div className="userInfo">
                            <img src={byCat.user.photoURL || '/assets/defaultProfilePic.jpg'} className="userPhoto" alt="foto de perfil" />
                            <Link to={'/profile'}> <p>{byCat.user.displayName || 'Usuario Anónimo'}</p> </Link>
                        </div>
                    )}
                    <h3>{byCat.title}</h3>
                    <img src={byCat.img} alt="imagen ilustrativa" />
                    <Link to={`/receta/${byCat.id}`}> <button>Ver en detalle</button> </Link>
                    </div>
                )  
            })}
        </>
    )
}

export default RecipesByCat