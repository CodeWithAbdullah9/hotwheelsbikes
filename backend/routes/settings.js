const router   = require('express').Router();
const Settings = require('../models/Settings');
const Admin    = require('../models/Admin');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) settings = await Settings.create({});
    res.json(settings);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/', protect, authorize('super_admin'), async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) settings = new Settings();
    Object.assign(settings, req.body);
    await settings.save();
    res.json(settings);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// Admin user management
router.get('/admins', protect, authorize('super_admin'), async (req, res) => {
  try {
    const admins = await Admin.find().select('-password').sort({ createdAt: -1 });
    res.json(admins);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/admins', protect, authorize('super_admin'), async (req, res) => {
  try {
    const admin = await Admin.create(req.body);
    res.status(201).json(admin.toSafeObject());
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.put('/admins/:id', protect, authorize('super_admin'), async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin) return res.status(404).json({ message: 'Not found' });
    const { password, ...rest } = req.body;
    Object.assign(admin, rest);
    if (password) admin.password = password;
    await admin.save();
    res.json(admin.toSafeObject());
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.delete('/admins/:id', protect, authorize('super_admin'), async (req, res) => {
  try {
    if (req.params.id === req.admin._id.toString())
      return res.status(400).json({ message: 'Cannot delete yourself' });
    await Admin.findByIdAndDelete(req.params.id);
    res.json({ message: 'Admin deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
