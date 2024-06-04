const { MongoClient, ObjectId } = require('mongodb');

class MongoDBManager {
    constructor(url, dbName) {
        this.url = url;
        this.dbName = dbName;
        this.client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
    }

    async connect() {
        try {
            await this.client.connect();
            console.log('Connected to MongoDB');
            this.db = this.client.db(this.dbName);
        } catch (err) {
            console.error('Error connecting to MongoDB:', err);
        }
    }

    async disconnect() {
        try {
            await this.client.close();
            console.log('Disconnected from MongoDB');
        } catch (err) {
            console.error('Error disconnecting from MongoDB:', err);
        }
    }

    async create(collectionName, document) {
        try {
            const result = await this.db.collection(collectionName).insertOne(document);
            return result.insertedId;
        } catch (err) {
            console.error('Error creating document:', err);
            return null;
        }
    }

    async retrieve(collectionName, query) {
        try {
            const result = await this.db.collection(collectionName).find(query).toArray();
            return result;
        } catch (err) {
            console.error('Error retrieving documents:', err);
            return [];
        }
    }

    async update(collectionName, filter, update) {
        try {
            const result = await this.db.collection(collectionName).updateMany(filter, { $set: update });
            return result.modifiedCount;
        } catch (err) {
            console.error('Error updating documents:', err);
            return 0;
        }
    }

    async delete(collectionName, filter) {
        try {
            const result = await this.db.collection(collectionName).deleteMany(filter);
            return result.deletedCount;
        } catch (err) {
            console.error('Error deleting documents:', err);
            return 0;
        }
    }

    async fetchListWithProjection(collectionName, projection) {
        try {
            const result = await this.db.collection(collectionName).find({}, { projection }).toArray();
            return result;
        } catch (err) {
            console.error('Error fetching list with projection:', err);
            return [];
        }
    }
}

// Example usage:
// (async () => {
//     const mongoDBManager = new MongoDBManager('mongodb://localhost:27017', 'mydatabase');
//     await mongoDBManager.connect();

//     // Create document
//     const insertedId = await mongoDBManager.create('mycollection', { name: 'John', age: 30 });

//     // Retrieve documents
//     const documents = await mongoDBManager.retrieve('mycollection', { age: { $gte: 25 } });

//     // Update documents
//     const updatedCount = await mongoDBManager.update('mycollection', { _id: insertedId }, { age: 35 });

//     // Delete documents
//     const deletedCount = await mongoDBManager.delete('mycollection', { age: { $lt: 30 } });

//     // Fetch list with projection
//     const projection = { name: 1, age: 1 };
//     const listWithProjection = await mongoDBManager.fetchListWithProjection('mycollection', projection);

//     console.log('Inserted ID:', insertedId);
//     console.log('Retrieved documents:', documents);
//     console.log('Updated count:', updatedCount);
//     console.log('Deleted count:', deletedCount);
//     console.log('List with projection:', listWithProjection);

//     await mongoDBManager.disconnect();
// })();
