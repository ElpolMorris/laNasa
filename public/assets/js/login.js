const email = document.getElementById("email");
const password = document.getElementById("password");
const loginForm = document.getElementById("login-form");
const tituloModal = document.getElementById('exampleModalLabel')
const infoModal = document.getElementById('info-modal')
const mensajeBienvenida = document.getElementById('mensaje-bienvenida')


const verificacion = async () => {
	const datos = {
		email: email.value,
		password: password.value,
	};
	modificarInfoModal('','')
	try {
		const res = await axios({
			method: "POST",
			url: "http://localhost:3000/login",
			data: datos,
        });
		const { data } = await res;
		mensajeBienvenida.insertAdjacentHTML('afterbegin',
		`<div class="modal-header">
			<h5 class="modal-title" id="exampleModalLabel">Ultra Secreto</h5>
		</div>
		<div class="modal-body text-center" id="info-modal">
			<div class="mb-3">Bienvenida a la NASA</div>
			<div class="spinner-border " role="status">
				<span class="sr-only text-center">Loading...</span>
			</div>
		</div>`
		)
		localStorage.setItem('token',data)
        setTimeout(() => {
            window.location.href = `http://localhost:3000/evidencias?token=${data}`;
		}, 3000);
		
		//window.location.href = `http://localhost:3000/evidencias?token=${data}`;
	} catch (error) {
		if(error.response.status == 401){
			modificarInfoModal('No está autorizado',error.response.data)
		} else {
			modificarInfoModal('Usuario o contraseña con errores',error.response.data)
		}
	}
};

modificarInfoModal = (titulo,info)=>{
	tituloModal.textContent= titulo
	infoModal.textContent = info
}
