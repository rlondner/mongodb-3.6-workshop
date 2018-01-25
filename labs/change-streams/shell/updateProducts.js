cnxString = "mongodb://localhost:27017/demo?replicaSet=rs";
conn = new Mongo(cnxString);
db = conn.getDB("demo");
collection = db.stock;
let updatedQuantity = 1;

function sleepFor(sleepDuration) {
  var now = new Date().getTime();
  while (new Date().getTime() < now + sleepDuration) {
    /* do nothing */
  }
}

function update() {
  sleepFor(1000);
  //bulk update of all the products with a quantity greater than 10 to a value lower than 10
  res = collection.update({quantity:{$gt:10}}, {$inc: {quantity: -Math.floor(Math.random() * 10)}}, {multi: true});
  print(res)
  updatedQuantity = res.nMatched + res.nModified;
}

while (updatedQuantity > 0) {
  update();
}
