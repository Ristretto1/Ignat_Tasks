import dotenv from 'dotenv';
dotenv.config();

export const SETTINGS = {
  PORT: process.env.PORT || 3000,
  BASIC_LOGIN: process.env.BASIC_LOGIN || 'admin',
  BASIC_PASSWORD: process.env.BASIC_PASSWORD || 'qwerty',
  SECRET_KEY: process.env.SECRET_KEY || '123',
  MONGO_URI:
    process.env.MONGO_URI ||
    'mongodb+srv://antonovkir2:Antonov!13@cluster0.1y0qclo.mongodb.net/inc_dev?retryWrites=true&w=majority',
  LOCAL_URI: process.env.LOCAL_URI || 'mongodb://localhost:27017',
};
