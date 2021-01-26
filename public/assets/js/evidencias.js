const formFile = document.getElementById('form-file')
const idArchivo = document.getElementById('foto')

formFile.addEventListener('submit',(e)=>{
    console.log(idArchivo.value)
    if(!idArchivo.value){
        e.preventDefault()
        alert('Debe enviar algo, de lo contrario llamaremos al FBI')
    }
})