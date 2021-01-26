const express = require("express");
const app = express();
const exphbs = require("express-handlebars");
const expressUpload = require("express-fileupload");
const { v4: uuidv4 } = require('uuid');
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const {
	crearUsuario,
	leerUsuario,
	actualizarAutorizacion,
	verificarUsuario,
} = require("./query");
const { correoAuth } = require("./mailer");

const secretKey = "0303456";

app.listen(3000, console.log("servidor en http://localhost:3000/"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// v i e w  e n g i n e

app.set("view engine", "handlebars");
app.engine(
	"handlebars",
	exphbs({
		layoutsDir: __dirname + "/views",
		partialsDir: __dirname + "/views/components",
	})
);
// f i l e u p l o a d

app.use(
	expressUpload({
		limits: { fileSize: 10000000 },
		abortOnLimit: true,
		responseOnLimit:
			"El archivo pesa demasiado, súbalo de nuevo por favor (max 10MB)",
	})
);

// s t a t i c s  f i l e s

app.use(express.static(__dirname + "/public"));

app.use(
	"/bootstrap",
	express.static(__dirname + "/node_modules/bootstrap/dist/css")
);

app.use(
	"/bootstrapJs",
	express.static(__dirname + "/node_modules/bootstrap/dist/js")
);

app.use("/jquery", express.static(__dirname + "/node_modules/jquery/dist"));

// r o u t e s
app.get("/", (req, res) => {
	res.render("Main", {
		layout: "Main",
	});
});

app.post("/register", async (req, res) => {
	const data = req.body;
	const respuesta = await crearUsuario(data);
	respuesta? (
		await correoAuth(
				respuesta.email,
				"Espere por instrucciones",
				`
				<div>Estamos revisando su caso</div>
				<div>Le notificaremos por correo si cumple con nuestros parámetros 
				para acceder a la plataforma</div>
				`
		),res.send("wena"),console.log('correo confirm'))
		: res.status(500).send("Error");
});

app.get("/admin", async (req, res) => {
	const users = await leerUsuario();
	res.render("Admin", {
		layout: "Admin",
		users: users,
		auth: users["auth"],
	});
});

app.put("/validacion", async (req, res) => {
	const data = req.body;
	try {
		const respuesta = await actualizarAutorizacion(data);
		respuesta.auth? 
			(await correoAuth(
					respuesta.email,
					"Ya está Autorizado",
					`<div>Ya puede acceder a la plataforma de la NASA</div>
			<div>Diríjase a  <a href=http:localhost:3000/login> y podrá acceder a la plataforma</a></div>
			`
			), res.send("Usuario Autorizado"),console.log('correo auth'))
			: 
			res.send("usuario no autorizado");
	} catch (error) {
		console.log(error);
	}
});

app.get("/login", (req, res) => {
	res.render("Login", {
		layout: "Login",
	});
});

app.post("/login", async (req, res) => {
	const data = req.body;
	const verificacion = await verificarUsuario(data);
	if (verificacion.length !== 0) {
		if (verificacion[0].auth == true) {
			const token = jwt.sign(
				{
					exp: Math.floor(Date.now() / 1000) + 120,
					data: data,
				},
				secretKey
			);
			res.send(token);
		} else {
			res
				.status(401)
				.send("usted no está registrado, llamaremos al fbi en este instante");
		}
	} else {
		res.status(404).send("no me engañes no... no me trates de engañar 🎵");
	}
});

app.get("/evidencias", (req, res) => {
	let { token } = req.query;

	jwt.verify(token, secretKey, (err, decoded) => {
		err
			? res.status(401).send({
					error: "401 not Authorized",
					message: err.message,
			  })
			: res.render("Evidencias", { layout: "Evidencias" });
	});
});

app.get("/redirect", (req, res) => {
	res.redirect("http://localhost:3000/evidencias");
});

app.post("/upload", (req, res) => {
	const { foto } = req.files;
	const { mimetype } = foto;
	const mimeTypeAuth = ["image/jpeg", "image/png", "image/jpg", "image/gif"];
	let codBase = uuidv4().slice(30)
	mimeTypeAuth.some((m) => m == mimetype)
		? foto.mv(`${__dirname}/images/${codBase}-OVNI.jpg`, (err) => {
				res.render("Nasa",{layout:"Nasa"});
		})
		: res.send("Sólo se permite jpeg, png, gif");
});
