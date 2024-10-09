import { useState } from "react"

import {Link} from 'react-router-dom'

import './Signin.css'

import { auth } from "../../services/firebaseConfig"
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth"

interface Form {
    mail: string
    password: string | number
}

enum Messages {
    waiting = 'Debes llenar los campos con los datos correspondientes para poder ingresar a la plataforma',
    success = 'El formulario se ha enviado con éxito',
    error = 'Recuerda que el mail debe contener @ y .com, y tu contraseña mínimo dos números y una letra mayúscula',
    okay = 'Los campos han sido completados correctamente, puedes ingresar'
}

const Signin = () => {
    const [inputValues, setInputValues] = useState<Form>({
        mail: '',
        password: ''
    })
    const [mailIsValid, setMailIsValid] = useState(false)
    const [passwordIsValid, setPasswordIsValid] = useState(false)
    const [status, setStatus] = useState<Messages>(Messages.waiting)

    const registerUserMail = async (mail: string, password: string) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, mail, password)
            await signInWithEmailAndPassword(auth, inputValues.mail, String(inputValues.password));
            const user = userCredential.user
            return user
        }
        catch {
            return (<h3>{Messages.error}</h3>)
        }
    }

    const registerUserGoogle = async () => {
        try {
            const provider = new GoogleAuthProvider()
            await signInWithPopup(auth, provider)
        }
        catch {
            return (<h3>{Messages.error}</h3>)
        }
    }

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target

        setInputValues({
            ...inputValues, 
            [name]: value
            })

        const mailRegexp: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        const passwordRegexp: RegExp = /^(?=.*[A-Z])(?=.*\d).+$/     

        if(name === 'mail'){
            if(mailRegexp.test(value)) {
                setMailIsValid(true)
            } else {
                setMailIsValid(false)
            }
        }
        
        if(name === 'password') {
            if(passwordRegexp.test(value)) {
                setPasswordIsValid(true)
            } else {
                setPasswordIsValid(false)
            }
        }

        if(mailRegexp.test(inputValues.mail) && typeof inputValues.password === 'string' && passwordRegexp.test(inputValues.password)) {
            setStatus(Messages.okay)
        } else {
            setStatus(Messages.error)
        }
    }

    const formIsValid = mailIsValid && passwordIsValid


    const sendForm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if(!formIsValid || !registerUserGoogle) {
            setStatus(Messages.error)
            return ;
        }

        try {
            await registerUserMail(inputValues.mail, String(inputValues.password))
            setStatus(Messages.success)
            setInputValues({mail: '', password: ''})
            setTimeout(() => {
                setStatus(Messages.waiting)
                setMailIsValid(false)
                setPasswordIsValid(false)
            }, 2000);
        }
        catch {
            setStatus(Messages.error)
        }

    }

    return (
        <div className="formContainer">
            <div className="form">
                <form onSubmit={sendForm}>
                    <label>Escriba su mail</label>
                    <input onChange={(e) => handleChange(e)} type="email" value={inputValues.mail} name="mail"/>
                    <label>Asignele una contraseña</label>
                    <input onChange={(e) => handleChange(e)} type="password" value={inputValues.password} name="password"/>
                    <div className="sendingStatus">
                        <Link to={'/inicio'}> <button className="sendButton" type='submit' disabled= {!formIsValid ? true : false}>  Ingresar con mi mail </button> </Link> 
                        <Link to={'/inicio'}> <button className="sendButton" type='submit' onClick={registerUserGoogle}> Ingresar con Google </button> </Link>
                        <div className="message">
                            {status && <h3 className={!formIsValid && inputValues ? 'error' : 'success'}>{status}</h3>}
                        </div>
                    </div>
                </form>
            </div>
        </div>
        
    )
}

export default Signin