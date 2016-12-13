Nodrit
======

_Nodrit is a combination of node and rabbit(mq)_


This repo is for testing event based messaging system using 
rabbit and mulitplie node services, all in docker.

## What are we trying to do here?

There is one "sender" service, `user_service`, which exposes
an endpoint `http://<docker-ip>:4000`. On a request it will emit
the event `new_user_created` on the rabbit exchange `users`.

The other services - email and piwik - emulates recieving services.
They listen on the `users` exchage and processes the messages published there.

A part of the experiment is to have an exchage and then named queues, which would ensure
that only one worker will pick up events published on that named queue.
This is interesting since we need to be able to scale services without being worried that
the same kind of services picks up the same event.

> An example of this can be seen in the email_service.

The rabbit setup looks like this in ASCII art

```
        +-------------+
        |user_service |
        +-------------+  
              | |
              | |
               V
        +-------------+
        |  EXCHANGE   |
        +-------------+
           /          \
          /            \
         /              \
        /                \
    un-named queue        named queue "users_email"
    all piwik services    several workers
    will perform work     only one will pick up one specific event             
```

# Run it


To run with mulitplie email services (3 in this example)

```
docker-compose build
docker-compose up -d
docker-compose scale email_service=3
docker-compose logs  # to see which services that pick up events from bus

**In another terminal instance**

curl http://$(docker-machine ip):4000  # will post event
```

You will see that the events are routed to the email service in a round robbin fashion.

To add more piwik services (and see that they all pick up the published event)
execute (in first terminal instance)

```
docker-compose scale piwik_service=3
docker-compose logs  # to see which services that pick up events from bus
```

## Example Output

```
user_service_1  | sent new_user_created
piwik_service_3 | piwik: revieced message from queue
piwik_service_1 | piwik: revieced message from queue
piwik_service_2 | piwik: revieced message from queue
email_service_1 | email: revieced message from queue
email_service_1 | new_user_created
piwik_service_2 | new_user_created
piwik_service_3 | new_user_created
piwik_service_1 | new_user_created
```

### A Quick Proof of Concept

I just threw this thing together very fast to test some concepts, mostly Docker <-> rabbit <-> node.
Efficient and stable code is not priotized ;)

Enjoy!
