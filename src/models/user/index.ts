import mongoose, { Document, Schema, InferSchemaType } from 'mongoose';
import { IUser } from '@/models/user/user.types';

const UserSchema = new Schema<IUser>({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    wins: { type: Number, required: true },
    draws: { type: Number, required: true },
    losses: { type: Number, required: true },
});

export type IUserModel = InferSchemaType<typeof UserSchema>;

export const UserModel = mongoose.model<IUserModel>('User', UserSchema);
