# MongoDB 3.6 Developer Workshop (New Features)

This workshop focuses exclusively on some of the new features of MongoDB 3.6 and requires pre-existing knowledge of MongoDB, particularly the Mongo Shell. 

Familiarity with JavaScript and Node.js is also strongly recommended as most code samples will use that programming language.

## Setup requirements

Hopefully, you have brought your own laptop… If not, find a peer whom you can work with!

Make sure the following components are installed on your laptop:

* [MongoDB 3.6](https://www.mongodb.com/download-center#production) latest release version - [installation instructions](https://docs.mongodb.com/manual/installation/)

* [Node.js](https://nodejs.org/en/) latest LTS version

* Make sure you run the latest version of NPM ([instructions](https://docs.npmjs.com/getting-started/installing-node))

* Download or clone the following GitHub repository

If you are using Windows 10, you will have to use the [Windows Subsystem for Linux](https://docs.microsoft.com/en-us/windows/wsl/install-win10) as the provided scripts were built on MacOS (they should work on Linux)

### Change Streams Labs

Change Streams are a new 3.6 feature that allows applications to listen to changes in a MongoDB collection in real time. The feature is built on top of the oplog infrastructure, which is primarily used to handle replication between a primary and secondaries. "Tailing with the oplog" was previously the approach MongoDB recommended to implement such a real-time trigger functionality, but it came with many caveats and was never considered a fully reliable technique.

With Change Streams, you now get a fully supported, reliable, durable and secure way of achieving real-time processing of changes (inserts, updates, deletes, as well as replace and invalidate operations). 

But enough with marketing spins, let’s get started with technical content. We’ll embark into the following journey to discover Change Streams:

* To introduce the feature, start with a simple [Mongo Shell lab](https://github.com/rlondner/mongodb-3.6-workshop/tree/master/labs/change-streams/shell).

* Move on with a more complex and realistic [Node.js lab](https://github.com/rlondner/mongodb-3.6-workshop/tree/master/labs/change-streams/node).

* Find out how to integrate change streams with Kafka in the [Change Streams Kafka producer lab](https://github.com/rlondner/mongodb-3.6-workshop/tree/master/labs/kafka).

### JSON Schema Validation Labs

With MongoDB 3.6, you now can enforce schemas on specific collections using the [JSON Schema](http://json-schema.org/) draft IETF specification (note: MongoDB 3.6 currently supports a subset of the JSON Schema [draft 5](https://tools.ietf.org/html/draft-wright-json-schema-validation-00) spec).

To know more about the technical features of MongoDB’s JSON Schema Validation support:

* Take the hands-on labs available [here](https://github.com/rlondner/mongodb-3.6-workshop/tree/master/labs/json-schema-validation).

* Discover how to use JSON Schema with the Expressive Query Syntax [here](https://www.mongodb.com/blog/post/mongodb-36-json-schema-validation-expressive-query-syntax) and replicate the examples mentioned there.

### Granular Array Updates Lab

* The granular array updates lab is available [here](https://github.com/rlondner/mongodb-3.6-workshop/tree/master/labs/array-updates).