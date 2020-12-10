const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { v4: uuidV4 } = require('uuid')
const port=process.env.PORT || 3000;
app.set('view engine', 'ejs')
app.use(express.static('public'))

var mysql = require('mysql');

var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');

var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '',
	database : 'collegedatabase'
});


app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname + '/login.html'));
});

app.post('/auth', function(req, res) {
	var username = req.body.username;
	var password = req.body.password;
	if (username && password) {
		connection.query('SELECT * FROM admin_login WHERE email = ? AND pass = ?', [username, password], function(error, results, fields) {
			if (results.length > 0) {
				 ssn = req.session;
				 req.session.loggedin = true;
				 req.session.username = username;
		         req.session.password = password;
       
        res.redirect('/aa');

		//	res.redirect('/home');
			} else {
				res.send('Incorrect Username and/or Password!');
			}			
			res.end();
		});
	} else {
		res.send('Please enter Username and Password!');
		res.end();
		
	}
});

app.get('/home', function(req, res) {
	if (req.session.loggedin) {
		res.send('Welcome back, ' + req.session.username + '!');
	} else {
		res.send('Please login to view this page!');
	}
	res.end();
});






app.get('/aa', (req, res) => {
	if (req.session.loggedin) {
  res.redirect(`/${uuidV4()}`)
	}
})
app.get('/:room', (req, res) => {
	if (req.session.loggedin) {
		var a=req.session.username;
	res.render('room', { roomId: req.params.room,a:a })
	}
	else{
		res.render('user', { roomId: req.params.room })	
	}
})

  io.on('connection', socket => {
	
    socket.on('join-room', (roomId, userId) => {
      socket.join(roomId)
      socket.to(roomId).broadcast.emit('user-connected', userId)
  
      socket.on('disconnect', () => {
        socket.to(roomId).broadcast.emit('user-disconnected', userId)
      })
	})

  })

server.listen(port,()=>{console.log("server is listening on port ${port}")

})

