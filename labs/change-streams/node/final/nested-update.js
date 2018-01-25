const MongoClient = require('mongodb');
const url = require('./config.js').mongoDBUrl;

const update = {
  $set: { 'device.celsiusTemperature': 23 },
  $currentDate: { 'device.timeStamp': true },
};

MongoClient.connect(url, (err, client) => {
  const coll = client.db("demo").collection("devices");
  coll.update({"device.name": "ecobee_1234"}, update, { multi: true}).then(() => client.close());
});