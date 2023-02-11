import pg from 'pg';
import session from 'express-session';
import postgresSessionConnector from 'connect-pg-simple';

const pgSession = postgresSessionConnector(session);
const sessionPool = pg.Pool;

export const sessionDBAccess = new sessionPool({
    user : process.env.USER,
    password : process.env.PASSWORD,
    database : process.env.DATABASE,
    port : Number(process.env.DB_PORT),
    host : process.env.DB_HOST
})

const dbStore = new pgSession({
    pool : sessionDBAccess,
    tableName : "sessions"
})

export const SessionConfig : session.SessionOptions | undefined = {
    store : dbStore,
    name : "SID",
    secret : "asdfsdfsdfsdf",
    resave : false,
    saveUninitialized : false,
    cookie : {
        sameSite : process.env.NODE_ENV !== "DEV",
        maxAge : 1000 * 60 * 60 * 24,
        secure : false,
    }

}