import express, { Request, Response } from 'express';

import AdoptionModel from '../models/Adoption';

const router = express.Router();

router.get('/adoption:userId', async (req: Request, res: Response) => {
  try {
    const adoptions = await AdoptionModel.find({ adopter: req.params.userId });

    return res.send({ adoptions });
  } catch (err) {
    return res.status(400).send({ error: 'Erro ao carregar as adoções do usuário' });
  }
});
