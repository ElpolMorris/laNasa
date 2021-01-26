const nombre = document.getElementById("nombre");
const email = document.getElementById("email");
const password = document.getElementById("password");
const formularioRegistroNasa = document.getElementById("registro-nasa");

formularioRegistroNasa.addEventListener("submit", async (e) => {
	e.preventDefault();
	const datos = {
		nombre: nombre.value,
		email: email.value,
		password: password.value,
	};
	if (!validadorDatos(datos)) {
		return false;
	}
	try {
		if ((!nombre.value, !email.value, !password.value)) {
            alert("Ingrese todos los campos");
            
		} else {
			await axios({
				method: "POST",
				url: "http://localhost:3000/register",
				data: datos,
			});
			alert("Todo ha salido bien, le confirmaremos por correo si está capacitado para ayudar a la NASA");
			formularioRegistroNasa.reset();
		}
	} catch (error) {
		console.log(error);
	}
});

const validadorDatos = (datos) => {
	//const expEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3,4})+$/;
	const expEmail = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
	const expPass = /^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{8,16}$/;
	const expName = /^[A-Za-z\s]+$/g;
	if (!expEmail.test(datos.email)) {
        alert("Ingrese un mail real");
        formularioRegistroNasa.reset();
		return false;
	} else if (!expPass.test(datos.password)) {
		alert(`La clave debe contener entre 8 a 16 caracteres,
            debe tener al menos 1 mayúscula y 1 minúscula y no puede tener símbolos
        `);
        formularioRegistroNasa.reset();
		return false;
	} else if (!expName.test(datos.nombre)) {
        alert("Escriba un nombre real");
        formularioRegistroNasa.reset();
		return false;
	} else {
		return true;
	}
};
