const miFormulario = document.querySelector('form')


miFormulario.addEventListener('submit', ev => {
    ev.preventDefault();
    const formData = {}

    for(let el of miFormulario.elements){
        if(el.name.length > 0)
        formData[el.name] = el.value
    }
    fetch ('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type':'application/json'
        },
        body: JSON.stringify(formData),
        
    })
    .then(resp => resp.json())
    .then(data => {
        console.log(data)
        localStorage.setItem('token', data.token)
        window.location = 'chat.html'
    })
    .catch(console.warn)
})

function handleCredentialResponse(response) {

    //const Google token : ID token
    //console.log('id_token', response.credential);
    const body = {id_token:response.credential }

    fetch('http://localhost:8080/api/auth/google', {
        method: 'POST',
        headers: {
            'Content-Type':'application/json'
        },
        body: JSON.stringify(body)
    })
    .then(resp => resp.json())
    .then(resp => {
        console.log(resp)
        localStorage.setItem('email', resp.usuario.correo)
        localStorage.setItem('token', resp.token)
        window.location = 'portaladministrativo.html'
    })
    .catch(console.warn)

   // decodeJwtResponse() is a custom function defined by you
   // to decode the credential response.
   //const responsePayload = decodeJwtResponse(response.credential);

   //console.log("ID: " + responsePayload.sub);
   //console.log('Full Name: ' + responsePayload.name);
   //console.log('Given Name: ' + responsePayload.given_name);
   //console.log('Family Name: ' + responsePayload.family_name);
   //console.log("Image URL: " + responsePayload.picture);
   //console.log("Email: " + responsePayload.email);
}

const button = document.getElementById('google_signout');

button.onclick = () => {

    console.log(google.accounts.id)
    google.accounts.id.disableAutoSelect()

    google.accounts.id.revoke(localStorage.getItem('email'), done =>{
        localStorage.clear();
        location.reload();
    })
}
