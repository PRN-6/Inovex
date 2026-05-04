const mongoose = require('mongoose');

const generateParticipantId = async () => {
    const User = mongoose.model('User');
    const prefix = 'INVX-26';
    // We use a find sorted by participantId to get the latest numeric suffix
    const lastUser = await User.findOne({ participantId: new RegExp(`^${prefix}`) })
                               .sort({ participantId: -1 });
    
    let nextNumber = 1;
    if (lastUser && lastUser.participantId) {
        const lastSuffix = lastUser.participantId.replace(prefix, '');
        if (!isNaN(parseInt(lastSuffix))) {
            nextNumber = parseInt(lastSuffix) + 1;
        }
    }

    let suffix = nextNumber.toString().padStart(4, '0');
    let participantId = `${prefix}${suffix}`;
    
    // Check for collision
    let exists = await User.findOne({ participantId });
    while (exists) {
        nextNumber++;
        suffix = nextNumber.toString().padStart(4, '0');
        participantId = `${prefix}${suffix}`;
        exists = await User.findOne({ participantId });
    }
    
    return participantId;
};

module.exports = { generateParticipantId };
