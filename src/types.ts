export interface Form {
    mail: string
    password: string | number
}

export enum Messages {
    waiting = 'Debes llenar los campos con los datos correspondientes para poder ingresar a la plataforma',
    success = 'El formulario se ha enviado con éxito',
    error = 'Recuerda que el mail debe contener @ y .com, y tu contraseña mínimo dos números y una letra mayúscula',
    okay = 'Los campos han sido completados correctamente, puedes ingresar'
}

export interface Recipe {
    id: string
    title: string
    img: string
    ingredients: Array<string> | string
    description: string
    timeOfPreparation: string
    servings: number | string
    user: {
        userId: string
        displayName: string | null
        photoURL: string | null
    }
}
