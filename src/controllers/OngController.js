import { injectable, inject } from 'inversify';
import express, { Request, response, Response } from 'express';

import { OngRepository } from '../repositories/OngRepository';

import { ongExistsError, enderecoExistsError } from '../errors/errors';


import{
  create
} from '../repositories/OngRepository';

import {createNovoEndereco} from '../repositories/EnderecoRepository'

// import { OngFactory } from '../services/factories/OngFactory';

// @injectable()
// export class OngController {
//   @inject(OngRepository)
//   private ongRepository: OngRepository;

//   @inject(OngFactory)
//   private ongFactory: OngFactory;

//   router: express.Application;

//   constructor() {
//     this.router = express().post('/', this.create);
//   }

const createOng = async(request, response) => { //= async (request: Request, response: Response): Promise<void> => {
  console.log('entrou aqui')
  console.log('entrou na rota')
  var ong = request.body.ong;
  var endereco = request.body.endereco;

  console.log(endereco)

  const createdEndereco = await createNovoEndereco(endereco)
  if(createdEndereco != "Address already exists"){
    ong = {...ong, idEndereco: createdEndereco._id}

    const createdOng = await create(ong);
    console.log(createdOng)
    return response.status(201).json(createdOng);
  }
  else return response.status(500).json({error: createdEndereco})

    // const createdEndereco = await this.enderecoRepository.create(endereco);
    // if(createdUsuario.name != "UsuarioExists") return response.status(201).json({ createdUsuario });
    // else return response.status(500).json({ error: "Usuário já existente." });

    
  // } catch (e) {

  //   console.log(e)
  //   errorHandler(e, response);
  //   // return response.status(500).json({status: false, message: "Error"})
  // }
  // response.send({status: false})

};

const errorHandler = async(e, response)=>{
  console.log("ta entrando aqui tbm")
  if (e.name === 'User already exists') return response.status(409).send({ error: { detail: e.message } });

  else{
    return response.status(500).send({ error: { detail: 'Internal Server Error' } });
  }
};



module.exports ={
createOng
}
