var fs = require('fs');
var mqtt = require('mqtt');
var BROKER = 'mqtt://192.168.0.25:1883';
var channelName = {
    temperature: 'temperature',
    rect: 'rect',
    switchImage: 'switchImage',
    phoneImage: 'phoneImage'
};

var currentTemperature;
var currentRect;

function run(handler, channel, resolve, reject) {
    var client = mqtt.connect(BROKER);
    // if (!channel) channel = 'newPresence';
    client.on('connect', () => {
        client.subscribe(channel);
        try {
            handler(client, resolve);
        } catch (err) {
            reject(err);
        }
    });
}

function temperature() {
    return new Promise((resolve, reject) => {
        var max = 60;
        var count = 0;
        var add = function() {
            count++;
            return count == max;
        };
        var handler = function(client, resolve) {
            for (var i = 0; i < max; i++) {
                setTimeout(() => {
                    var randomValue = Math.random() * 2 - 1;
                    var temp = 15 + randomValue;
                    currentTemperature = temp;
                    client.publish(channelName.temperature, temp.toString(), () => {
                        if (add() === true) {
                            client.end();
                            resolve();
                        }
                    });
                }, 1000 * (i + 1));
            }
        };
        run(handler, channelName.temperature, resolve, reject);
    });
}
function getTemperature() {
  return currentTemperature;
}

function rect() {
    return new Promise((resolve, reject) => {
        var handler = function(client, resolve) {
            var queue = [];
            var len = 60;
            for (var i = 0; i < len; i++) {
                if (i % 10 >= 5) {
                    var value = 100 + Math.random() * 2 - 1;
                } else {
                    var value = Math.random() * 2 - 1;
                }
                queue.push(value);
            }
            var index = 0;
            function helper() {
                if (index >= len || !queue[index]) {
                    client.end();
                    resolve();
                    return;
                }
                var value = queue[index];
                currentRect = value;
                client.publish(channelName.rect, value.toString(), () => {
                    index++;
                    setTimeout(helper, 1000);
                });
            }
            helper();
        };
        run(handler, channelName.rect, resolve, reject);
    });
}
function getRect() {
  return currentRect;
}

function switchImage() {
    return new Promise((resolve, reject) => {
        var handler = function(client, resolve) {
            var start = new Date().getTime();
            fs.readFile('./images/switch.jpg', (err, data) => {
                client.publish(channelName.switchImage, data, () => {
                    var end = new Date().getTime();
                    console.log(end - start);
                    // client.publish('newPresence', 'byebye', () => { client.end(); });
                    client.end();
                    resolve();
                });
            });
        };
        run(handler, channelName.switchImage, resolve, reject);
    });
}

function phoneImage() {
    return new Promise((resolve, reject) => {
        var handler = function(client, resolve) {
            var start = new Date().getTime();
            fs.readFile('./images/phone.jpg', (err, data) => {
                client.publish(channelName.phoneImage, data, () => {
                    var end = new Date().getTime();
                    console.log(end - start);
                    // client.publish('newPresence', 'byebye', () => { client.end(); });
                    client.end();
                    resolve();
                });
            });
        };
        run(handler, channelName.phoneImage, resolve, reject);
    });
}



exports.switchImage = switchImage;
exports.phoneImage = phoneImage;
exports.rect = rect;
exports.temperature = temperature;
exports.getTemperature = getTemperature;
exports.getRect = getRect;
