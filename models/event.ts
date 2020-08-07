import mongoose, { Schema, Document, SchemaTypes } from "mongoose";

export interface IEvent extends Document {
    title: string;
    description?: string;
    price: Number;
    date: Date;
    creator: Schema.Types.ObjectId
}

const eventSchema : Schema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    date: {
        type: Date
    },
    creator:{
        type: Schema.Types.ObjectId,
        ref:'User'
    }

});

export default mongoose.model('EventModel', eventSchema);