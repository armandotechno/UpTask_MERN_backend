import jwt from 'jsonwebtoken'
import Usuario from '../models/Usuario.js'

const checkAuth = async (req, res, next) => {

    let token

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try {
            token = req.headers.authorization.split(' ')[1]

            const decoded = jwt.verify(token, process.env.JWT_SECRET)// la misma variable de entorno que se utiliza para firmarlo se usa para verificarlo

            req.usuario = await Usuario.findById(decoded.id).select("-password -confirmado -token -createdAt -updatedAt -__v")

            return next()
        } catch (error) {
            return res.status(404).json({msg: "Hubo un error"})
        }
    }

    if(!token) {
        const error = new Error('Token no válido')
        return res.status(401).json({msg: error.message}) //401 (no ha sido ejecutada porque carece de credenciales válidas de autenticación para el recurso solicitado)
    }

    next()
}

export default checkAuth