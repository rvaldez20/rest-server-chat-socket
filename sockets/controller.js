const { Socket } = require("socket.io");
const { compararJWT } = require("../helpers");
const { ChatMensajes } = require('../models')

//instanciamos ChatMensajes
const chatMensajes = new ChatMensajes();

const socketController = async( socket = new Socket(), io ) => {
   // console.log( 'Cliente Conectado', socket.id );

   
   // console.log(socket.handshake.headers['x-token']);  
   const usuario = await compararJWT( socket.handshake.headers['x-token'] );
   if ( !usuario ){
      return socket.disconnect();
   }

   // console.log('Se conecto ', usuario.nombre);

   // agregar al usuario conectado
   chatMensajes.conectarUsuario( usuario );

   // Cuando alguien se conecte
   io.emit('usuarios-activos', chatMensajes.usuariosArr );

   // si alguien se conecta se actualizan los ultimos 10 mensajes
   socket.emit('recibir-mensajes', chatMensajes.ultimos10 );

   /*
      Cada usuartio estara conectado a 3 sales
      1. global (io.)
      2. socket.id
      3. usuario.id
   */

   // conectarlo a una sala especial
   socket.join( usuario.id );

   // limpiar cuando alguien se desconecta
   socket.on('disconnect', () => {
      // lo desconecta
      chatMensajes.desconectarUsuario( usuario.id );
      // y s eemite que el usuario se descoencto
      io.emit('usuarios-activos', chatMensajes.usuariosArr );
   });

   // enviar mensaje
   socket.on('enviar-mensaje', (payload) => {
      const { uid, mensaje } = payload;

      //si enviamos el uid quiere decir que es un mensaje privadoa un usuario
      if( uid ) {
         // Mensaje privado
         socket.to( uid ).emit('mensaje-privado', { de:usuario.nombre, mensaje })

      } else {
         // mensaje para todos
         chatMensajes.enviarMensaje( usuario.id, usuario.nombre, mensaje );
         io.emit('recibir-mensajes', chatMensajes.ultimos10 );
      }


    });

}


module.exports = {
   socketController
}