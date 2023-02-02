const router = require('express').Router();
const authMiddleware = require('../middleware/middleware');

const { getGroups, getGroupByName, getPosts, getMembers, getPost, addGroup, addPost, joinGroup, leaveGroup } = require('../controllers/group-controller');

// router.get('/', authMiddleware, getGroups);
// router.get('/:name', authMiddleware, getGroupByName);
// router.get('/:name/posts',authMiddleware, getPosts);
// router.get('/:name/members', authMiddleware, getMembers);
// router.get('/:name/posts/:id', authMiddleware, getPost);

// router.post('/:name/posts', authMiddleware, addPost);
router.post('/',addGroup);
// router.post('/:name/join',authMiddleware, joinGroup);
// router.post('/:name/leave', authMiddleware, leaveGroup);

module.exports = router;

