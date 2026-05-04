require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const { generateParticipantId } = require('../utils/idGenerator');

const migrate = async () => {
    try {
        const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/inovex';
        console.log('🔗 Connecting to Database...');
        await mongoose.connect(mongoURI);
        console.log('✅ Connected.');

        const users = await User.find({ participantId: { $exists: false } });
        console.log(`🔍 Found ${users.length} users without Participant ID.`);

        if (users.length === 0) {
            console.log('✨ All users already have IDs. Nothing to do.');
            process.exit(0);
        }

        for (let i = 0; i < users.length; i++) {
            const user = users[i];
            const newId = await generateParticipantId();
            user.participantId = newId;
            await user.save();
            console.log(`[${i + 1}/${users.length}] Assigned ${newId} to ${user.name} (${user.usn})`);
        }

        console.log('🏁 Migration complete.');
        process.exit(0);
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
};

migrate();
