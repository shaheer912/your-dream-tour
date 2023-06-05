import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import cors from 'cors';
import userRouter from './routes/user.js';
import tourRouter from './routes/tour.js';
import contactRouter from './routes/contact.js';
import 'dotenv/config';

const PORT = process.env.PORT || 3000;

const app = express();
app.all('/*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  // res.header('Access-Control-Allow-Headers', 'X-Requested-With');
  res.header(
    `Access-Control-Allow-Methods`,
    `GET,PUT,POST,DELETE,PATCH,OPTIONS`
  );
  res.header(
    `Access-Control-Allow-Headers`,
    `Origin, X-Requested-With, Content-Type, Accept, Authorization`
  );
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

app.use(morgan('dev'));
app.use(express.json({ limit: '30mb', extended: true }));
app.use(express.urlencoded({ limit: '30mb', extended: true }));
app.use(cors());
app.options('*', cors());
app.use('/users', userRouter);
app.use('/tours', tourRouter);
app.use('/contact', contactRouter);
app.get('/', (req, res) => {
  res.send('Welcome to Tour API');
});

// const MONGODB_URL =
//   'mongodb+srv://shaheer912:AEonY2LS4pBM5Y2M@cluster0.rcqoj9v.mongodb.net/?retryWrites=true&w=majority';
console.log(process.env.MONGODB_URL);
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`server listening on port ${PORT}`);
    });
  })
  .catch((error) =>
    console.log(
      `could not connect to database because of following error ${error}`
    )
  );
