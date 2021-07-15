const miFormulrio = document.querySelector('form');

// console.log(window.location.hostname.includes('localhost'));
// lo anterior retrona true si ingresamos por

var url = ( window.location.hostname.includes('localhost') )
            ? 'http://localhost:8080/api/auth/'
            : 'https://restserver-curso-fher.herokuapp.com/api/auth/';

miFormulrio.addEventListener('submit', (e) => {
   e.preventDefault();
   const formData = {};

   for( let el of miFormulrio.elements ){
      if( el.name.length > 0 ){
         formData[el.name] = el.value;
      }
   }
   // console.log(formData);

   fetch( url + 'login', {
      method: 'POST',
      body: JSON.stringify( formData ),
      headers: { 'Content-Type': 'application/json' }
   })
   .then( resp => resp.json() )
   // extraemos de la data
   .then( ({ msg, token }) => {
      // console.log(data);
      if( msg ) {
         return console.error( msg );
      }

      localStorage.setItem('token', token);
      window.location = 'chat.html';
   })
   .catch( err => {
      console.log(err);
   } )

   
}) ;           
            


function onSignIn(googleUser) {

   var profile = googleUser.getBasicProfile();
   console.log('-------Google Sign-----------');
   // Do not send to your backend! Use an ID token instead.
   console.log('ID: ' + profile.getId()); 
   // console.log('Name: ' + profile.getName());
   // console.log('Image URL: ' + profile.getImageUrl());
    // This is null if the 'email' scope is not present.
   console.log('Email: ' + profile.getEmail());
   console.log('----------------------------')

   var id_token = googleUser.getAuthResponse().id_token;
   const data = { id_token };

   fetch( url + 'google', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify( data )
   })
   .then( resp => resp.json() )
   .then( ({ token }) => {
      // console.log(token);
      // grabamos el token en el localstorage
      localStorage.setItem('token', token);
      window.location = 'chat.html';
   })
   .catch( console.log );
   
}

function signOut() {
   var auth2 = gapi.auth2.getAuthInstance();
   auth2.signOut().then(function () {
   console.log('User signed out.');
   });
}
