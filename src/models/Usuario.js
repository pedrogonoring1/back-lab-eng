// import mongoose, { Schema } from 'mongoose';
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// export interface UsuarioDocument extends Document {
//   nome: string;
//   senha: string;
//   email: string;
//   telefone: number;
//   idade: number;
//   idEndereco: string;
// }

const UsuarioSchema = new Schema({
//   description: {
//     type: String,
//     required: true,
//     unique: true,
//   },
  
  nome: {
    type: String,
    required: true
  },

  email: {
    type: String, 
    required: true,
    unique: true
  },
  
  cpf: {
    type: Number,
    required: true,
    unique: true
  },

  senha: {
    type: String,
    required: true
  },

  telefone: {
    type: Number
  },

  idade: {
    type: Number
  },

  idEndereço: {
    type: String
  },
});

export default mongoose.model('Usuario', UsuarioSchema);
