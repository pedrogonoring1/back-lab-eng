import { injectable, inject } from 'inversify';
import express, { Request, Response } from 'express';

import { createNovoEndereco } from '../repositories/EnderecoRepository';
// import { EnderecoFactory } from '../services/factories/EnderecoFactory';

@injectable()
// export class EnderecoController {

  // @inject(EnderecoRepository)
  // private enderecoRepository: EnderecoRepository;

  // @inject(EnderecoFactory)
  // private enderecoFactory: EnderecoFactory;

  // router: express.Application;

  const createEndereco = async(request, response) => { //= async (request: Request, response: Response): Promise<void> => {
    console.log('entrou aqui')
      console.log('entrou na rota')
      const endereco = request.body.endereco;


    
      const createdEndereco = await createNovoEndereco(endereco);
      console.log(createdEndereco)

      return response.json(createdEndereco);
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

//   create = async (request: Request, response: Response): Promise<void> => {
//     try {
//       const { endereco } = request.body.endereco;

//       // const endereco = await this.enderecoFactory.call(description);
//       const createdEndereco = await this.enderecoRepository.create(endereco);

//       response.status(201).send({ data: createdEndereco });
//     } catch (e) {
//       this.errorHandler(e, response);
//     }
//   };

//   private errorHandler(e: any, response: Response): Response {
//     if (e.name === 'EnderecoExists') return response.status(409).send({ error: { detail: e.message } });

//     return response.status(500).send({ error: { detail: 'Internal Server Error' } });
//   }
// }
module.exports = {createEndereco}
