window.addEventListener('load',()=>{
    const numero = document.querySelectorAll(".numero")
    numero.forEach((n,i)=>{
        n.textContent = i + 1
    })
})


const autorizarUsuario = async (input, id) =>{
    let auth = input.checked
    const datos = {
        id,auth
    }
    try {
        await axios({
            method: "PUT",
            url: "http://localhost:3000/validacion",
            data: datos,
        })
        location.reload()
    } catch (error) {
        console.log(error)
    }
}