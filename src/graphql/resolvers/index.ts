import EventModel, { IEvent } from '../../models/event';
import User from '../../models/user';
import bcrypt from 'bcryptjs';
import Booking from '../../models/booking';
import { dateToString } from '../../helpers/date';

const user = async (userId: any) => {
    let user: any = await User.findById(userId);
    try {

        return {
            ...user._doc,
            _id: user._doc.id,
            createdEvents: () => events(user._doc.createdEvents)
        };
    }
    catch (err) {
        throw err;
    };

}

const transformEvent = (event : any)=>{
    return {
        ...event._doc,
        _id: event._doc._id,
        date:  dateToString(event._doc.date),
        creator: () => user(event.creator)
    }
};

const transformBooking = (booking : any)=>{
    return {
        ...booking._doc,
        _id: booking._doc._id,
        user: () => user(booking._doc.user),
        event: () => singleEvent(booking._doc.event),
        createdAt: dateToString(booking._doc.createdAt),
        updatedAt: dateToString(booking._doc.updatedAt)
    }
};

const events = async (eventIds: any[]) => {
    try {
        const events = await EventModel.find({ _id: { $in: eventIds } });
        // console.log(events);
        return events.map((event: any) => {
            console.log(event);
            return transformEvent(event);
        });
    }
    catch (err) {
        throw err;
    }
}

const singleEvent = async (eventId: any) => {
    try {

        const event: any = await EventModel.findById(eventId);

        return transformEvent(event);
    } catch (err) {
        throw err;
    }
}

var graphqlresolvers = {
    events: async () => {
        try {
            const events = await EventModel.find();
            return events
                .map((event: any) => {
                    console.log(event._doc)
                    return transformEvent(event);
                });
        }
        catch (err) {
            console.log(err);
            throw err;
        };
    },
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
    createEvent: async (args: any) => {
        try {
            const event = new EventModel({
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: new Date(args.eventInput.date),
                creator: '5f1cecaf5e639040aca13cf5'
            });

            let createdEvent = new EventModel();

            const result: any = await event.save();
            createdEvent = transformEvent(result);
            console.log(result);
            const user: any = await User.findById('5f1cecaf5e639040aca13cf5');

            if (!user) {
                throw new Error('Could not find user');
            }
            user.createdEvents.push(event);
            await user.save();
            return createdEvent;
        }
        catch (err) {
            console.log(err);
            throw err;
        };

    },

    createUser: async (args: any) => {
        try {
            const existingUser: any = await User.findOne({ email: args.userInput.email })
            if (existingUser) {
                throw new Error('User already exists.');
            }
            else {
                const hashPassword = await bcrypt.hash(args.userInput.password, 12);

                const user = new User({
                    email: args.userInput.email,
                    password: hashPassword
                });

                const result: any = await user.save();
                return {
                    ...result._doc,
                    password: null,
                    _id: result._doc._id,
                    email: result._doc.email
                };
            }
        }
        catch (err) {
            console.log(err);
            throw err;
        }
    },

    bookEvent: async (args: any) => {

        const eventFetched = await EventModel.findOne({ _id: args.eventId });

        const booking = new Booking({
            user: '5f1cecaf5e639040aca13cf5',
            event: eventFetched
        });

        const result: any = await booking.save();
        
        
        return transformBooking(result);
        // return {
        //     ...result._doc,
        //     _id: result.id,
        //     user: () => user(result._doc.user),
        //     event: () => singleEvent(result._doc.event),
        //     createdAt: dateToString(result._doc.createdAt),
        //     updatedAt: dateToString(result._doc.updatedAt)
        // }

    },

    cancelBooking: async (args: any) => {
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
export { user, events, graphqlresolvers };