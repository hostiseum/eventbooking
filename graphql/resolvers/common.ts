import User from '../../models/user';
import EventModel from '../../models/event';
import { dateToString } from '../../helpers/date';

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

const singleEvent = async (eventId: any) => {
    try {

        const event: any = await EventModel.findById(eventId);

        return transformEvent(event);
    } catch (err) {
        throw err;
    }
}

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

export {user, singleEvent, events, transformEvent, transformBooking};