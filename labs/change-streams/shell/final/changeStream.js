conn = new Mongo("mongodb://localhost:27017/demo?replicaSet=rs");
db = conn.getDB("demo");
collection = db.stock;

const insertOps = {
  $match: { operationType: "insert" }
};

let updateOps = {
  $match: {
    $and: [
      { "updateDescription.updatedFields.quantity": { $lte: 10 } },
      { operationType: "update" }
    ]
  }
};

const changeStreamCursor = collection.watch([
  csFilter === 0 ? insertOps : updateOps
]);

//pollStream(changeStreamCursor);
resumeStream(changeStreamCursor, true);

//this function polls a change stream and prints out each change as it comes in
function pollStream(cursor) {
  while (!cursor.isExhausted()) {
    if (cursor.hasNext()) {
      change = cursor.next();
      print(JSON.stringify(change, null, 2));
    }
  }
  pollStream(cursor);
}

//this function is similar to the pollStream above. The only difference is that it prints out the first change right away, then simulates an app crash (for 10 seconds) and finally resumes processing the remaining changes by picking the change stream where it was left off (by using the resumeAfter option of the watch method)
function resumeStream(cursor, forceResume = false) {
  let resumeToken;
  while (!cursor.isExhausted()) {
    if (cursor.hasNext()) {
      change = cursor.next();
      print(JSON.stringify(change, null, 2));
      resumeToken = change._id;
      if (forceResume === true) {
        print("\r\nSimulating app failure for 10 seconds...");
        sleepFor(10000);
        cursor.close();
        const newChangeStreamCursor = collection.watch(
          [csFilter === 0 ? insertOps : updateOps],
          {
            resumeAfter: resumeToken
          }
        );
        print(
          "\r\nResuming change stream with token " +
            JSON.stringify(resumeToken, null, 2) +
            "\r\n"
        );
        resumeStream(newChangeStreamCursor);
      }
    }
  }
  resumeStream(cursor, forceResume);
}

function sleepFor(sleepDuration) {
  var now = new Date().getTime();
  while (new Date().getTime() < now + sleepDuration) {
    /* do nothing */
  }
}