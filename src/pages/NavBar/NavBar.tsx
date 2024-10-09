import './NavBar.css'

import {Link} from 'react-router-dom'

const NavBar = () => {
    return (
        <div className='navbar'>
            <div>
                <h1>Recetapps</h1>
            </div>
            <div className='links'>
                <Link to={'/'}> <button>Sobre nosotros</button> </Link>
                <Link to={'/signin'}> <button>Ingresar</button> </Link>
            </div>
        </div>


    )
}

export default NavBar