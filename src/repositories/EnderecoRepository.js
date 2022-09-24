import { inject, injectable } from 'inversify';
import { Logger } from 'winston';

import EnderecoModel from '../models/Endereco';
import Settings from '../types/Settings';
import { Endereco } from '../types/IEndereco';
import { enderecoExistsError } from '../errors/errors';

// @injectable()
// export class EnderecoRepository {
// @inject('Logger') logger!: Logger;
// @inject('Settings') settings: Settings;

const createNovoEndereco = async (enderecoInfo) => {
  var endereco = await EnderecoModel.findOne({ cep: enderecoInfo.cep });

  if (endereco) {
    // throw new Error('Address already exists'); //Error("Endereco already exists");
    return 'Address already exists';
  } else {
    const newEndereco = new EnderecoModel({
      cep: enderecoInfo.cep,
      rua: enderecoInfo.rua,
      cidade: enderecoInfo.cidade,
      estado: enderecoInfo.estado,
      numero: enderecoInfo.numero,
    });

    endereco = await EnderecoModel.create(newEndereco);
    return true;
  }
};

// private toEnderecoObject(endereco: EnderecoDocument): Endereco {
//   return {
//     id: endereco.id,
//     rua: endereco.rua,
//     cidade: endereco.cidade,
//     estado: endereco.estado,
//     cep: endereco.cep,
//     numero: endereco.numero
//   };
// }
// }
module.exports = { createNovoEndereco };
