import { transformEvent, transformBooking } from "./common";

import Booking from '../../models/booking';
import EventModel from '../../models/event';

var graphqlresolvers = {
    
    bookings: async () => {
        try {

            const bookings = await Booking.find();

            return bookings
                .map((booking: any) => {
                    return transformBooking(booking);
                })

        } catch (err) {
            throw err;
        }
    },
   
    bookEvent: async (args: any, req:any) => {

        const eventFetched = await EventModel.findOne({ _id: args.eventId });

        const booking = new Booking({
            user: req.userId,
            event: eventFetched
        });

        const result: any = await booking.save();
        return transformBooking(result);
    },

    cancelBooking: async (args: any , req:any) => {
        if (!req.isAuth){
            throw new Error('Unauthenticated');
        }
        

        try {
            const booking: any = await Booking.findById(args.bookingId).populate('event');
            const event = transformEvent(booking.event);

            await Booking.deleteOne({ _id: args.bookingId });
            return event;

        }
         catch (err) {
            throw err;
        }
    }

};

export{ graphqlresolvers as bookingResolver };