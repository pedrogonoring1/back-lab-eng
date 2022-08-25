import { injectable, inject } from 'inversify';
import express, { Request, Response } from 'express';

import { UsuarioRepository } from '../repositories/UsuarioRepository';
import { usuarioExistsError, enderecoExistsError } from '../errors/errors';
// import { EnderecoRepository } from '../repositories/EnderecoRepository';
// import { UsuarioFactory } from '../services/factories/UsuarioFactory';

import{
  create
} from '../repositories/UsuarioRepository';

import {createNovoEndereco} from '../repositories/EnderecoRepository'

// @injectable()
// export class UsuarioController {
  // @inject(UsuarioRepository)
  // private usuarioRepository: UsuarioRepository;
  // private enderecoRepository: EnderecoRepository;
  

  // @inject(UsuarioFactory)
  // private usuarioFactory: UsuarioFactory;

  // router: express.Application;

  // constructor() {
  //   this.createUsuario = Object.create(usuario); 
  //   // this.router = express().post('/api/createUsuario', this.create);
  //   console.log('ta erehnjk')
  // }

  const createUsuario = async(request, response) => { //= async (request: Request, response: Response): Promise<void> => {
    console.log('entrou aqui')
    console.log('entrou na rota')
    var usuario = request.body.usuario;
    var endereco = request.body.endereco;

    console.log(endereco)

    const createdEndereco = await createNovoEndereco(endereco) 
    if(createdEndereco != "Address already exists"){ 
      usuario = {...usuario, idEndereco: createdEndereco._id}

      const createdUsuario = await create(usuario);
        console.log(createdUsuario)

      return response.status(201).json(createdUsuario);
    } else return response.status(500).json({error: createdEndereco})

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
  createUsuario
}