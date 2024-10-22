import { createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from "react"

import { auth, db } from "../services/firebaseConfig"
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, onAuthStateChanged, User } from "firebase/auth"

import { Form, Messages, Recipe } from "../types"
import { collection, getDocs, query, where } from "firebase/firestore"

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
    userRecipes: Recipe[]
    setUserRecipes: Dispatch<SetStateAction<Recipe[]>>
    updateUser: () => void
    fetchUserRecipes: () => void
}

export const UserContext = createContext<UserContextType | null>(null)

export const UserContextProvider = ({children}: { children: React.ReactNode }) => {

    const [inputValues, setInputValues] = useState<Form>({
        mail: '',
        password: ''
    })
    const [mailIsValid, setMailIsValid] = useState<boolean>(false)
    const [passwordIsValid, setPasswordIsValid] = useState<boolean>(false)
    const [status, setStatus] = useState<Messages>(Messages.waiting)
    const [user, setUser] = useState<User | null>(null)
    const [userRecipes, setUserRecipes] = useState<Recipe[]>([])

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

    const fetchUserRecipes = async () => {
        if (user) {
            const userFeedRecipes = query(collection(db, 'recipes'), where('user.userId', '==', user.uid));
            const querySnapshot = await getDocs(userFeedRecipes);
            const userRecipes = querySnapshot.docs.map(doc => ({id: doc.id, ...doc.data()} as Recipe));
            setUserRecipes(userRecipes) 
        } else {
            console.error('No hay un usuario autenticado');
        }
        };

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
        userRecipes,
        setUserRecipes, 
        updateUser,
        fetchUserRecipes}}>
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