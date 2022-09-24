import mongoose, { Schema } from 'mongoose';

// export interface EnderecoDocument extends Document {
//   rua: string;
//   cidade: string;
//   estado: string;
//   cep: number;
//   numero: number;
// }

const EnderecoSchema = new Schema({
  //   description: {
  //     type: String,
  //     required: true,
  //     unique: true,
  //   },

  rua: {
    type: String,
    required: true,
  },

  cidade: {
    type: String,
    required: true,
  },

  estado: {
    type: String,
    required: true,
  },

  cep: {
    type: Number,
    required: true,
  },

  numero: {
    type: Number,
  },
});

export default mongoose.model('Endereco', EnderecoSchema);
