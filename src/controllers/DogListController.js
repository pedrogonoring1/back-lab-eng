const express = require('express');

const Dog = require('../models/Dog');

const router = express.Router();

router.get('/cachorro', async(req, res) =>{
	try{
		const dogs = await Dog.find();

		return res.send({ dogs });
	}catch(err){
		return res.status(400).send({ error: 'Erro ao carregar os dogs' });
	}
});

router.get('/cachorro:id', async(req, res) =>{
    try{
        const dog = await Dog.findById(req.params.id);

        return res.send({ dog });
    }catch(err){
        return res.status(400).send({ error: 'Erro ao carregar o dog' });
    }
});

module.exports = app => app.use('/cachorro', router);