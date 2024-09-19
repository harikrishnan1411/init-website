const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  designation: {
    type: String,
    required: true,
  },
  instagramLink: {
    type: String,
  },
  linkedinLink: {
    type: String,
  },
  image: {
    data: Buffer,
    contentType: String,
  },
  active: {
    type: Boolean,
    default: true,
    required: true,
  },
});

const messageSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
});
const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  tagline: {
    type: String,
  },
  description: {
    type: String,
    required: true,
  },
  fees: {
    type: Number,
    required: true,
  },
  coordinators: {
    type: [
      {
        name: {
          type: String,
          required: true,
        },
        number: {
          type: String,
          required: true,
        },
      },
    ],
    required: true,
  },
  venue: {
    type: String,
    required: true,
  },
  image: {
    data: Buffer,
    contentType: String,
  },
  completed: {
    type: Boolean,
    default: false,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  formLink: {
    type: String,
  },
});

const adminSchema = new mongoose.Schema({
  adminEmail: { type: String, required: true },
  password: { type: String, required: true },
  otp: { type: String },
});

const Admin = mongoose.model("Admin", adminSchema);
const Event = mongoose.model("Event", eventSchema);
const Member = mongoose.model("Member", memberSchema);
const Message = mongoose.model("Message", messageSchema);

module.exports = {
  Event,
  Member,
  Message,
  Admin
};
