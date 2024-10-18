import { createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from "react"

import { auth } from "../services/firebaseConfig"
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, onAuthStateChanged, User } from "firebase/auth"

import { Form, Messages } from "../types"

interface UserContextType {
    inputValues: Form
    setInputValues: Dispatch<SetStateAction<Form>>
    mailIsValid: boolean
    setMailIsValid: Dispatch<SetStateAction<boolean>> 
    passwordIsValid: boolean
    setPasswordIsValid: Dispatch<SetStateAction<boolean>> 
    status: Messages
    setStatus: Dispatch<SetStateAction<Messages>> 
    registerUserMail: (mail: string, password: string) => void
    registerUserGoogle: () => void
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    formIsValid: boolean
    user: User | null
    setUser: Dispatch<SetStateAction<User | null>>
    updateUser: () => void
}

export const UserContext = createContext<UserContextType | null>(null)

export const UserContextProvider = ({children}: any) => {

    const [inputValues, setInputValues] = useState<Form>({
        mail: '',
        password: ''
    })
    const [mailIsValid, setMailIsValid] = useState<boolean>(false)
    const [passwordIsValid, setPasswordIsValid] = useState<boolean>(false)
    const [status, setStatus] = useState<Messages>(Messages.waiting)
    const [user, setUser] = useState<User | null>(null)

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
            const result = await signInWithPopup(auth, provider)
            const userId = result.user.uid
            return <h3>¡Bienvenido {userId}!</h3>
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

    const updateUser = () => {
        onAuthStateChanged(auth, (currentUser) => {
            if(currentUser) {
                setUser(currentUser)
            }
        })
    }

    useEffect(() => {
        updateUser();
    }, []);

    return (
        <UserContext.Provider 
        value={{
        inputValues, 
        setInputValues, 
        mailIsValid,
        setMailIsValid, 
        passwordIsValid, 
        setPasswordIsValid,
        status,
        setStatus, 
        registerUserMail, 
        registerUserGoogle,
        handleChange, 
        formIsValid,
        user, 
        setUser, 
        updateUser,}}>
            {children}
        </UserContext.Provider>
    )
}

export const useUserContext = () => {
    const context = useContext(UserContext)
    if(!context) {
        throw new Error('useRecipeContext debe ser usado dentro de un RecipeProvider');
    }
    return context
}