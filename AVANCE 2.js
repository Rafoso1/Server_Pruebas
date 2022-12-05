/ https://www.npmjs.com/package/uuid-token-generator
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
 33         console.log("Persona nueva en sistema");
 34         res.json({token: token});
 35 })
 36 
 37 app.post('/login', async (req, res) => {
 38   const query = { email: req.body.email };
 39   const usuario = await users.findOne(query);
 40         if(usuario) {
 41                 if(usuario.pass == req.body.pass) {
 42                         res.status(200).json({
 43                            ok: true,
 44                            token: generateAccessToken(usuario)
 45                         });
 46                 }
 47                 else {
 48                         res.json({ ok: false, password: req.body.password });
 49                 }
 50         }
 51         else {
 52                 res.json({ ok: false, error: 'No existe el email.' });
 53         }
 54 });

//va a recibir el parametro id
 57 app.get('/user/:id', async (req, res) => {
 58     var ide = req.params.id;
 59     var name = await users.find({_id: ide}).toArray();
 60     //recibe un token y retorna los datos del usuario
 61     //si el token es correcto
 62 
 63     let token = req.query.token || req.headers['authorization'];
 64     if (token) {
 65         jwt.verify(token, secret,
 66             (err, decoded) => {
 67                 if (err) {
 68                     res.json({ ok: false, error: err });
 69                 } else {
 70                     res.json({
 71                         ok: 'token exitoso, id valido',
 72                         "name": name
 73                     });
 74                 }
 75             });
 76     } else {
 77         res.json({ ok: false, error: 'No token provided.' });
 78     }
 79 });

app.get('/eventos', async (req, res) => {
 82   const query = { email: req.body.email };
 83   const eventos = await cuadricula.findOne(query);
 84     let token = req.query.token || req.headers['authorization'];
 85     if (token) {
 86         jwt.verify(token, secret,
 87             (err, decoded) => {
 88                 if (err) {
 89                     res.json({ ok: false, error: err });
 90                 } else {
 91                     res.json({
 92                       ok: true,
 93                       "Estado" : "Usuario creado satisfactoriamente",
 94                     });
 95                 }
 96             });
 97     } else {
 98         res.json({ ok: false, error: 'No token provided.' });
 99     }
100 });

app.get('/eventos/:id', (req, res) => {
103     var id = req.params.id;
104     //INSERTE FIND/FINDONE MONGODB 
105 
106     let token = req.query.token || req.headers['authorization'];
107     if (token) {
108         jwt.verify(token, 'secret',
109             (err, decoded) => {
110                 if (err) {
111                     res.json({ ok: false, error: err });
112                 } else {
113                     let event = events.find(e => e.id == req.params.id);
114                     res.json({
115                       ok: true,
116                     "Estado" : "Usuario creado satisfactoriamente",
117                     "Nombre" : cliente.name,
118                     "Apellido" : cliente.lastname,
119                     "Correo" : cliente.email });
120                 }
121             });
122     } else {
123         res.json({ ok: false, error: 'No token provided.' });
124     }
125 });

app.post('/eventos/comprar/:id/:asiento/:iduser', (req, res) => {
128     var id = req.params.id;
129     var asiento = req.params.asiento;
130     var iduser = req.params.iduser;
131     //INSERTE FIND/FINDONE MONGODB  
132     let token = req.query.token || req.headers['authorization'];
133     if (token) {
134         jwt.verify(token, 'secret',
135             (err, decoded) => {
136                 if (err) {
137                     res.json({
138                       ok: false,
139                       "Estado" : "Usuario creado satisfactoriamente",
140                       "Nombre" : cliente.name,
141                       "Apellido" : cliente.lastname,
142                       "Correo" : cliente.email
143                     });
144                 } else {
145                     let event = events.find(e => e.id == req.params.id);
146                     let asiento = event.asientos.find(a => a.id == req.params.asiento);
147                     if (asiento.iduser == req.params.iduser) {
148                         asiento.iduser = null;
149                         res.json({
150                           ok: true,
151                           "Estado" : "Usuario creado satisfactoriamente",
152                           "Nombre" : cliente.name,
153                           "Apellido" : cliente.lastname,
154                           "Correo" : cliente.email });
155                     } else {
156                         res.json({ ok: false, error: 'El asiento no pertenece al usuario' });
157                     }
158                 }
159               });
160     } else {
161         res.json({ ok: false, error: 'No token provided.' });
162     }
163 });

