const { MongoClient } = require('mongodb');

const uri = "mongodb://joe:doe@localhost:27017/masterclass_project";
const client = new MongoClient(uri, { useUnifiedTopology: true });
const ObjectId = require('mongodb').ObjectID;

async function main() {
    try {
        // Connect to the MongoDB cluster
        await client.connect();
    } catch (e) {
        console.error(e);
    }
}

async function getRestaurantById(restaurant_id) {
    result = await client.db("masterclass_project").collection("restaurants")
        .findOne({ _id: ObjectId(restaurant_id) });

    if (result) {
        return result;
    } else {
        return 'Not finding data...';
    }
}

async function createRestaurant(body) {
    result = await client.db("masterclass_project").collection("restaurants")
        .insertOne(
            { name: body.name, long_coordinates: body.long_coordinates, lat_coordinates: body.lat_coordinates }
        );

    if (result) {
        return `Insert new restaurant #${result.insertedId}`;
    } else {
        return 'Error...';
    }
}

async function updateRestaurant(restaurant_id, body) {
    result = await client.db("masterclass_project").collection("restaurants")
        .updateOne(
            { _id: ObjectId(restaurant_id) },
            { $set: { name: body.name, long_coordinates: body.long_coordinates, lat_coordinates: body.lat_coordinates } }
        );

    if (result) {
        return `Edited restaurant #${restaurant_id}`;
    } else {
        return 'Error...';
    }
}

async function deleteRestaurant(restaurant_id) {
    result = await client.db("masterclass_project").collection("restaurants")
        .deleteOne({ _id: ObjectId(restaurant_id) });

    if (result) {
        return `Deleted restaurant #${restaurant_id} successful.`;
    } else {
        return 'Error...';
    }
}

async function findRestaurantsWithLocation(long_coordinates, lat_coordinates, max_distance) {
    await client.db("masterclass_project").collection("restaurants").createIndex({ "location": "2dsphere" });

    result = await client.db("masterclass_project").collection("restaurants")
        .find({
            location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [parseFloat(long_coordinates), parseFloat(lat_coordinates)]
                    },
                    $maxDistance: parseInt(max_distance ? max_distance : 5000),
                    $minDistance: 0
                }
            }
        }).toArray();

    if (result) {
        return result;
    } else {
        return 'Error...';
    }
}

async function getAveragePrice() {
    result = await client.db("masterclass_project").collection("restaurants")
        .aggregate(
            [{ $group: { _id: null, avg_price: { $avg: "$price" } } }]
        ).toArray();

    if (result) {
        return `Average price for all the restaurants is ${result[0].avg_price}`;
    } else {
        return 'Error...';
    }
}

async function getAverageRating() {
    result = await client.db("masterclass_project").collection("restaurants")
        .aggregate(
            [{ $project: { _id: "$_id", name: "$name", avg_stars: { $avg: "$reviews" } } }]
        ).toArray();

    if (result) {
        return result;
    } else {
        return 'Error...';
    }
}

main().catch(console.error);

module.exports = { getRestaurantById, createRestaurant, updateRestaurant, deleteRestaurant, getAveragePrice, getAverageRating, findRestaurantsWithLocation };