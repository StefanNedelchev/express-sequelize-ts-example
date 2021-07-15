import { Session, SessionData } from 'express-session';
import { User } from './modules/user/user.model';

export type UserSession = Session & Partial<SessionData> & { user?: User };
