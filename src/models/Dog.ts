import mongoose, { Schema, Document } from 'mongoose';

export interface IDogSchema extends Document {
  name: string;
  age: number;
  gender: string;
  size: string;
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
    type: String,
    required: true,
  },

  size: {
    type: String,
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

  adopted: {
    type: Boolean,
    required: true,
  },

  shelter: {
    type: String,
    ref: 'User',
    required: true,
  },
});

export default mongoose.model<IDogSchema>('Dog', DogSchema);
