import express from 'express';
import AddressController from './controllers/AddressController';
import UserController from './controllers/UserController';

const router = express.Router();

router.post('/user/create', UserController.create);
router.post('/user/login', UserController.login);
router.put('/user/refinirSenha', UserController.forgotPassword)



router.post('/address/create', AddressController.create);
// router.post('/dog/create', DogController.create)


export default router;
