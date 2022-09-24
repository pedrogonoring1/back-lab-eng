import mongoose, { Schema } from 'mongoose';

const OngSchema = new Schema({

  
  nome: {
    type: String,
    required: true
  },

  email: {
    type: String
  },

  cnpj: {
    type: String,
    required: true,
    unique: true
  },

  senha: {
    type: String
  },

  urlFoto: {
    type: String
  },

  seloVerificado: {
    type: Boolean,
    required: true
  },

  idEndereço: {
    type: String
  },

  
});

export default mongoose.model('Ong', OngSchema);
