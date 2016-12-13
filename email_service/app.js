const express = require('express');

app = express();

app.get('/', (req, res) => {
    res.send('Hello World from email')
});

app.listen('5001')

const amqp = require('amqplib/callback_api');

amqp.connect('amqp://rabbit', (err, conn) => {
    if (err) {
        console.log(err);
    }

    conn.createChannel((err, ch) => {
        const ex = 'users';

        ch.assertExchange(ex, 'fanout', {durable: false});

        ch.assertQueue('users_email', {exclusive: false}, (err, q) => {
            console.log('[*] Waiting for messages in %s', q.queue);
            ch.bindQueue(q.queue, ex, '')

            ch.consume(q.queue, (msg) => {
                console.log('email: revieced message from queue');
                console.log(msg.content.toString());
            }, {noAck: true});
        });
        
        
    })
});
