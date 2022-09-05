import mongoose, { Schema, Document } from 'mongoose';
import Dog from './Dog';
import bcrypt from 'bcrypt';

import { Address } from '../types/IAddress';

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
    type: Date,
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

  passwordResetToken: {
    type: String,
    select: false,

  },
  passwordResetExpires: {
      type: Date,
      select: false,

  },
  createAt: {
      type: Date,
      default: Date.now,
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
    type: String,
    required: true,
  }
});

UserSchema.pre('save', function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  bcrypt.hash(this.password, 10, (err, bcrypt) => {
    this.password = bcrypt;
    return next();
  });
});

export default mongoose.model<IUserSchema>('User', UserSchema);
