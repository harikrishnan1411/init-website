var express = require('express');
var router = express.Router();
const { Event, Member, Message, Gallery } = require('../models/models');


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
router.get('/', function (req, res, next) {
  res.render('index', { title: 'init() IT Association' });
});

router.get('/contactus', function (req, res, next) {
  res.render('contact', { title: 'init() IT Association' });
});

router.get('/about', function (req, res, next) {
  res.render('about', { title: 'init() IT Association' });
});

/* GET all events */
router.get('/events', async function (req, res, next) {
  try {
    const events = await Event.find(); // Fetch all events from the database
    res.render('events', { title: 'init() IT Association', events }); // Pass title and events data
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

router.get('/events/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    res.render('eventDetails', { title: 'init() IT Association', event }); // Use event name as title
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

/* GET all members */
router.get('/members', async function (req, res, next) {
  try {
    const members = await Member.find(); // Fetch all members from the database
    res.render('members', { title: 'init() IT Association', members }); // Pass title and members data
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

router.get('/gallery', async function (req, res, next) {
  try {
    const galleryImages = await Gallery.find(); // Fetch all events from the database
    res.render('gallery', { title: 'init() IT Association', galleryImages }); // Pass title and events data
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});


router.post('/sendMessage', async function (req, res) {
  try {
    const { email, subject, message } = req.body;
    const date = new Date();

    const newMessage = new Message({
      email,
      subject,
      message,
      date
    });
    await newMessage.save();
    res.redirect('/contactus')
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});




module.exports = router;
