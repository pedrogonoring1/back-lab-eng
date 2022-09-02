import { sign } from 'jsonwebtoken';

import 'dotenv/config';
import settings from '../config/settings';

const createToken = (id: string) => sign({ id }, settings.secret); //process.env.JWT_SECRET

export default createToken;
