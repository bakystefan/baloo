const path = require('path')
const express = require('express')
const compression = require('compression')
const invariant = require('invariant')

const app = express()
const server = require('http').Server(app);
const io = require('socket.io')(server);

const PORT = process.env.PORT || 8080
const DIST_DIR = path.resolve(__dirname, '..', 'public')

io.on('connection', (socket) => {
  socket.on('message', (data) => {
    console.log('JA SAM DATA', data);
    return "CAO"
  });
  socket.on('my other event', (data) => {
    console.log(data);
  });
});


// require https
app.use((req, res, next) => {
  if (req.hostname !== 'localhost' && req.get('X-Forwarded-Proto') !== 'https') {
    return res.redirect(`https://${req.hostname}${req.url}`)
  }
  return next()
})

// https://github.com/expressjs/compression
app.use(compression())

app.use(express.static(DIST_DIR))

// Create route for static vendors.js file
app.get('/vendor/vendors.js', (req, res) => {
  res.sendFile(`${DIST_DIR}/vendor/vendors.js`)
})

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'public', 'index.html'))
})

app.listen(PORT, (error) => {
  invariant(!error, 'Something failed: ', error)
  console.info('Express is listening on PORT %s.', PORT)
})
