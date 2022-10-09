import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUserSchema extends Document {
  adopter: boolean;
  adm: boolean;
  name: string;
  cpfOrCnpj: string;
  birthDate: Date;
  phone: string;
  email: string;
  password?: string;
  picture: string;
  verified: boolean;
  addressId: string;
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

  createdAt: {
    type: Date,
    default: Date.now,
  },

  picture: {
    type: String,
  },

  verified: {
    type: Boolean,
    required: true,
    default: false,
  },

  addressId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
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
