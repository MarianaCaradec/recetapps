import { Recipe } from "../../types";


const ShareRecipeButton = ({recipe}: {recipe: Recipe}) => {
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
        <div>
            <button onClick={handleShare}>Compartir enlace</button>
            <button onClick={shareOnWhatsApp}>Compartir en WhatsApp</button>
        </div>
    )
}

export default ShareRecipeButton