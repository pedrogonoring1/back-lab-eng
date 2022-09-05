import mongoose, { Schema, Document } from 'mongoose';
import Adoption from './Adoption';

export interface IDogSchema extends Document {
  name: string;
  age: number;
  gender: number;
  size: number;
  history: string;
  picture: string;
  adopted: boolean;
}

const DogSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
  },

  age: {
    type: Number,
    required: true,
  },

  gender: {
    type: Number,
    enum: ['Macho', 'Fêmea'],
    required: true,
  },

  size: {
    type: Number,
    enum: ['Pequeno', 'Médio', 'Grande'],
    required: true,
  },

  history: {
    type: String,
    required: true,
  },

  picture: {
    type: String,
    required: true,
  },

  shelter: {
    type: String,
    required: true,
  },

  adopted: {
    type: Boolean,
    required: true,
  }
});

export default mongoose.model<IDogSchema>('Dog', DogSchema);
