const express = require("express");
const homeController = require('../controllers/homeController');
const loginController = require('../controllers/loginController');
const postController = require('../controllers/postController');
const userController = require('../controllers/userController');
const imageMiddleware = require('../middlewares/imageMiddleware');
const authMiddleware = require('../middlewares/authMiddleware');

//Routes
const router = express.Router();

router.get('/', homeController.index);

router.get('/users/login' , loginController.login);
router.post('/users/login', loginController.loginAction);

router.get('/users/logout', loginController.logout);

router.get('/users/register', loginController.register);
router.post('/users/register', loginController.registerAction);

router.get('/users/forget', userController.forgetPassword);
router.post('/users/forget', userController.forgetPasswordAction);

router.get('/users/reset/:token', userController.resetPassword);
router.post('/users/reset/:token', userController.resetPasswordAction);

router.post('/users/edit/password', authMiddleware.isUserLogged, authMiddleware.passwordUpdate);

router.get('/users/edit', authMiddleware.isUserLogged, userController.edit);
router.post('/users/edit', authMiddleware.isUserLogged, userController.editAction);


router.get('/post/add', authMiddleware.isUserLogged, postController.add);
router.post('/post/add', authMiddleware.isUserLogged, imageMiddleware.upload, imageMiddleware.resize, postController.addAction);

router.get('/post/:slug/edit', authMiddleware.isUserLogged, postController.edit);
router.post('/post/:slug/edit', authMiddleware.isUserLogged, imageMiddleware.upload, imageMiddleware.resize, postController.editAction);

router.get('/post/:id/delete', authMiddleware.isUserLogged, postController.delete); 

router.get('/post/:slug', postController.view);

module.exports = router;