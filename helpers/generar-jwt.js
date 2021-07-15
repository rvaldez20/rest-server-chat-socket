const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');



const generarJWT = ( uid = '' ) => {

    return new Promise( (resolve, reject) => {

        const payload = { uid };

        jwt.sign( payload, process.env.SECRETORPRIVATEKEY, {
            expiresIn: '4h'
        }, ( err, token ) => {

            if ( err ) {
                console.log(err);
                reject( 'No se pudo generar el token' )
            } else {
                resolve( token );
            }
        })

    })
}


const compararJWT = async( token = '' ) => {
    
    try {
        
        // validamos si no vien un token returnamos null
        if ( token.length < 10 ) {
            return null;
        }

        // extraemos del uid del payload
        const { uid } = jwt.verify( token, process.env.SECRETORPRIVATEKEY );

        // y obtenemos el usuartio de la DB
        const usuario = await Usuario.findById( uid );
        if ( usuario ){
            if ( usuario.estado ) {
                return usuario;
            } else {
                return null;    
            }
        } else {
            return null;
        }

    } catch (error) {
        return null;
    }
}


module.exports = {
    generarJWT,
    compararJWT
}

