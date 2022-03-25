import mongoose from "mongoose";
import bcrypt from "bcrypt"

//Definir una Schema (Estructura de una base de datos)
const usuarioSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    token: {
        type: String,

    },
    confirmado: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
   }
)
usuarioSchema.pre('save', async function(next) {
    if(!this.isModified("password")) {
        next()
    }
    //Usamos la declaración de la función para que el this. se refiera al objeto del usuario
    const salt = await bcrypt.genSalt(10)//10 rondas, el 10 es el número por default
    this.password = await bcrypt.hash(this.password, salt)
}) //Se ejecuta antes de guardar en la base de datos

usuarioSchema.methods.comprobarPassword = async function(passwordFormulario) {
    return await bcrypt.compare(passwordFormulario, this.password)
}

const Usuario = mongoose.model("Usuario", usuarioSchema)
export default Usuario