import { dateToString } from "../../helpers/date";
import User from "../../models/user";
import EventModel, { IEvent } from '../../models/event';
import { transformEvent } from "./common";


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
 
    createEvent: async (args: any, req:any) => {
        
        if (!req.isAuth){
            throw new Error('Unauthenticated');
        }
        
        
        try {
            const event = new EventModel({
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: new Date(args.eventInput.date),
                creator: req.userId
            });

            let createdEvent = new EventModel();

            const result: any = await event.save();
            createdEvent = transformEvent(result);
            console.log(result);
            const user: any = await User.findById(req.userId);

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
};

export{ graphqlresolvers as eventResolver };