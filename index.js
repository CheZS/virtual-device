var express = require('express');
var fs = require('fs');
var path = require('path');
var mqttUtil = require('./mqttUtil');

var app = express();
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
	// res.send('index');
	res.sendFile(path.join(__dirname, 'views/index.html'));
});

app.get('/switch', (req, res) => {
	mqttUtil.switchImage()
	.then(() => {
		res.send('switch');
	})
	.catch(err => {
		res.send(err.toString());
	});
});

app.get('/phone', (req, res) => {
	mqttUtil.phoneImage()
	.then(() => {
		res.send('phone');
	})
	.catch(err => {
		res.send(err.toString());
	});
});

app.get('/rect', (req, res) => {
	mqttUtil.rect()
	.then(() => {
	})
	.catch(err => {
		res.send(err.toString());
	});
	res.send('rect');
});

app.get('/temperature', (req, res) => {
	mqttUtil.temperature()
	.then(() => {
	})
	.catch(err => {
		res.send(err.toString());
	});
	res.send('temperature');
});

app.get('/currentTemperature', (req, res) => {
	var temp = mqttUtil.getTemperature();
	if (!temp) {
		res.send('0');
	} else {
		res.send(temp.toString());
	}
});

app.get('/currentRect', (req, res) => {
	var rect = mqttUtil.getRect();
	if (!rect) {
		res.send('0');
	} else {
		res.send(rect.toString());
	}
});

app.listen(18080, () => {
	console.log('web server listening on port 18080');
});
