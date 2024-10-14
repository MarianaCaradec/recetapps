import './Home.css'

import homepic from '../../assets/homepic.jpg'

const Home  = () => {
    return (
        <div className='homePage'>
            <div>
                <h2>¡Bienvenidx a Recetapps, tu nueva compañera en la cocina!</h2>
            </div>
            <div className='welcome'>
                <img className='homePic' src={homepic} alt="home pic" />
                
            </div>
            <div>
            <p> Descubre un mundo de sabores con nuestra aplicación de recetas fácil de usar, diseñada para ayudarte a preparar deliciosos platos en casa. Ya seas un chef experimentado o estés dando tus primeros pasos en la cocina, Recetapps te ofrece una variedad de recetas para cada ocasión, desde comidas rápidas hasta cenas gourmet. </p>
                <h3>Nuestra plataforma te permite:</h3>
                <ul> 
                    <li>Explorar recetas por categorías e ingredientes.</li>
                    <li>Guardar tus recetas favoritas y organizarlaas a tu gusto.</li>
                    <li>Crear tu propio recetario digital.</li>
                    <li>Compartir tus creaciones culinarias con amigos y familiares.</li>
                </ul>
                <h3>Con Recetapps, cocinar nunca ha sido tan fácil y divertido. ¡Inspírate, cocina y disfruta!</h3>
            </div>
        </div>
    )
}

export default Home