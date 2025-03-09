import express from 'express';
import cors from 'cors';
const port = 3000; 
import pkg from 'body-parser';
const { json } = pkg;
const app = express();
import taskRoute from './route/taskRoute.js';

// const task = req.body



app.use(cors());

app.use(express.json());
app.use(json());


app.use('/api', taskRoute);


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
