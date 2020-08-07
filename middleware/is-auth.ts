import jwt, { JsonWebTokenError } from "jsonwebtoken";


const isAuth = (req: any, res: any, next: any) => {

    const authHeader = req.get('Authorization');

    if (!authHeader) {
        req.isAuth = false;
        return next();
    }

    const token = authHeader.split(' ')[1]; // Authorization: Bearer <<toekn>>

    if (!token || token === '') {
        req.isAuth = false;
        return next();
    }

    let decodedToken: any;
    try {
      decodedToken=  jwt.verify(token, 'somesupersecretkey');
    } catch (err) {
        req.isAuth = false;
        return next();
    }
    req.isAuth = true;
    console.log(decodedToken);
    req.userId = decodedToken.userId;
    next();
}

export {isAuth};