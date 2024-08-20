var express = require('express');
var router = express.Router();
const { Event, Member,Message } = require('../models/models');


router.get("/image/:id", async (req, res) => {
  try {
    const eventId = req.params.id;
    const event = await Event.findById(eventId);

    if (!event || !event.image) {
      return res.status(404).send("Image not found");
    }

    res.set("Content-Type", event.image.contentType);
    res.send(event.image.data);
  } catch (error) {
    console.error("Error fetching image:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/memberImage/:id", async (req, res) => {
  try {
    const MemberId = req.params.id;
    const member = await Member.findById(MemberId);

    if (!member || !member.image) {
      return res.status(404).send("Image not found");
    }

    res.set("Content-Type", member.image.contentType);
    res.send(member.image.data);
  } catch (error) {
    console.error("Error fetching image:", error);
    res.status(500).send("Internal Server Error");
  }
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});
router.get('/contactus', function(req, res, next) {
  res.render('contact');
});
router.get('/about', function(req, res, next) {
  res.render('about');
  });
/* GET all events */
router.get('/events', async function(req, res, next) {
  try {
    const events = await Event.find(); // Fetch all events from the database
    res.render('events', { events }); // Pass events data to the events view
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

router.post('/feedback', async function(req, res) {
  try {
    const { name, subject, message } = req.body;
    const newMessage = new Message({ name, subject, message });
    await newMessage.save();
    //res.redirect('/'); // Redirect to home page after saving feedback
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

/* GET all members */
router.get('/members', async function(req, res, next) {
  try {
    const members = await Member.find(); // Fetch all members from the database
    res.render('members', { members }); // Pass members data to the members view
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
