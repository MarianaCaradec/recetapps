import { useEffect } from 'react'
import { useUserContext } from '../../context/userContext'

import './NavBar.css'

import {Link} from 'react-router-dom'

const NavBar = () => {
    const {user, updateUser} = useUserContext()

    useEffect(() => {
        updateUser(); 
    }, []);

    return (
        <div className='navbar'>
            <div>
                <Link to={'/inicio'}> <h1>Recetapps</h1> </Link>
            </div>
            <div className='links'>
                <Link to={'/'}> <button>Sobre nosotros</button> </Link>
                <Link to={'/signin'}> <button>Ingresar</button> </Link>
                <Link to={user ? '/profile' : ''}> <button className={user ? 'miPerfil' : 'sinPerfil'}>Mi perfil</button> </Link>
            </div>
        </div>


    )
}

export default NavBar