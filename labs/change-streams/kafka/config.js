"use strict";

var Config  = {
    listenPort: 3000,
    connectionString: "mongodb://localhost:27017/market?replicaSet=rs",
    collectionName: "prices",
    dbName: "market",
    kafka: {
        topic: 'market-data',
        host: 'localhost:9092',
        groupPrefix: 'kafka-node-'
    }
}

module.exports = Config;
