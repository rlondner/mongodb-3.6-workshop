# MongoDB Change Streams - Mongo Shell Lab

## Replica set setup

MongoDB Change Streams require a replica set to work (i.e. they don't work with a standalone MongoDB server). Here are the instructions to start your local, single-node MongoDB 3.6 replica set:

1. Make sure [MongoDB 3.6+](https://www.mongodb.com/download-center#production) is installed and your machine and the MongoDB installation folder (containing tools such as `mongo` and `mongod`) is added to your local path.
1. From a Terminal/Bash console, navigate to the `shell` directory using `cd labs/change-streams/shell`.
1. Run `sh startRS.sh` to start a test, single-node replica set (in the `/data/rs1/db` sub-folder).
1. If you've started your replica set for the first time, run `sh initiateRS.sh` (in a separate bash console) to initialize your replica set.
1. Explore the `createProducts.js` script and uncomment line 22 to make sure the quantity for each inserted product is greater or equal than 11.
1. Run `mongo createProducts.js` to create products (one every second) in the `stock` collection of the `demo` database in your replica set. All of the documents created with that script should have a `quantity` attribute greater or equal than 11 (you can use [MongoDB Compass](https://www.mongodb.com/download-center#compass) to check the inserted data).
1. Edit `changeStream.js` and replace

    __//INSERT pollStream() FUNCTION HERE__

    with the following method:

    ```javascript
    function pollStream(cursor) {
        while (!cursor.isExhausted()) {
            if (cursor.hasNext()) {
            change = cursor.next();
            //this is where you should insert your change stream processing logic - in this demo example, we're simply printing the change stream JSON document to the console
            print(JSON.stringify(change, null, 2));
            }
        }
        pollStream(cursor);
        }
    ```

    Take a moment to review the code above to understand how change stream cursors are filtered (with the `$match` filter specified in `insertOps`) and iterated through.

    Note also the new `cursor.isExhausted()` method in MongoDB 3.6 and check out the corresponding [documentation page](https://docs.mongodb.com/manual/reference/method/cursor.isExhausted/) for more information.
1. In a separate Terminal console, start `sh insertChangeStream.sh` to monitor inserts of the products into your database.
1. Stop the `insertChangeStream.sh` script and open the `changeStream.js` file.
1. We will now test the resumability feature of MongoDB Change Streams (i.e. the ability to resume listening to a change stream right after a specific token). To do so, replace

    __//INSERT resumeStream() FUNCTION HERE__

    with the following method:

    ```javascript
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
    ```
1. Comment out the call to `pollStream(...)` (line 22) and uncomment the call to `resumeStream(...)` (line 23.
1. Run `mongo createProducts.js` again and `sh insertChangeStream.sh` in 2 different bash consoles.
1. Note that the script logs the first change it captures, simulates an app failure for 10 seconds and then catches up the inserts it missed (using the `resumeAfter` option).
1. Stop the `insertChangeStream.sh` script and the `mongo createProducts.js` process.
1. Set the `updateOps` variable to the following value:

    ```json
    {
    $match: {
        $and: [
            { "updateDescription.updatedFields.quantity": { $lte: 10 } },
            { operationType: "update" }
            ]
        }
    }
    ```
    Note that the filter is performed on the `updateDescription.updatedFields.quantity` field. The `updateDescription.updatedFields` sub-document is only only available for `update` operations.
1. Run `sh updateChangeStream.sh` in a Terminal console to monitor the `quantity` property updates in documents of the `stock` collection. Specifically, this change stream only processes document updates when the `quantity` attributes is set to a value lower or equal than 10.
1. Run `mongo updateProducts.js` to trigger `quantity` updates below 10 and watch changes being logged in the `sh updateChangeStream.sh` window.

## Change Streams Challenge

If you correctly complete this (optional) challenge, you'll be eligible to a grand prize drawing (hint: the prize is a flying machine).

1. Connect to your local replica set using [MongoDB Compass](https://www.mongodb.com/download-center#compass)
1. In the `stock` collection, update the `quantity` attribute of a document to a value lower than 10.
1. To your great surprise, the update change stream script you launched doesn't report this update. Why? It's because Compass "updates" really are `replace` operations, so the filter we've set in `updateOps` doesn't work.
1. The quiz question is thus the following: __How should you update the `updateOps` variable so that the change stream would process *both*  `update` and `replace` operations on the `quantity` attribute being lower than 10?__
1. If you've found it, call a proctor to get your response validated with her.
1. Once you are done, don't forget to shut down your mongo processes and your MongoDB 3.6 replica set.