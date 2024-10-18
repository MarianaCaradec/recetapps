import {Link} from 'react-router-dom'

import './Signin.css'

import { Messages } from "../../types.ts"
import { useUserContext } from "../../context/userContext.tsx"

const Signin = () => {
    const {setInputValues, 
        inputValues,
        setMailIsValid,
        setPasswordIsValid,
        status,
        setStatus,
        formIsValid,
        registerUserMail, 
        registerUserGoogle,
        handleChange} = useUserContext()

    const sendForm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if(!formIsValid) {
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