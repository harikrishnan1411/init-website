const express = require('express');
const router = express.Router();
const multer = require('multer');
const { Event, Member } = require('../models/models');


// Use memory storage for multer to keep image in memory
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


router.get('/', (req ,res)=>{
  res.render('admin')
})
// Route to render the admin page
router.get('/addMember', function(req, res, next) {
  res.render('addMember');
});


router.get('/addEvents', function(req, res, next) {
  res.render('addEvent');
});
// Route to retrieve an image by its ID
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

// Route to add a new event
router.post("/addEvent",  upload.single("image"), async (req, res) => {
  const { title, desc, fees, coordinator, venue } = req.body;

  // Ensure req.file is present and contains the image data
  if (!req.file) {
    return res.status(400).send("No image file uploaded");
  }

  const newEvent = new Event({
    title: title,
    description: desc,
    fees: fees,
    coordinators: coordinator,
    venue: venue,
    image: {
      data: req.file.buffer, // Binary data of the image
      contentType: req.file.mimetype, // MIME type of the image
    },
  });

  try {
    await newEvent.save();
    console.log("Event added successfully");
    res.redirect("/admin");
  } catch (error) {
    console.error("Error adding Event:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/addMember",  upload.single("image"), async (req, res) => {
  const { name, designation, instagramLink, linkedinLink } = req.body;

  // Ensure req.file is present and contains the image data
  if (!req.file) {
    return res.status(400).send("No image file uploaded");
  }

  const newMember = new Member({
    name: name,
    designation: designation,
    instagramLink: instagramLink,
    linkedinLink: linkedinLink,
    image: {
      data: req.file.buffer, // Binary data of the image
      contentType: req.file.mimetype, // MIME type of the image
    },
  });

  try {
    await newMember.save();
    console.log("Member added successfully");
    res.redirect("/admin");
  } catch (error) {
    console.error("Error adding Member:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.get('/eventManagement', async (req, res, next) => {   //Render all events
  try {
      const events = await Event.find({});
      res.render('admin-events', { events: events });
  } catch (error) {
      console.error("Error fetching events:", error);
      next(error); // Passes the error to the error handling middleware
  }
});


router.get('/admin/eventManagement/:id/details', async (req, res) => {    //Search functionality
  try {
      const event = await Event.findById(req.params.id);
      if (!event) return res.status(404).send("Event not found");
      res.render('eventDetails', { event }); // Renders the event details page
  } catch (err) {
      console.error(err);
      res.status(500).send("Server Error");
  }
});

module.exports = router;
