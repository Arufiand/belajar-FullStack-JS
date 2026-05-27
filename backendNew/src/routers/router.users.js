const { getAllUsers } = require('../controllers/controller.users');
const { router } = require('express/lib/application');

router.get('/users', getAllUsers);
