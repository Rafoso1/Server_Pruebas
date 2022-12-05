// https://www.npmjs.com/package/uuid-token-generator
const express = require('express')
const app = express()
const port = 3000
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var cookieParser = require("cookie-parser");
app.use(cookieParser());

const { MongoClient } = require("mongodb");
const uri = "mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000";
const client = new MongoClient(uri);
const database = client.db('ticketera');
const users = database.collection('users');// users tiene: name, pass, email, utilizada para el register y el login

const TokenGenerator = require('uuid-token-generator');
const tokgen = new TokenGenerator(256, TokenGenerator.BASE62);
var token = tokgen.generate();

// aqui estan las rutas de la api rest que se van a usar en el front end 


app.get('/', (req, res) => {
        console.log("Persona nueva en sistema");
        res.send("Bienvenido");
})

app.post('/login', async (req, res) => {
  const query = { email: req.body.email };
  const usuario = await users.findOne(query);
        if(usuario) {
                if(usuario.pass == req.body.pass) {
                        res.status(200).json({
                           ok: true,
                           //token: jwt.sign({ user: req.body }, 'secret')
                           "Estado" : "Usuario creado satisfactoriamente",
                           "Nombre" : req.body.name,
                           "Email" : req.body.email,
                           "Contraseña" : req.body.pass
                        });
                }
                else {
                        res.json({ ok: false, password: req.body.password });
                }
        }
        else {
                res.json({ ok: false, error: 'No token provided.' });
        }
});


//va a recibir el parametro id
app.get('/user/:id', async (req, res) => {
    var id = req.params.id;
    var name = users.find({_id: "1"});
    //res.json(id);
    //recibe un token y retorna los datos del usuario
    //si el token es correcto

    let token = req.query.token || req.headers['authorization'];
    if (token) {
        jwt.verify(token, secret,
            (err, decoded) => {
                if (err) {
                    res.json({ ok: false, error: err });
                } else {
                    res.json({ 
                        ok: 'token exitoso, id valido',
                        "name": name
                    });
                }
            });
    } else {
        res.json({ ok: false, error: 'No token provided.' });
    }
});

app.get('/eventos', async (req, res) => {
  const query = { email: req.body.email };
  const usuario = await users.findOne(query);
    let token = req.query.token || req.headers['authorization'];
    if (token) {
        jwt.verify(token, secret,
            (err, decoded) => {
                if (err) {
                    res.json({ ok: false, error: err });
                } else {
                    res.json({
                      ok: true,
                      "Estado" : "Usuario creado satisfactoriamente",
                      "Nombre" : cliente.name,
                      "Apellido" : cliente.lastname,
                      "Correo" : cliente.email });
                }
            });
    } else {
        res.json({ ok: false, error: 'No token provided.' });
    }
});


app.get('/eventos/:id', (req, res) => {
    var id = req.params.id;
    //INSERTE FIND/FINDONE MONGODB 

    let token = req.query.token || req.headers['authorization'];
    if (token) {
        jwt.verify(token, 'secret',
            (err, decoded) => {
                if (err) {
                    res.json({ ok: false, error: err });
                } else {
                    let event = events.find(e => e.id == req.params.id);
                    res.json({
                      ok: true,
                    "Estado" : "Usuario creado satisfactoriamente",
                    "Nombre" : cliente.name,
                    "Apellido" : cliente.lastname,
                    "Correo" : cliente.email });
                }
            });
    } else {
        res.json({ ok: false, error: 'No token provided.' });
    }
});

