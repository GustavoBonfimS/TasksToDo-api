const router = require('express').Router();
const usersRoutes = require('./usersRoutes');
const tasksRoutes = require('./tasksRoutes');
const projectsRoutes = require('./projectsRoutes');

router.get('/', (req, res) => {
  return res.json({
    message: 'hello!'
  });
});

router.use('/user', usersRoutes);
router.use('/task', tasksRoutes);
router.use('/project', projectsRoutes);

module.exports = router;