const express = require('express');
const app = express();
const path = require('path');

// app.use('/dist/', express.static(path.join(__dirname + '../dist/')));
app.use(express.static(path.join(__dirname + '/../dist/')));

const PORT = 8888;

app.get('/', (req, res) => {
	res.sendFile(path.join(`${__dirname}/../index.html`));
})

app.listen(PORT, () => {
	console.log(`listening on port ${PORT}`);
})