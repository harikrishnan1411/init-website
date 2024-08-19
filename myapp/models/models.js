const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    designation: {
        type: String,
        required: true
    },
    instagramLink: {
        type: String,
    },
    linkedinLink: {
        type: String,
    },
    image: {
        data: Buffer,
        contentType: String
    }
})
const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    fees: {
        type: Number,
        required: true
    },
    coordinators: {
        type: [
            {
                name: {
                    type: String,
                    required: true
                },
                number: {
                    type: String,
                    required: true
                }
            }
        ],
        required: true
    },
    venue: {
        type: String,
        required: true
    },
    image: {
        data: Buffer,
        contentType: String
    },
    completed: {
        type: Boolean,
    }
});

const Event = mongoose.model('Event', eventSchema);
const Member = mongoose.model('Member', memberSchema);

module.exports = {
    Event,
    Member
};