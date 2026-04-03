const express = require('express');
const auth = require('../middleware/auth');
const { UsersModel } = require('../model/UsersModel');

const router = express.Router();

router.get('/me', auth, async (req, res) => {
  try {console.log("REQ.USER:", req.user);
    const user = await UsersModel.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ 
      name:user.name,
      email:user.email
    });

  } catch (err) {
    console.error("PROFILE ERROR: ",err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;