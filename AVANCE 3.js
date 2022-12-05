// https://www.npmjs.com/package/uuid-token-generator
// { _id: 1, email: 'avance@mail.com', name: 'seba', pass: 'contra' }
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
const cuadricula = database.collection('cuadricula');

const TokenGenerator = require('uuid-token-generator');
const tokgen = new TokenGenerator(256, TokenGenerator.BASE62);
var secret = tokgen.generate();
const jwt = require('jsonwebtoken');
var token = '';


// aqui estan las rutas de la api rest que se van a usar en el front end 
function generateAccessToken(username) {
  return jwt.sign(username, secret, { expiresIn: '1800s' });
}

app.get('/', (req, res) => {
        console.log("Persona nueva en sistema");
        res.json({token: token});
})

app.post('/login', async (req, res) => {
  const query = { email: req.body.email };
  const usuario = await users.findOne(query);
        if(usuario) {
                if(usuario.pass == req.body.pass) {
                        res.status(200).json({
                           ok: true,
                           token: generateAccessToken(usuario)
                        });
                }
                else {
                        res.json({ ok: false, password: req.body.password });
                }
        }
        else {
                res.json({ ok: false, error: 'No existe el email.' });
        }
});

//va a recibir el parametro id
app.get('/user/:id', async (req, res) => {
    var ide = req.params.id;
    var name = await users.find({_id: ide}).toArray();
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
  const eventos = await cuadricula.findOne(query);
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
                    });
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
app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
});
