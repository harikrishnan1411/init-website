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
        type: String,
        required: true
    },
    venue: {
        type: String,
        required: true
    },
    image: {
        data: Buffer,
        contentType: String
    }
});

const Event = mongoose.model('Event', eventSchema);
const Member = mongoose.model('Member', memberSchema);

module.exports = {
    Event,
    Member
};