/ https://www.npmjs.com/package/uuid-token-generator
// usuario: { _id: 1, email: 'avance@mail.com', name: 'seba', pass: 'contra' }
// evento: ({_id: '1', name: 'Backyardigans', dia: 30, hora: '13:00', link: 'https://imagenes.atresplayer.com/atp/clipping/cmsimages02/2021/03/10/D2269CAE-4705-4D3A-BC8D-0E66AD9A53B3/1280x720.jpg'})
// ultimo punto: id (evento): '1', asiento: '1', iduser: 1
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
const disponibles = database.collection('disponibles');


const TokenGenerator = require('uuid-token-generator');
const tokgen = new TokenGenerator(256, TokenGenerator.BASE62);
var secret = tokgen.generate();
const jwt = require('jsonwebtoken');
var token = '';
var ObjectId = require('mongodb').ObjectId;


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
    const query = { _id: parseInt(req.params.id) };
    const user = await users.findOne(query);
        console.log(user);
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
                        user: user
                    });
                }
            });
    } else {
        res.json({ ok: false, error: 'No token provided.' });
    }
});

app.get('/eventos', async (req, res) => {
  const peliculas = await cuadricula.find({});
        console.log(peliculas);
    let token = req.query.token || req.headers['authorization'];
    if (token) {
        jwt.verify(token, secret,
            (err, decoded) => {
                if (err) {
                    res.json({ ok: false, error: err });
                } else {
                    res.json({
                      ok: 'token valido',
                      peliculas: peliculas
                    });
                }
            });
    } else {
        res.json({ ok: false, error: 'Token no valido.' });
    }
});

app.get('/eventos/:id', async (req, res) => {
    const query = { _id: req.params.id };
    const evento = await cuadricula.findOne(query);
        console.log(query);
        console.log(evento);
    let token = req.query.token || req.headers['authorization'];
    if (token) {
        jwt.verify(token, secret,
            (err, decoded) => {
                if (err) {
                    res.json({ ok: false, error: err });
                } else {
                    res.json({
                      ok: true,
                      evento: evento
                    });
                }
            });
    } else {
        res.json({ ok: false, error: 'No token provided.' });
    }
});

app.post('/eventos/comprar/:id/:asiento/:iduser', async (req, res) => {
    const id_evento ={ _id: req.params.id };
    const id_asiento ={ seat: req.params.asiento };
    const id_user = {_id: req.params.iduser };

    const usuario = await users.findOne(id_user);
    const evento = await cuadricula.findOne(id_evento);
    const asiento = await disponibles.findOne(id_asiento);

    let token = req.query.token || req.headers['authorization'];
    if (token) {
        jwt.verify(token, secret,
            (err, decoded) => {
                if (err) {
                    res.json({
                      ok: false,
                    });
                } else {
                        res.json({
                          ok: true,
                          usuario: usuario,
                          'asiento': req.params.asiento
                        });

                }
              });
    } else {
        res.json({ ok: false, error: 'Token No valido' });
    }
});

app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
});
