const miFormulario = document.querySelector('form')


miFormulario.addEventListener('submit', ev => {
    ev.preventDefault();
    const formData = {}

    for(let el of miFormulario.elements){
        if(el.name.length > 0)
        formData[el.name] = el.value
    }
    fetch ('http://localhost:8080/api/usuarios', {
        method: 'POST',
        headers: {
            'Content-Type':'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(resp => resp.json())
    .then(data => {
        console.log(data)
        localStorage.setItem('token', data.token)
    
    })
    .catch(console.warn)
})


//crear candidato
const miFormulario2 = document.getElementById("miFormulario2");
const botonSubmit2 = document.getElementById("botonSubmit2");


miFormulario2.addEventListener('submit', ev => {
    ev.preventDefault();
    
    if (ev.submitter === botonSubmit2) {
        // Realiza acciones específicas para el segundo botón "submit" aquí.
    
        // Obtén los datos del formulario.
        const formData = {};
    
        for (let el of miFormulario2.elements) {
          if (el.name.length > 0) {
            formData[el.name] = el.value;
          }
        }

    fetch ('http://localhost:8080/api/candidatos', {
        method: 'POST',
        headers: {
            'Content-Type':'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(resp => resp.json())
    .then(data => {
        console.log(data)
        localStorage.setItem('token', data.token)
    
    })
    .catch(console.warn)
}
})


