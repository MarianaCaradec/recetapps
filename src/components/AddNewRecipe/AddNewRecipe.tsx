import { useEffect} from "react"

import { useNewRecipesContext } from "../../context/newRecipesContext"

import './AddNewRecipe.css'

import { auth } from "../../services/firebaseConfig"

import { useUserContext } from "../../context/userContext"

import ShareRecipeButton from "../ShareRecipeButton/ShareRecipeButton"
import EditRecipe from "../EditRecipeButton/EditRecipeButton"
import { useSavedRecipesContext } from "../../context/savedRecipesContext"


const AddNewRecipe = () => {
    const {newRecipe, setNewRecipe, newRecipeIsVisible, setNewRecipeIsVisible, setImage, imageUrl,uploadingImage, manageNewRecipeData} = useNewRecipesContext()
    const {user, updateUser} = useUserContext()
    const {handleSaveRecipe} = useSavedRecipesContext()

    const currentUser = auth.currentUser; 
    const isOwner = currentUser?.uid === newRecipe.user?.userId;

    useEffect(() => {
        updateUser()
    }, [user])

    const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if(files && files.length > 0) {
            setImage(files[0])
        }
        
    }

    const addNewRecipe = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        manageNewRecipeData()
        };

    const showOrHide = () => {
        if(newRecipeIsVisible) {
            setNewRecipeIsVisible(true)
        } else {
            setNewRecipeIsVisible(false)
        }
    }

    return (
        <>
            <div className="formContainer">
                <h2>Agregar mi receta</h2>
                <form onSubmit={addNewRecipe}>
                    <label>Nombre de la receta</label>
                    <input type="text" value={newRecipe.title} onChange={(e) => setNewRecipe({...newRecipe, title: e.target.value})}/>
                    <div className="imgDiv">
                        <label>Imagen del plato</label>
                        <input type="file" accept="image/" onChange={(e) => handleImage(e)}/>
                    </div>
                    <label>Descripción</label>
                    <textarea value={newRecipe.description} onChange={(e) => setNewRecipe({...newRecipe, description: e.target.value})}/>
                    <label>Ingredientes</label>
                    <input type="text" value={newRecipe.ingredients} onChange={(e) => setNewRecipe({...newRecipe, ingredients: e.target.value})} placeholder="Escriba cada ingrediente separado por coma por favor"/>
                    <label>Tiempo de preparación</label>
                    <input type="text" value={newRecipe.timeOfPreparation} onChange={(e) => setNewRecipe({...newRecipe, timeOfPreparation: e.target.value})}/>
                    <label>Cantidad de porciones</label>
                    <input type="number" value={newRecipe.servings} onChange={(e) => setNewRecipe({...newRecipe, servings: e.target.value})}/>
                    <label>Categoria</label>
                    <input type="text" value={newRecipe.category} onChange={(e) => setNewRecipe({...newRecipe, category: e.target.value})}/>
                    
                    <button type="submit" onClick={showOrHide} disabled={uploadingImage}>{uploadingImage ? 'Subiendo' : 'Publicar receta'}</button>
                </form>
            </div>
            {newRecipe && (
                <div key={newRecipe.title} className={newRecipeIsVisible ? 'show' : 'hide'}>
                    <h3>{newRecipe.title}</h3>
                    {imageUrl ? (
                        <img src={imageUrl} alt="imagen ilustrativa" />
                    ) : (<h3>Esta receta no posee imagen</h3>)}
                    <p>{newRecipe.description}</p>
                    <ul className="ingredients">
                        <h4>Ingredientes: </h4>
                        {Array.isArray(newRecipe.ingredients) ? (newRecipe.ingredients.map((ingredient, id) => (
                            <li key={id}>{ingredient}</li>
                        ))) : (<li>{String(newRecipe.ingredients)}</li>)}
                    </ul>
                    <h4>Tiempo de preparación: {newRecipe.timeOfPreparation}</h4>
                    <h4>{`Rinde ${newRecipe.servings} porciones`}</h4>
                    <h4>Categoria: {newRecipe.category}</h4>

                    <div className="buttons">
                            <button onClick={(event) => handleSaveRecipe(newRecipe, event)}> Guardan en favoritos </button>
                            <ShareRecipeButton recipe={newRecipe}/>
                            <button className={isOwner ? 'editButton' : 'cannotEdit'}> {isOwner && <EditRecipe/>} </button>
                    </div>
                </div>
            )}
        </>
    )
}

export default AddNewRecipe