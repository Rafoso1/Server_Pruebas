function generateAccessToken(username) {
  return jwt.sign(username, process.env.TOKEN_SECRET, { expiresIn: '1800s' });
}

  app.post('/api/createNewUser', (req, res) => {
  // ...

  const token = generateAccessToken({ username: req.body.username });
  res.json(token);

  // ...
});

//--------
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.TOKEN_SECRET as string, (err: any, user: any) => {
    console.log(err)

    if (err) return res.sendStatus(403)

    req.user = user

    next()
  })
}
app.get('/api/userOrders', authenticateToken, (req, res) => {
  // executes after authenticateToken
  // ...
})

//-------------

// get token from fetch request
const token = await res.json();

// set token in cookie
document.cookie = `token=${token}`
