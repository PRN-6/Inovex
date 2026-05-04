require('dotenv').config();
const mongoose = require('mongoose');

const dropIndexes = async () => {
    try {
        const mongoURI = process.env.MONGO_URI;
        if (!mongoURI) {
            console.error('MONGO_URI missing from .env');
            process.exit(1);
        }

        console.log('🔗 Connecting to Database...');
        await mongoose.connect(mongoURI);
        console.log('✅ Connected.');

        const db = mongoose.connection.db;
        const collection = db.collection('users');

        console.log('🗑️ Dropping all unique indexes except _id...');
        
        // List existing indexes
        const indexes = await collection.indexes();
        console.log('Current indexes:', indexes.map(i => i.name));

        // Drop unique indexes that might be causing issues
        for (const index of indexes) {
            if (index.name !== '_id_' && (index.unique || index.name.includes('email') || index.name.includes('usn'))) {
                console.log(`Dropping index: ${index.name}`);
                await collection.dropIndex(index.name);
            }
        }

        console.log('✨ Indexes cleaned up successfully.');
        process.exit(0);
    } catch (error) {
        console.error('❌ Cleanup failed:', error);
        process.exit(1);
    }
};

dropIndexes();
