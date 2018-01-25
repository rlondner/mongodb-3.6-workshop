# MongoDB Change Streams - Node.js Lab

## Replica set setup

1. From a Terminal/Bash console, navigate to the `node` directory using `cd labs/change-streams/node`.
1. Run `sh startRS.sh` to start a test, single-node replica set (in the `/data/rs1/db` sub-folder).
1. If you've started your replica set for the first time, run `sh initiateRS.sh` (in a separate bash console) to initialize your replica set.

## Node.js application - Lab 1

1. Run `npm install` to install the required Node dependencies
1. Run `node produce.js` to create the _demo_ database, the _devices_ collection and a first document.
1. Run `node listen.js` to start listening to change streams coming from the _devices_ collection of the _demo_ database.
1. In a separate Terminal window, run `node produce.js` again - this will add a document to the `devices` collection of the `demo` database.
1. Look at the window running `listen.js` and if everything was properly configured you should get a *polling change stream...* log message, followed by a *waiting for change stream...* message.
1. Now stop the `listen.js` process. The goal of shutting down this process manually is to simulate a random application failure and the ability to resume processing MongoDB Change Streams from the exact time the application failed.
1. Add a few documents by running `node produce.js` several times.
1. Start `node listen.js` again and notice that the previous documents you just added get processed right away.

## Lab 1 Questions

1. Which technique does the `listen.js` Node process use to avoid missing a change stream document in case of a failure?
1. How does the `listen.js` process capture both inserts and updates with one single filter?

    Note that this type of filter is unreliable for updates because the `fullDocument` sub-document pulls up the full document at the time the change stream cursor is queried for, not at the time the actual update is performed. This can result in the inconsistencies since the `fullDocument` property (for the `update` operations only) may not reflect the structure of the updated document __at the time of the the update__.
1. How should you update the `matchStage` variable if you didn't want to use the `fullDocument:'updateLookup'` option in the `watch()` method? (since that technique can produce unreliable results)

## Node.js application - Lab 2

Up until now, our change streams only monitored events occurring on JSON document having a *flat* structure (i.e. key/value pairs at the root level). This lab explores the effects of running change streams on nested properties.

1. In `produce.js`, uncomment `{ device: {` on line 7 and `}` on line 11.
1. Q: How should `update.js` be updated accordingly?
1. Q: How should `listen.js` be updated to process the updates on nested properties (without using the `fullDocument:'updateLookup'` option, as above)?