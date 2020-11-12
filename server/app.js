const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const firebase = require('firebase');
const firebaseConfig = require('./firebase.js').firebaseConfig;

firebase.initializeApp(firebaseConfig);

let db = firebase.database();
let images = db.ref('/images');

app.use(express.static(path.join(__dirname + '/../dist/')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = 8888;

app.get('/', (req, res) => {
	res.sendFile(path.join(`${__dirname}/../index.html`));
});

app.post('/image', (req, res) => {
	// console.log(req.body);
	// res.send('got it');

	images.child('1').set(req.body.image);
});

app.listen(PORT, () => {
	console.log(`listening on port ${PORT}`);
});