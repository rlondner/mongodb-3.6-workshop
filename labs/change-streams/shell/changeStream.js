conn = new Mongo("mongodb://localhost:27017/demo?replicaSet=rs");
db = conn.getDB("demo");
collection = db.stock;

const insertOps = {
  $match: { operationType: "insert" }
};

const updateOps;

const changeStreamCursor = collection.watch([
  csFilter === 0 ? insertOps : updateOps
]);

pollStream(changeStreamCursor);
//resumeStream(changeStreamCursor, true);

//INSERT pollStream() FUNCTION HERE

//INSERT resumeStream() FUNCTION HERE

function sleepFor(sleepDuration) {
  var now = new Date().getTime();
  while (new Date().getTime() < now + sleepDuration) {
    /* do nothing */
  }
}
