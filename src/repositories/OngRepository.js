import { inject, injectable } from 'inversify';
import { Logger } from 'winston';

import OngModel, { OngDocument } from '../models/Ong';
import Settings from '../types/Settings';
import { Ong } from '../types/IOng';
import { ongExistsError } from '../errors/errors';

// @injectable()
// export class OngRepository {
//   @inject('Logger') logger!: Logger;
//   @inject('Settings') settings: Settings;

  const create = async(ongInfo) => {

    var ong = await OngModel.findOne({ email: ongInfo.email });

    if (ong) throw new Error('Ong already exists');
    else{
      const newOng = new OngModel({
        nome:ongInfo.nome,
        email: ongInfo.email,
        urlFoto: ongInfo.urlFoto,
        seloVerificado: ongInfo.seloVerificado,
        idEndereço: ongInfo.idEndereco
      });
      ong = await OngModel.create(newOng)
  
      return newOng;

    }
  }

//   private toOngObject(ong: OngDocument): Ong {
//     return {
//       id: ong.id,
//       nome:ong.nome,
//       email: ong.nome,
//       urlFoto: ong.urlFoto,
//       seloVerificado: ong.seloVerificado,
//       idEndereco: ong.idEndereco
//   }
// }
module.exports = {create}