var url = ( window.location.hostname.includes('localhost') )
            ? 'http://localhost:8080/api/auth/'
            : 'https://restserver-curso-fher.herokuapp.com/api/auth/';

let usuario = null;
let socket = null;


// referencias html
const txtUid = document.querySelector('#txtUid');
const txtMensaje = document.querySelector('#txtMensaje');
const ulUsuarios = document.querySelector('#ulUsuarios');
const ulMensajes = document.querySelector('#ulMensajes');
const btnSalir = document.querySelector('#btnSalir');


// validar el token del local storage
const validarJWT = async() => {  
   const token = localStorage.getItem('token') || '';

   if ( token.length <= 10 ) {
      // token invalido
      // redireccionamos al usuario
      window.location = 'index.html';
      throw new Error('No hay token en el servidor')
   }

   const resp  = await fetch( url, {
      headers: { 'x-token': token }
   })

   const { usuario: userDB, token: tokenDB } = await resp.json();
   // console.log(userDB, tokenDB);
   
   // revovar el JWT
   localStorage.setItem('token', tokenDB);

   // establecemos el usuaio
   usuario = userDB;

   // una vez que ingreso se redirecciona a la pagina chat.html
   document.title = usuario.nombre;

   await conectarSocket();
}


const conectarSocket = async() => {
   
  socket = io({
      'extraHeaders': {
         'x-token': localStorage.getItem('token')
      }
   });

   socket.on('connect', () => {
      console.log('Sockets Online');
   })

   socket.on('disconnect', () => {
      console.log('Sockets user');
   })

   socket.on('recibir-mensajes', (payload) => {
      dibujarMensajes(payload);
   });

   socket.on('usuarios-activos', ( payload ) => {      
      dibujarUsuarios(payload);
   });

   socket.on('mensaje-privado', (payload) => {
      console.log('Privado:', payload);
   });

}

const dibujarUsuarios = ( usuarios = [] ) => {

   // creamos el html
   let usesrsHtml = '';
   usuarios.forEach( ({ nombre, uid }) => {

      usesrsHtml += `
         <li>
            <p>
               <h5 class="text-success"> ${ nombre} </h5>
               <span class="fs-6 text-muted"> ${ uid } </span>
            </p>
         </li>
      `;
   });

   ulUsuarios.innerHTML = usesrsHtml;
}

const dibujarMensajes = ( mensajes = [] ) => {

   // creamos el html
   let mensajesHTML = '';
   mensajes.forEach( ({ nombre, mensaje }) => {

      mensajesHTML += `
         <li>
            <p>
               <span class="text-primary"> ${ nombre} </span>
               <span> ${ mensaje } </span>
            </p>
         </li>
      `;
   });

   ulMensajes.innerHTML = mensajesHTML;
}

txtMensaje.addEventListener('keyup', (e) => {
   const {keyCode} = e;
   
   const mensaje = txtMensaje.value;
   const uid = txtUid.value;
   
   if(keyCode !== 13){
       return;
   }

   if( mensaje === 0 ) {
      return;
   }

   socket.emit('enviar-mensaje', { mensaje, uid });
   txtMensaje.value = '';

})




const main = async() => {

   // validar el JWT
   await validarJWT()

}


main();




