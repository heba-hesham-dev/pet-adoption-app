require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Request = require('./models/Request');
const PetPost = require('./models/PetPost');
const { sendRequestEmail, sendPetPostEmail } = require('./email');
const { upload, uploadToCloudinary } = require('./upload');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Pet Adoption API is running');
});

app.post('/api/requests', async (req, res) => {
  try {
    const request = await Request.create(req.body);

    // Send the confirmation email. If it fails, the request is still saved,
    // so we only log the problem and still answer the app with success.
    try {
      await sendRequestEmail(request);
    } catch (emailError) {
      console.error('Email failed:', emailError.message);
    }

    res.status(201).json(request);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Lists like Health and Good with arrive as text, e.g. '["Vaccinated","Microchipped"]'
function parseList(value) {
  if (!value) return [];
  try {
    const list = JSON.parse(value);
    return Array.isArray(list) ? list : [value];
  } catch {
    return [value];
  }
}

app.post('/api/pets', upload.array('photos', 5), async (req, res) => {
  try {
    const files = req.files || [];
    if (files.length === 0) {
      return res.status(400).json({ error: 'Please add at least one photo' });
    }

    const post = new PetPost({
      ...req.body,
      health: parseList(req.body.health),
      goodWith: parseList(req.body.goodWith),
    });

    // Check the text fields first, so we don't upload photos for a post that can't be saved
    await post.validate({ pathsToSkip: ['photos'] });

    // Upload all photos to Cloudinary, then keep only their links
    post.photos = await Promise.all(files.map(uploadToCloudinary));
    await post.save();

    try {
      await sendPetPostEmail(post);
    } catch (emailError) {
      console.error('Email failed:', emailError.message);
    }

    res.status(201).json(post);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Catches upload problems from multer, like too many photos or a file that isn't an image
app.use((error, req, res, next) => {
  res.status(400).json({ error: error.message });
});

const PORT = process.env.PORT || 3000;
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Could not connect to MongoDB:', error.message);
  });
