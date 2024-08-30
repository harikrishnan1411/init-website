const express = require("express");
const router = express.Router();
const multer = require("multer");
const { Event, Member, Message, Admin } = require("../models/models");
const { render } = require("../app");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authenticateToken = require('../middleware/jwtMiddleware');
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;


// Use memory storage for multer to keep image in memory
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/login", (req,res)=>{
  res.render("admin-login");
})

router.post('/login', async (req, res) => {
  const { adminEmail, password } = req.body;
  
  try {
    const admin = await Admin.findOne({ adminEmail });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid adminEmail or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid adminEmail or password' });
    }

    // Check if we get here before JWT generation
    console.log("Login successful, generating token...");

    const token = jwt.sign({ id: admin._id, adminEmail: admin.adminEmail }, 'zxcvbnm', { expiresIn: '1h' });

    res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    console.log('Token:', token);



    res.redirect('/admin');
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/admin/login')
}
);

router.post('/register', async (req, res) => {
  const { adminEmail, password } = req.body;

  // Input validation
  if (!adminEmail || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ adminEmail });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new admin
    const newAdmin = new Admin({
      adminEmail,
      password: hashedPassword
    });

    // Save the admin to the database
    await newAdmin.save();

    res.status(201).json({ message: 'Admin registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get("/",authenticateToken, (req, res) => {
  res.render("admin");
});
// Route to render the admin page
router.get("/addMember",authenticateToken, function (req, res, next) {
  res.render("addMember");
});

router.get('/memberManagement',authenticateToken, async (req,res,next) => {
  const members = await Member.find({});
  res.render('admin-members', { members: members });
})


router.get("/addEvents",authenticateToken, function (req, res, next) {
  res.render("addEvent");
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


router.get('/addEvents',authenticateToken, function(req, res, next) {
  res.render('addEvent');
});
// Route to add a new event
router.post("/addEvent",authenticateToken, upload.single("image"), async (req, res) => {

  const { title, description, fees, coordinators, venue, date,formLink } = req.body;

  // Ensure req.file is present and contains the image data
  if (!req.file) {
    return res.status(400).send("No image file uploaded");
  }

  const newEvent = new Event({
    title: title,
    description: description,
    fees: fees,
    coordinators: Array.isArray(coordinators)
      ? coordinators.map(coordinator => ({
          name: coordinator.name,
          number: coordinator.number
        }))
      : [{ name: coordinators.name, number: coordinators.number }],
    venue: venue,
    formLink: formLink,
    image: {
      data: req.file.buffer, // Binary data of the image
      contentType: req.file.mimetype, // MIME type of the image
    },
    date: date,
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


router.post("/addMember",authenticateToken, upload.single("image"), async (req, res) => {
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
    res.redirect("/admin/eventManagement");
  } catch (error) {
    console.error("Error adding Member:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Route to delete a member by its Id
router.get("/deleteMember/:id",authenticateToken, async (req, res) => {
  const memberId = req.params.id;

  try {
    const member = await Member.findByIdAndDelete(memberId);


    console.log("Member deleted successfully");
    res.redirect("/admin/memberManagement");
  } catch (error) {
    console.error("Error deleting Member:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Route to change active field of a member to false
router.get("/MarkAsPastMember/:id",authenticateToken, async (req, res) => {
  try {
    const memberId = req.params.id;
    const member = await Member.findById(memberId);

    if (!member) {
      return res.status(404).send("Member not found");
    }

    member.active = false;
    await member.save();

    console.log("Member marked as past successfully");
    res.redirect("/admin/memberManagement");
  } catch (error) {
    console.error("Error deactivating Member:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/MarkAsPresentMember/:id",authenticateToken, async (req, res) => {
  try {
    const memberId = req.params.id;
    const member = await Member.findById(memberId);

    if (!member) {
      return res.status(404).send("Member not found");
    }

    member.active = true;
    await member.save();

    console.log("Member marked as present successfully");
    res.redirect("/admin/memberManagement");
  } catch (error) {
    console.error("Error deactivating Member:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/eventManagement",authenticateToken, async (req, res, next) => {
  //Render all events
  try {
    const events = await Event.find({});
    res.render("admin-events", { events: events });
  } catch (error) {
    console.error("Error fetching events:", error);
    next(error); // Passes the error to the error handling middleware
  }
});

router.get("/eventManagement/details/:id",authenticateToken, async (req, res) => {
  //Search functionality
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).send("Event not found");
    res.render("eventupdate", { event }); // Renders the event details page
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// Route to update an event
router.post("/eventManagement/updateEvent",authenticateToken, upload.single("image"), async (req, res) => {
  try {
    const eventId = req.body.eventId; // Assuming event ID is sent in the form
    const updates = {};

    if (req.body.title) updates.title = req.body.title;
    if (req.body.tagline) updates.tagline = req.body.tagline;
    if (req.body.description) updates.description = req.body.description;
    if (req.body.fees) updates.fees = req.body.fees;
    if (req.body.venue) updates.venue = req.body.venue;
    if (req.body.date) updates.date = new Date(req.body.date);

    if (req.file) {
        // If a new image is uploaded, update the image field
        updates.image = req.file.path;
    }

    if (req.body.coordinators) {
        // Process coordinators
        const coordinators = [];
        for (let i = 0; i < req.body.coordinators.length; i++) {
            const coordinator = {
                name: req.body.coordinators[i].name,
                number: req.body.coordinators[i].number
            };
            coordinators.push(coordinator);
        }
        updates.coordinators = coordinators;
    }

    const result = await Event.findByIdAndUpdate(eventId, updates, { new: true });

    if (result) {
      res.redirect("/admin/eventManagement")
    } else {
        res.status(404).send('Event not found');
    }
} catch (error) {
    console.error('Error updating event:', error);
    res.status(500).send('Server error');
}
});

router.get('/eventManagement/delete/:id',authenticateToken, async (req, res) => {
  try {
      const eventId = req.params.id;
      const result = await Event.findByIdAndDelete(eventId);

      if (result) {
          res.redirect("/admin/eventManagement")
      } else {

          res.status(404).send('Event not found');
      }
  } catch (error) {
      console.error('Error deleting event:', error);
      res.status(500).send('Server error');
  }
});

router.get('/admin/memberManagement/:id/details',authenticateToken, async (req, res) => {
  try {
      const member = await Member.findById(req.params.id);
      if (!member) return res.status(404).send("Member not found");

      // Assuming you're using a view engine like Handlebars, Pug, or EJS:
      res.render('memberDetails', { member }); // Renders the member details page with the member data
  } catch (err) {
      console.error(err);
      res.status(500).send("Server Error");
  }
});

router.get("/userFeedbacks",authenticateToken, async (req, res) => {
  try {
    const Messages = await Message.find({});
    res.render("admin-feedbacks", { Messages: Messages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/eventManagement/markAsDone/:id",authenticateToken, async (req, res) => {
  try {
    const eventId = req.params.id;
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).send("event not found");
    }

    event.completed = true;
    await event.save();

    console.log("Event marked as completed");
    res.redirect("/admin/eventManagement");
  } catch (error) {
    console.error("Error deactivating Member:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
