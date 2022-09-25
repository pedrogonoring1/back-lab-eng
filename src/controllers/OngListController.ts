import express, { Request, Response } from 'express';

import OngModel from '../models/Ong';

const router = express.Router();
router.get('/abrigo', async(req: Request, res: Response) =>{
	try{
		const abrigos = await OngModel.find();

		return res.send({ abrigos });
	}catch(err){
		return res.status(400).send({ error: 'Erro ao carregar os abrigos' });
	}
});

router.get('/abrigo:id', async(req: Request, res: Response) =>{
    try{
        const abrigo = await OngModel.findById(req.params.id);

        return res.send({ abrigo });
    }catch(err){
        return res.status(400).send({ error: 'Erro ao carregar o abrigo' });
    }
});

router.get('/abrigo:nome', async(req: Request, res: Response) =>{
    try{
        const abrigo = await OngModel.find({name: req.params.nome}).exec();

        return res.send({ abrigo });
    }catch(err){
        return res.status(400).send({ error: 'Erro ao carregar o abrigo' });
    }
});