# Granular Array Updates Lab

Many thanks to [@code_barbarian](http://www.twitter.com/code_barbarian) for giving us permission to re-use most of his [original blog post content](http://thecodebarbarian.com/a-nodejs-perspective-on-mongodb-36-array-filters.html) on this subject.

1. Install MongoDB 3.6 as specified in [Pre-requisites section](./../README.md).
1. In the Terminal/Command Prompt window running `mongo`, enter the following command:

   ```javascript
       use demo
       db.BlogPost.insertOne({
        _id: NumberInt(1),
        title: 'A Node.js Perspective on MongoDB 3.6: Array Filters',
        comments: [
            { author: 'Foo', text: 'This is awesome!' },
            { author: 'Bar', text: 'Where are the upgrade docs?' }
        ]
        });

        db.BlogPost.insertOne({
        _id: NumberInt(2),
        title: 'What\'s New in Mongoose 5: Improved Connections',
        comments: [
            { author: 'Bar', text: 'Thanks!' },
            { author: 'Bar', text: 'Sorry for double post' }
        ]
        });
   ```

   This creates a `BlogPost` collection with 2 documents, each containing 2 items stored in a `comments` array.

1. You realize that one of the comment's author name, `Bar` was spelled incorrectly and you would like to update it to `Baz` using one single update query. Prior to MongoDB 3.6, you would have to use the following query:

   ```javascript
    db.BlogPost.updateMany({ 'comments.author': 'Bar' }, {
    $set: { 'comments.$.author': 'Baz' }
    });
   ```

1. Let's now check out the results of our update operation above:

   ```javascript
    db.BlogPost.find().pretty()
   ```

   which should print out the following:

   ```json
    {
        "_id" : 1
        "title" : "A Node.js Perspective on MongoDB 3.6: Array Filters",
        "comments" : [
            {
                "author" : "Foo",
                "text" : "This is awesome!"
            },
            {
                "author" : "Baz",
                "text" : "Where are the upgrade docs?"
            }
        ]
    }
    {
        "_id" : 2,
        "title" : "What's New in Mongoose 5: Improved Connections",
        "comments" : [
            {
                "author" : "Baz",
                "text" : "Thanks!"
            },
            {
                "author" : "Bar", // <-- Not updated!
                "text" : "Sorry for double post"
            }
        ]
    }
   ```

   As you can notice, the second comment of the second blog post document has not been updated. This is because the `$` operator (also called the __*positional operator*__) acts as a placeholder for the first index in the array that matches the query. In other words, with `$` you can only update at most one element in an array.

1. With [array filters](https://docs.mongodb.com/manual/reference/operator/update/positional-all/), a new feature of MongoDB 3.6, we can update array items at once, regardless of their position in the array. Let's first reset our `BlogPost` collection:

    ```javascript
    db.BlogPost.drop()
    db.BlogPost.insertOne({
        _id: NumberInt(1),
        title: 'A Node.js Perspective on MongoDB 3.6: Array Filters',
        comments: [
            { author: 'Foo', text: 'This is awesome!' },
            { author: 'Bar', text: 'Where are the upgrade docs?' }
        ]
        });

        db.BlogPost.insertOne({
        _id: NumberInt(2),
        title: 'What\'s New in Mongoose 5: Improved Connections',
        comments: [
            { author: 'Bar', text: 'Thanks!' },
            { author: 'Bar', text: 'Sorry for double post' }
        ]
        });
    ```
1. Next, lets' replace `$` (the *positional* operator) with `$[]` (the [__*all positional*__](https://docs.mongodb.com/manual/reference/operator/update/positional-all/) operator) in the `updateMany()` command:

    ```javascript
    db.BlogPost.updateMany({ 'comments.author': 'Bar' }, 
        {$set: { 'comments.$[].author': 'Baz' }
    });
    ```

    Now if you check the results of this last query with `db.BlogPost.find().pretty()`, you should find out that all the comments were correctly updated:

   ```json
    {
        "_id" : 1
        "title" : "A Node.js Perspective on MongoDB 3.6: Array Filters",
        "comments" : [
            {
                "author" : "Baz", // <-- Also updated. To work around this, you need array filters
                "text" : "This is awesome!"
            },
            {
                "author" : "Baz",
                "text" : "Where are the upgrade docs?"
            }
        ]
    }
    {
        "_id" : 2,
        "title" : "What's New in Mongoose 5: Improved Connections",
        "comments" : [
            {
                "author" : "Baz",
                "text" : "Thanks!"
            },
            {
                "author" : "Baz", // <--  Correctly updated!
                "text" : "Sorry for double post"
            }
        ]
    }
   ```
    The `$[]` operator is a placeholder for every element in the array, so the above query will update every single comment in any document which has at least one comment by 'Bar'. This is close to the right answer, but not quite, because this query also updated the one comment by 'Foo'. You wi ll need to use array filters to solve this issue.

1. Let's first reset our `BlogPost` collection again:

    ```javascript
    db.BlogPost.drop()
    db.BlogPost.insertOne({
        _id: NumberInt(1),
        title: 'A Node.js Perspective on MongoDB 3.6: Array Filters',
        comments: [
            { author: 'Foo', text: 'This is awesome!' },
            { author: 'Bar', text: 'Where are the upgrade docs?' }
        ]
        });

        db.BlogPost.insertOne({
        _id: NumberInt(2),
        title: 'What\'s New in Mongoose 5: Improved Connections',
        comments: [
            { author: 'Bar', text: 'Thanks!' },
            { author: 'Bar', text: 'Sorry for double post' }
        ]
        });
    ```

1. Next, let's run the following query:

    ```javascript
    db.BlogPost.updateMany({},
        { $set: { 'comments.$[element].author': 'Baz' } }, // `$[element]` is tied to name element below
        { arrayFilters: [{ 'element.author': 'Bar' }]
    });
    ```

    In the above `updateMany()` call, the name `element` is a placeholder for every index in the array that matches the filter `{ 'element.author': 'Bar' }`. There is a key difference between this example and the all positional operator example: the filtered positional operator example cannot use multi-key indexes, so the above query will always result in a full collection scan.
