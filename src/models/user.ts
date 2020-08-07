import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
    title: string;
    description?: string;
    price: Number;
    date: Date;
}


const userSchema : Schema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    createdEvents:[
        {
            type:Schema.Types.ObjectId,
            ref: 'EventModel'
        }
    ],
    date: {
        type: Date
    }

});

export default mongoose.model('User', userSchema);