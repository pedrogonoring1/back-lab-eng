import mongoose, { Schema, Document } from 'mongoose';

export interface IAddressSchema extends Document {
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  cep: string;
}

const AddressSchema: Schema = new Schema({
  street: {
    type: String,
    required: true,
  },
  number: {
    type: String,
  },
  neighborhood: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  cep: {
    type: String,
    required: true,
  },
});

export default mongoose.model<IAddressSchema>('Address', AddressSchema);
