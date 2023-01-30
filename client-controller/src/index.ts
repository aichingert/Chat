import express from "express"
import cors from "cors"
const app = express();

app.use(cors());

app.post('/login', (req, res) => {

});

app.post('/register', (req, res) => {

});

app.route('/friends')
    .get((req, res) => {

    }).put((req, res) => {

    }).delete( (req, res) => {

});

app.listen(3000);