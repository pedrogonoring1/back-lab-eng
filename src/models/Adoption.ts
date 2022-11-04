import mongoose, { Schema, Document } from 'mongoose';

export interface IAdoptionSchema extends Document {
  date: Date;
  status: number;
  dog: string;
  adopter: string;
}

const AdoptionSchema: Schema = new Schema({
  date: {
    type: Date,
    required: true,
  },

  // Andamento: 0, Aprovado: 1, Recusado: 2
  status: {
    type: Number,
    default: 0,
    required: true,
  },

  dog: {
    type: String,
    ref: 'Dog',
    required: true,
  },

  adopter: {
    type: String,
    ref: 'User',
    required: true,
  },
});

export default mongoose.model<IAdoptionSchema>('Adoption', AdoptionSchema);
