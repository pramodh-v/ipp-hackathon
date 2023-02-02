const router = require('express').Router();






router.get('/', authMiddleware, getGroups);
router.get('/:name', authMiddleware, getGroupByName);
router.get('/:name/posts',authMiddleware, getPosts);
router.get('/:name/members', authMiddleware, getMembers);
router.get('/:name/posts/:id', authMiddleware, getPost);

router.post('/:name/posts', authMiddleware, addPost);
router.post('/', authMiddleware, addGroup);
router.post('/:name/join',authMiddleware, joinGroup);
router.post('/:name/leave', authMiddleware, leaveGroup);



