// shortLinks.js
const express = require('express');
const ShortLink = require('../models/shortLink.model');

const router = express.Router();

router.get('/dashboard', async (req, res) => {
    try {
        const userShortLinks = await ShortLink.find({ user: req.user._id });
        const linkAnalytics = userShortLinks.map(link => ({
            token: link.token,
            originalURL: link.originalURL,
            expirationTime: link.expirationTime,
            clickCount: link.clickCount,
        }));
        return res.json({ user: req.user, links: linkAnalytics });
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});

router.get('/shortlinks/:token', async (req, res) => {
    const token = req.params.token;
    try {
        const link = await ShortLink.findOne({ token });
        if (!link) {
            return res.status(404).send('Link not found');
        }
        if (link.expirationTime < new Date()) {
            await ShortLink.findOneAndDelete({ token });
            return res.status(410).send('Link has expired');
        }

        // If the link is found and hasn't expired, send the original URL in the response
        res.json({ originalURL: link.originalURL });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});


router.post('/shorten', async (req, res) => {
    const { originalURL, customToken } = req.body;

    // If a custom token is provided, use it; otherwise, generate a random one
    const token = customToken || Math.random().toString(36).substr(2, 6);

    try {
        // Check if the token already exists in the database
        const existingLink = await ShortLink.findOne({ token });
        
        if (existingLink) {
            // If the token exists, generate a new one and re-run the function
            return res.status(409).json({ message: 'Token conflict. Please try again.', token: null });
        }

        const expirationTime = new Date();
        expirationTime.setHours(expirationTime.getHours() + 48);

        const shortLink = new ShortLink({
            token,
            originalURL,
            expirationTime,
            user: req.user._id,
        });

        await shortLink.save();
        res.json({ message: `Short link created: ${process.env.CLIENT_URL}/links/${token}`, token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error', token: null });
    }
});

router.delete('/delete/:token', async (req, res) => {
    const token = req.params.token;
  
    try {
      // Find and delete the short link with the specified token
      const deletedLink = await ShortLink.findOneAndDelete({ token });
  
      if (deletedLink) {
        res.status(200).json({ message: 'Short link deleted successfully' });
      } else {
        res.status(404).json({ message: 'Short link not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

  router.post('/updateClickCount/:token', async (req, res) => {
    const token = req.params.token;
    try {
      // Find the short link by token and update the click count
      const result = await ShortLink.findOneAndUpdate(
        { token },
        { $inc: { clickCount: 1 } }, // Increment the click count by 1
        { new: true } // Return the updated document
      );
  
      if (!result) {
        return res.status(404).send('Link not found');
      }
  
      // Send a success response
      res.status(200).send('Click count updated successfully');
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });
  


module.exports = router;
