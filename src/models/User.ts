import mongoose, { Schema, Document } from 'mongoose';
import Dog from './Dog';
import bcrypt from 'bcrypt';

export interface IUserSchema extends Document {
  adopter: boolean;
  adm: boolean;
  name: string;
  cpfOrCnpj: string;
  birthDate: Date;
  phone: string;
  email: string;
  password: string | undefined;
  picture: string;
  verification: boolean;
  address: string;
}

const UserSchema: Schema = new Schema({
  adopter: {
    type: Boolean,
    required: true,
  },

  adm: {
    type: Boolean,
    required: true,
  },

  name: {
    type: String,
    required: true,
  },

  cpfOrCnpj: {
    type: String,
    required: true,
  },

  birthDate: {
    type: Date(),
    required: true,
  },

  phone: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },

  password: {
    type: String,
    required: true,
    select: false,
  },

  picture: {
    type: String,
    required: true,
  },

  verification: {
    type: Boolean,
    required: true,
    default: false,
  },

  address: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Address',
    required: true,
  },

  dogs: [Dog],
});

// UserSchema.pre('save', function (next) {
//   const user = this;
//   if (!user.isModified('password')) {
//     return next();
//   }

//   bcrypt.hash(user.password, 10, (err, bcrypt) => {
//     user.password = bcrypt;
//     return next();
//   });
// });

export default mongoose.model<IUserSchema>('User', UserSchema);
