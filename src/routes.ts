import express from 'express';
import UserController from './controllers/UserController';

// private user: UserController = new UserController();

// let user = new UserCont  roller();

const router = express.Router();

router.post('/user/create', UserController.create);
// router.post('/dog/create', DogController.create)

export default router;

// import express from 'express';
// import userController from './controllers/userController';
// const routes = express.Router();

// routes.post('/user/login', userController.login);
// routes.post('/user/register', userController.register);

// export default routes;