app.post('/eventos/comprar/:id/:asiento/:iduser', (req, res) => {
    var id = req.params.id;
    var asiento = req.params.asiento;
    var iduser = req.params.iduser;
    //INSERTE FIND/FINDONE MONGODB  
    let token = req.query.token || req.headers['authorization'];
    if (token) {
        jwt.verify(token, 'secret',
            (err, decoded) => {
                if (err) {
                    res.json({
                      ok: false,
                      "Estado" : "Usuario creado satisfactoriamente",
                      "Nombre" : cliente.name,
                      "Apellido" : cliente.lastname,
                      "Correo" : cliente.email
                    });
                } else {
                    let event = events.find(e => e.id == req.params.id);
                    let asiento = event.asientos.find(a => a.id == req.params.asiento);
                    if (asiento.iduser == req.params.iduser) {
                        asiento.iduser = null;
                        res.json({
                          ok: true,
                          "Estado" : "Usuario creado satisfactoriamente",
                          "Nombre" : cliente.name,
                          "Apellido" : cliente.lastname,
                          "Correo" : cliente.email });
                    } else {
                        res.json({ ok: false, error: 'El asiento no pertenece al usuario' });
                    }
                }
              });
    } else {
        res.json({ ok: false, error: 'No token provided.' });
    } 
});
//---------------------------------------------------------------------------------------------------
// app.get('/login/:correo&&:contra',(req,res) =>{
//     var correo= req.params.email;
//     var contra = req.params.contra;
//     //INSERTE FIND/FINDONE MONGODB  
//     var resultado=false
//     if(resultado){
//       req.cookies.email=correo;
//       //req.cookies.name=usuario.name;
      
//       console.log(req.cookies);
//       res.status(200).json({
//         "Estado" : "Logeado con exito",
//         "Correo": req.cookies.email
//       })
//     }else{
//       res.status(200).json({
//         "Estado" : "El usuario no existe"
//       })
//     }
//   })
// ---------------------------------------------------------------------------------------------------
// app.get("/API/eventos", async (req, res) => {
// 	try {
// 		const collection = database.collection("eventos");
// 		collection.find({}).toArray(function (err, result) {
// 			if (err) {
// 				console.log(err);
// 			} else {
// 				console.log("Query exitosa a la db, eventos enviados");
// 				res.json({
// 					eventos: result,
// 				});
// 				return;
// 			}
// 		});

// 		//res.send(usuario);
// 	} finally {
// 		// Ensures that the client will close when you finish/error
// 		//await client.close();
// 		console.log("Error en la query");
// 	}
// });

// function loginByToken(req) {
// 	const token = req.headers.authorization;
// 	if (!token) return null;
// 	const decoded = jwt.verify(token, SECRET_JWT_KEY);
// 	return decoded;
// }

// app.post("/API/login", (req, res) => {
// 	if (loginByToken(req)) {
// 		res.status(200).json({
// 			message: "Login con token exitoso!",
// 		});
// 		return;
// 	}
// 	//Ejemplo de token para Frez
// 	// https://jwt.io/#debugger-io?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiRnJleiIsIm5hbWUiOiJtaW5lY3JhZnQifQ.NfI48yK1xd3LAQJz07tDRSIjmdFX3v4_UZPbM9Ys9Io

// 	//Recibe datos desde el cliente
// 	const request = JSON.parse(JSON.stringify(req.body));

// 	//verifico que request.user y request.password no esten vacios
// 	if (request.user && request.password) {
// 		const user = request.user;
// 		const password = request.password;

// 		//consulto a la db si existe el usuario
// 		const collection = database.collection("usuarios");
// 		collection.find({ usuario: user }).toArray(function (err, result) {
// 			if (err) {
// 				console.log(err);
// 			} else {
// 				//si existe el usuario, verifico que la password sea correcta
// 				if (result[0].password == password) {
// 					//creo el token
// 					const token = jwt.sign(
// 						{ user: user, id: result[0]._id },
// 						SECRET_JWT_KEY,
// 						{ expiresIn: "1h" }
// 					);
// 					res.status(200).json({
// 						token: token,
// 					});
// 					return;
// 				} else {
// 					res.json({
// 						message: "Contraseña incorrecta",
// 					});
// 					return;
// 				}
// 			}
// 		});
// 	} else {
// 		res.status(400).json({
// 			message: "Datos incompletos",
// 		});
// 		return;
// 	}
// });

// //Recibe un id de usuarioy retorna los datos del usuario
// app.post("/API/user/:id", (req, res) => {
// 	if (!loginByToken(req)) {
// 		res.status(401).json({
// 			message: "Token invalido",
// 		});
// 		return;
// 	}
// 	const id = req.params.id;
// 	const collection = database.collection("usuarios");
// 	collection.find({ _id: ObjectID(id) }).toArray(function (err, result) {
// 		if (err) {
// 			console.log(err);
// 		} else {
// 			res.json({
// 				usuario: result[0],
// 			});
// 			return;
// 		}
// 	});
// });

app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
});
