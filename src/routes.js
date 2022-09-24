// import { tokenSecurity } from './ces/jsonWebToken';

import express from 'express';
// const express = require('express');
const routes = express.Router();

// routes.use('/api', tokenSecurity);

// import { UsuarioController } from './controllers/UsuarioController';

const UsuarioController = require('./controllers/UsuarioController');
// import {EnderecoController} from './controllers/EnderecoController'
const OngController = require('./controllers/OngController');

routes.post('/usuario/createUsuario', UsuarioController.createUsuario);

// routes.post('/endereco/', EnderecoController.create)
routes.post('/ong/createOng', OngController.createOng);

module.exports = routes;
