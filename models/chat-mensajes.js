class Mensaje {

   constructor( uid, nombre, mensaje ){
      this.uid     = uid;
      this.nombre  = nombre;
      this.mensaje = mensaje;
   }

}



class ChatMensajes {

   constructor(){

      this.mensajes = [];
      this.usuarios = {}

   }

   // Metodos
   get ultimos10() {
      // solo los ultuimos 10
      this.mensajes = this.mensajes.slice(0,10);
      return this.mensajes;
   }

   get usuariosArr() {
      return Object.values( this.usuarios );
   }

   enviarMensaje( uid, nombre, mensaje ){
      this.mensajes.unshift(
         new Mensaje( uid, nombre, mensaje )
      );
   }

   conectarUsuario( usuario ) {
      this.usuarios[usuario.id] = usuario
   }

   desconectarUsuario( id ){
      delete this.usuarios[id];
   }

}


module.exports = ChatMensajes;