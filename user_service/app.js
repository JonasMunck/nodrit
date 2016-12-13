const express = require('express');
const amqp = require('amqplib/callback_api');

app = express();

app.get('/', (req, res) => {


    amqp.connect('amqp://rabbit', (err, conn) => {
        if (err) {
            console.log(err);
        }
        conn.createChannel((err, ch) => {
            const ex = 'users';

            const msg = 'new_user_created';

            ch.assertExchange(ex, 'fanout', {durable: false});
            ch.publish(ex, '', new Buffer(msg));
            console.log('sent', msg);
        })
    });

    res.send('Hello World')
});

app.get('/create-user', (req, res) => {
    res.send('Created user')
});

app.listen('4000')




