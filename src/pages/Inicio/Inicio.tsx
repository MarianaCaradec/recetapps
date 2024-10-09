import { useEffect, useState } from "react"

import './Inicio.css'

import { addDoc, collection, getDocs } from "firebase/firestore"
import { db, storage } from "../../services/firebaseConfig"

import {getDownloadURL, ref, uploadBytesResumable} from 'firebase/storage'

import AddButton from "../../components/Buttons/AddButton"

interface Recipe {
    id: string
    title: string
    img: string
    ingredients: Array<string> | string
    description: string
    timeOfPreparation: string
    servings: number | string
}

const Inicio = () => {
    const [recipes, setRecipes] = useState<Array<Recipe>>([])
    const [newRecipe, setNewRecipe] = useState<Recipe>({
        id: '',
        title: '',
        img: '',
        ingredients: '',
        description: '',
        timeOfPreparation: '',
        servings: 0
    })
    const [newRecipeIsVisible, setNewRecipeIsVisible] = useState(false)
    const [image, setImage] = useState<File | null>(null)
    const [imageUrl, setImageUrl] = useState('')
    const [uploadingImage, setUploadingImage] = useState(false)
    const [loading, setLoading] = useState(true)


    const fetchRecipes = () => {
        const recipesRef = collection(db, 'recipes')
        getDocs(recipesRef)
        .then(snapshot => {
            const dataRecipes = snapshot.docs.map(doc => {
                const dataDoc = doc.data()
                return {id: doc.id, ...dataDoc}
            })
            setRecipes(dataRecipes as Recipe[])
        }).finally(() => setLoading(false))
    }

    useEffect(() => {
        fetchRecipes()
    }, [])

    if(loading) {
        return (<h3>Cargandon...</h3>)
    }

    const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if(files && files.length > 0) {
            setImage(files[0])
        }
        
    }

    const addNewRecipe = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const formattedIngredients = typeof newRecipe.ingredients === 'string' ? 
        newRecipe.ingredients.split(',').map(ingredient => ingredient.trim()) 
        : newRecipe.ingredients

        if(!image) {
            return
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
                        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref); // Esto retorna Promise<string>
                        
                        setImageUrl(downloadURL)
                        const formattedRecipe = {
                            title: newRecipe.title,
                            img: downloadURL,
                            ingredients: formattedIngredients,
                            description: newRecipe.description,
                            timeOfPreparation: newRecipe.timeOfPreparation,
                            servings: newRecipe.servings,
                        };

                        const newRecipeRef = await addDoc(collection(db, 'recipes'), formattedRecipe);
                        const newRecipeRefId = newRecipeRef.id;

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
        };

    const showOrHide = () => {
        if(newRecipeIsVisible) {
            setNewRecipeIsVisible(true)
        } else {
            setNewRecipeIsVisible(false)
        }
    }

    return (
        <div className="recipesContainer">
            {recipes && recipes.map(recipe => {
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
                    </div>
                )
            })}
            <div>
                <h2>Agregar mi receta</h2>
                <form onSubmit={addNewRecipe}>
                    <label>Nombre de la receta</label>
                    <input type="text" value={newRecipe.title} onChange={(e) => setNewRecipe({...newRecipe, title: e.target.value})}/>
                    <div>
                        <label>Imagen del plato</label>
                        <input type="file" accept="image/" onChange={(e) => handleImage(e)}/>
                        
                    </div>
                    <label>Descripción</label>
                    <input type="text" value={newRecipe.description} onChange={(e) => setNewRecipe({...newRecipe, description: e.target.value})}/>
                    <label>Ingredientes</label>
                    <input type="text" value={newRecipe.ingredients} onChange={(e) => setNewRecipe({...newRecipe, ingredients: e.target.value})} placeholder="Escriba cada ingrediente separado por coma por favor"/>
                    <label>Tiempo de preparación</label>
                    <input type="text" value={newRecipe.timeOfPreparation} onChange={(e) => setNewRecipe({...newRecipe, timeOfPreparation: e.target.value})}/>
                    <label>Cantidad de porciones</label>
                    <input type="number" value={newRecipe.servings} onChange={(e) => setNewRecipe({...newRecipe, servings: e.target.value})}/>
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
                    <AddButton/>
                </div>
            )}
        </div>
    )
}

export default Inicio