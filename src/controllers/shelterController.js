const express = require('express');

const Shelter = require('../models/Shelter');
const Adress = require('../models/Adress');

const router = express.Router();

router.get('/abrigo', async(req, res) =>{
	try{
		const shelters = await Shelter.find();

		return res.send({ shelters });
	}catch(err){
		return res.status(400).send({ error: 'Erro ao carregar os abrigos' });
	}
});

router.post('/abrigo', async(req, res) =>{
	try{
		const shelter = await Shelter.create({...req.body});

		return res.send({ shelter });
	}catch(err){
		return res.status(400).send({ error: 'Erro ao cadastrar o novo abrigo' });
	}
});

router.delete('/abrigo:shelterId', async(req, res) =>{
	try{
		await Shelter.findByIdAndRemove(req.params.shelterId);

		return res.send();
	}catch(err){
		return res.status(400).send({ error: 'Erro ao deletar o abrigo' });
	}
});

router.put('/abrigo:shelterId', async(req, res) =>{
	try{
		const { name, email, password, adressId } = req.body;
		const shelter = await Shelter.findByIdAndUpdate(req.params.shelterId, {
			name,
			email,
			password
		}, { new: true } );

		await adressId.findByIdAndRemove(adressId);
		shelter.adressId = null;

		const newAdress = await Adress.create({...req.body})
		await newAdress.save();

		shelter.adressId = newAdress.id;
		await shelter.save();

		return res.send({ shelters });
	}catch(err){
		return res.status(400).send({ error: 'Erro ao autalizar o abrigo' });
	}
});

module.exports = app => app.use('/shelter', router);