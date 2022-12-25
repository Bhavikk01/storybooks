const express = require('express');
const Story = require('../mongodb/models/story_model');
const router = express.Router();
const { ensureAuth, ensureGuest } = require('../middleware/auth');

//Login/Landing page
router.get('/', (req, res) => {
    res.render('login', {
        layout: 'login'
    })
});

//Dashboard
router.get('/dashboard', ensureAuth, async (req, res) => {
    try {
        const stories = await Story.find({ user: req.user.id }).lean()
        res.render('dashboard', {
          name: req.user.firstName,
          stories,
        })
      } catch (err) {
        console.error(err)
      }
});

// router.get('/story', )

module.exports = router;
