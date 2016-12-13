const express = require('express');

app = express();

app.get('/', (req, res) => {
    res.send('Hello World from piwik')
});

app.listen('5000')

const amqp = require('amqplib/callback_api');

amqp.connect('amqp://rabbit', (err, conn) => {
    if (err) {
        console.log(err);
    }

    conn.createChannel((err, ch) => {
        const ex = 'users';

        ch.assertExchange(ex, 'fanout', {durable: false});

        ch.assertQueue('', {exclusive: true}, (err, q) => {
            console.log('[*] Waiting for messages');
            ch.bindQueue(q.queue, ex, '')

            ch.consume(q.queue, (msg) => {
                console.log('piwik: revieced message from queue');
                console.log(msg.content.toString());
            }, {noAck: true});
        });
        
        
    })
});
