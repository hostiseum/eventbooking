import mongoose, { Schema, Document, SchemaTypes } from "mongoose";

const bookingSchema : Schema = new Schema({

    user:{
        type: Schema.Types.ObjectId,
        ref:'User'
    }
,
        event:{
        type: Schema.Types.ObjectId,
        ref:'EventModel'
    }
}, {timestamps : true});

export default mongoose.model('Booking', bookingSchema);