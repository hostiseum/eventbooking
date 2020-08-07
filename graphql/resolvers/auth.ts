import User from '../../models/user';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

var graphqlResolvers = {
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
    login: async ({ email, password }: { email: string; password: string }) => {
        const user: any = await User.findOne({ email: email });

        if (!user) {
            throw new Error('User does not exist');
        }

        const isEqual = await bcrypt.compare(password, user.password);
        if (!isEqual) {
            throw new Error('Password is incorrect!');
        }

        const token = jwt.sign({ userId: user.id, email: user.email },
            'somesupersecretkey',
            { expiresIn: '1h' });
         
        return  {userId: user.id, token: token, tokenExpiration: 1};     

    }
};

export { graphqlResolvers as authResolver };