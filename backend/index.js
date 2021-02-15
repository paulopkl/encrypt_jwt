const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('jwt-simple');
require('dotenv').config();
const config = require('./knexfile.js');
const knex = require('knex');
const db = knex(config);
const app = express();

app.use(cors('*'));
app.use(bodyParser.json());

app.post('/register', async (req, res, next) => {
    const { name, email, password: psw } = req.body;

    if(!email || !name || !psw) res.status(200).json({ message: "Dados em falta!" });

    const validateEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!validateEmail.test(email)) res.status(200).json({ message: "Email inválido verifique novamente!" });

    const salt = bcrypt.genSaltSync(10);
    const password = bcrypt.hashSync(psw, salt);

    const data = { name, email, password }

    const [ id ] = await db('users').insert(data);
    const user = await db('users').where({ id }).first();

    res.status(200).json({ message: "Successfully!", user });

    next();
});

app.post('/login', async (req, res, next) => {
    try {
        const { name, password } = req.body;
        if (!name) return res.status(200).json({ message: "Name empty!!" });

        const user = await db('users').where({ name }).first();        
        
        const areEquals = bcrypt.compareSync(password, user.password);

        if (!areEquals) return res.status(200).json({ message: 'Invalid User/Password!' });

        const now = Math.floor(Date.now() / 1000);

        const payload = {
            id: user.id,
            name: user.name,
            email: user.email,
            iat: now,
            exp: now + (3 * (24 * (60 * 60)))
        }
            
        const authSecret = process.env.APP_SECRET;

        const logIn = { ...payload, token: jwt.encode(payload, authSecret) }

        res.status(200).json({ message: "Logged with Success!!", logIn });
    } catch (err) {
        res.status(200).json({ message: "Name not found!" });
    }
})

const port = 3333;
app.listen(port, () => console.log('running on', port));