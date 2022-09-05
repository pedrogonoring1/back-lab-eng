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

  status: {
    type: Number,
    required: true,
  },

  dog: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dog',
    required: true,
  },

  adopter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  },
});

export default mongoose.model<IAdoptionSchema>('Adoption', AdoptionSchema);
