const express = require('express');
const app = express();
const expressWs = require('express-ws')(app);
const path = require('path');
const bodyParser = require('body-parser');
const firebase = require('firebase');
const firebaseConfig = require('./firebase.js').firebaseConfig;

// setup firebase
firebase.initializeApp(firebaseConfig);

// set up references to the firebase DB and specifically the images aspect
let db = firebase.database();
let rooms = db.ref('/rooms');
let images = db.ref('/images');
let players = db.ref('/players');

app.use(express.static(path.join(__dirname + '/../dist/')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = 8888;

app.get('/', (req, res) => {
	res.sendFile(path.join(`${__dirname}/../index.html`));
});

app.post('/image', (req, res) => {
	// add the image to firebase
	images.child('1').set(req.body.image);
});

// setup web sockets for all the various stuff so we can get realtime functionality going

app.ws('/players', (ws, req) => {
	// on open console log for a little sanity check
	ws.on('open', () => {
		console.log('opening player websocket connection');
		ws.isAlive = true;
	})

	// basic firebase implementation here. when firebase tables update they send out a "snapshot", we just shoot that snapshot right along to the websocket
	players.on('value', (snapshot) => {
		ws.send(JSON.stringify(snapshot.val()));
	})

	// another sanity check. not entirely certain at this point what on message potentially does for me in this situation but it's in the docs for express-ws so gonna have it here for shiggles
	ws.on('message', (msg) => {
		console.log(`message from inside the player socket: ${msg}`)
	})

	ws.on('close', () => {
		console.log('closing player websocket connection');

		ws.isAlive = false;

		ws.close();
	})
});

app.post('/players', (req, res) => {
	// make our terms a bit more verbose
	let playerData = req.body;

	// check to see if the room already exists
	rooms.child(playerData.roomCode).once("value", (snapshot) => {
		if (snapshot.exists()) {
			// confirm there is not already a player with the specified player id

			// if not, add the player to the room
		} else {
			// create the room and set the player data on that player
			let player = rooms.child(playerData.roomCode).child('players').child(playerData.playerId);
			player.child("playerName").set(playerData.playerName);
			player.child("playerScore").set(playerData.playerScore);
		}
	})
})

app.listen(PORT, () => {
	console.log(`listening on port ${PORT}`);
});