import { inject, injectable } from 'inversify';
import { Logger } from 'winston';

import UsuarioModel from '../models/Usuario';
import Settings from '../types/Settings';
import { UsuarioInterface } from '../types/IUsuario';
// import { usuarioExistsError } from '../errors/errors';
import Usuario from '../models/Usuario';
import { json } from 'express';


// module.exports ={

// @injectable()
// export class UsuarioRepository {
//   @inject('Logger') logger!: Logger;
//   @inject('Settings') settings: Settings;

  const create = async(user) =>{ 
    // try {
      var usuario = await UsuarioModel.findOne({ cpf: user.cpf });

      if (usuario){
        throw new Error('User already exists');
        // return usuarioExistsError;
      }
      else{
        console.log('else', user.senha)
        var senha = new Buffer(user.senha, 'base64')
        var newUsuario = new UsuarioModel({
          nome: user.nome,
          email: user.email,
          telefone: user.telefone,
          idade: user.idade, 
          senha: senha,
          idEndereco: user.idEndereco
        });
        console.log(newUsuario)
        usuario = await UsuarioModel.create(newUsuario)

        // await usuario.save()
        
        // await newUsuario.save();
        return newUsuario;
      }

    // } 
    // catch(e) {
    //   console.log('entrou no catch tbm', e)
    //   // this.logger.error(e);
    //   throw e;
    // }
  };


  module.exports = {create}

  // async toUsuarioObject(usuario: Usuario)=> {
  //   return {
  //     id: usuario.id,
  //     nome: usuario.nome,
  //     email: usuario.email,
  //     telefone: usuario.telefone,
  //     idade: usuario.idade,
  //     senha: usuario.senha,
  //     idEndereco: usuario.idEndereco,

  //   };
  // }

