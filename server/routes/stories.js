const express = require('express');
const Story = require('../mongodb/models/story_model');
const router = express.Router();
const { ensureAuth } = require('../middleware/auth');

//Add Stories
router.get('/add', ensureAuth, (req, res) => {
    res.render('stories/add');
});

router.post('/', ensureAuth, async (req, res) => {
    try{
        req.body.user = req.user.id;
        await Story.create(req.body);
        res.redirect('/dashboard');
    }catch(error){
        console.error(error);
    }
});

router.get('/', ensureAuth, async (req, res) => {
    try{

        const stories = await Story.find({ status: 'public' })
            .populate('user')
            .sort({ createdAt: 'desc' })
            .lean();
        res.render('stories/index', {
            stories
        })

    }catch(error){
        console.error(error);
    }
});


router.get('/:id', ensureAuth, async (req, res) => {
    try {
      let story = await Story.findById(req.params.id).populate('user').lean()
  
      if (story.user._id != req.user.id && story.status == 'private') {
        console.log('Error occured');
      } else {
        res.render('stories/show', {
          story,
        })
      }
    } catch (err) {
      console.error(err)
      console.error(error);
    }
})

router.get('/edit/:id', ensureAuth, async (req, res) => {
    try {
      const story = await Story.findOne({
        _id: req.params.id,
      }).lean()

      if (story.user != req.user.id) {
        res.redirect('/stories')
      } else {
        res.render('stories/edit', {
          story,
        })
      }
    } catch (err) {
      console.error(err)
    }
})

router.put('/:id', ensureAuth, async (req, res) => {
    try {
      let story = await Story.findById(req.params.id).lean()

      if (story.user != req.user.id) {
        res.redirect('/stories')
      } else {
        story = await Story.findOneAndUpdate({ _id: req.params.id }, req.body, {
          new: true,
          runValidators: true,
        })
  
        res.redirect('/dashboard')
      }
    } catch (err) {
      console.error(err)
    }
})

router.delete('/:id', ensureAuth, async (req, res) => {
    try {
      let story = await Story.findById(req.params.id).lean()
  
      if (story.user != req.user.id) {
        res.redirect('/stories')
      } else {
        await Story.remove({ _id: req.params.id })
        res.redirect('/dashboard')
      }
    } catch (err) {
      console.error(err)
    }
})


router.get('/user/:userId', ensureAuth, async (req, res) => {
    try {
      const stories = await Story.find({
        user: req.params.userId,
        status: 'public',
      })
        .populate('user')
        .lean()
  
      res.render('stories/index', {
        stories,
      })
    } catch (err) {
      console.error(err)
    }
})


router.get('/search/:query', ensureAuth, async (req, res) => {
    try{
        const stories = await Story.find({title: new RegExp(req.query.query,'i'), status: 'public'})
        .populate('user')
        .sort({ createdAt: 'desc'})
        .lean()
       res.render('stories/index', { stories })
    } catch(err){
        console.log(err)
    }
})


module.exports = router;
