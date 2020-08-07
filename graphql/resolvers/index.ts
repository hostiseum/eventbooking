import {bookingResolver} from './booking';
import {eventResolver} from './events';
import { authResolver } from './auth';



var rootResolvers = {
    ...authResolver,
    ...bookingResolver,
    ...eventResolver
};

export {  rootResolvers };