import mongoose, { Schema, Document } from 'mongoose';

export interface ExampleDocument extends Document {
  description: string;
}

const ExampleSchema: Schema = new Schema({
  description: {
    type: String,
    required: true,
    unique: true,
  },
});

export default mongoose.model<ExampleDocument>('Example', ExampleSchema);
