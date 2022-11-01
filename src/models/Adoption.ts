import mongoose, { Schema, Document } from 'mongoose';

export interface IAdoptionSchema extends Document {
  date: Date;
  status: number;
  dogId: string;
  userId: string;
}

const AdoptionSchema: Schema = new Schema({
  date: {
    type: Date,
    required: true,
  },

  // Andamento: 0, Aprovado: 1, Recusado: 2
  status: {
    type: Number,
    required: true,
    default: 0,
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
