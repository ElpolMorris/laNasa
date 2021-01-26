const { Pool } = require("pg");

const config = {
	host: "localhost",
	database: "nasa",
	user: "postgres",
	port: 5432,
	password: "postgres",
};

const pool = new Pool(config);

const crearUsuario = async (data) => {
	const { nombre, email, password} = data;
	const consulta = {
		text:
			"insert into usuarios (nombre,email,password,auth) values ($1,$2,$3,$4) RETURNING *",
		values: [nombre, email, password, false],
	};
	try {
		const respuesta = await pool.query(consulta);
		return respuesta.rows[0];
	} catch (error) {
		console.log(error);
		console.log(error.id);
	}
};

const leerUsuario = async () =>{
	const consulta = "SELECT * from usuarios"
	try {
		const respuesta = await pool.query(consulta)
		return respuesta.rows
	} catch (error) {
		console.log(error)
		console.log(error.code)
	}
}

const actualizarAutorizacion = async(data)=>{
	const { id, auth } = data
	const consulta = {
		text: 'UPDATE usuarios SET auth = $1 where id = $2 RETURNING *',
		values: [auth, id]
	}
	try {
		const respuesta = await pool.query(consulta)
		return respuesta.rows[0]
	} catch (error) {
		console.log(error)
	} 
}

const verificarUsuario = async (data) => {
	const { email, password } = data
	const consulta = {
		text: "SELECT email,password,auth from usuarios where (email = $1 and password= $2)",
		values: [email, password]
	}
	try {
		const respuesta = await pool.query(consulta)
		return respuesta.rows
	} catch (error) {
		console.log(error)
	}
}

module.exports = {
	crearUsuario,
	leerUsuario,
	actualizarAutorizacion,
	verificarUsuario
};
