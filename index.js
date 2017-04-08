var express = require('express')
var bodyParser = require('body-parser')
var request = require('request')
var app = express()

app.set('port', (process.env.PORT || 3000))
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

// Index route
app.get('/', function (req, res) {
    res.send('Hello world, I am a chat bot')
})
// for Facebook verification
app.get('/webhook/', function (req, res) {
    if (req.query['hub.verify_token'] === 'testnaja') {
        res.send(req.query['hub.challenge'])
    }
    res.send('Error, wrong token')
})
// Spin up the server
app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
})

// API End Point - added by Stefan
app.post('/webhook/', function (req, res) {
    messaging_events = req.body.entry[0].messaging
    for (i = 0; i < messaging_events.length; i++) {
        event = req.body.entry[0].messaging[i]
        sender = event.sender.id
        if (event.message && event.message.text) {
            text = event.message.text
            if (text === 'hi') {
                sendGenericMessage(sender)
            }
            // else sendTextMessage(sender, ""/*start text*/ + text.substring(0, 200))
            else if(text === 'Postback received: {"payload":"request"}'){
                userrequest(sender)
            }
            else sendTextMessage(sender,text)
        }
        if (event.postback) {
            text = JSON.stringify(event.postback)
            sendTextMessage(sender, "Postback received: "+text.substring(0, 200), token)
            continue
        }
    }
    res.sendStatus(200)
})

var token = "EAAFZBPZA9asOQBAFdYHrnkv4m0APYjGBU0BZBuzDKbU0nO2OyLJ1i156GyZABHldBm9OZC4XqFfSQOXBn81LS1tEEVuyB6gRXZBM6lMOYktwbRDQFY7M6uMqABl5BDg5pvYCvUEIxnxQOlQzMRucHWMB2JMkehQC31ZBLEU2gXLhwZDZD"

// function to echo back messages - added by Stefan
function sendTextMessage(sender, text) {
    messageData = {text}
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}


// Send an test message back as two cards.
function sendGenericMessage(sender) {
    messageData = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "Payment with yours - Chatbot",
                    "subtitle": "Payment with yours - Chatbot",
                    "image_url": "https://s-media-cache-ak0.pinimg.com/736x/87/e4/6e/87e46e397be2ce9d430126d8b4e5a29f.jpg",
                    "buttons": [{
                        "type": "postback",
                        "title": "ดูรายจ่าย",
                        "payload": "request",
                    },{
                        "type": "postback",
                        "title": "ขอคำแนะนำ",
                        "payload": "recoment",
                    }, {
                        "type": "postback",
                        "title": "ติดต่อเรา",
                        "payload": "contact",
                    }],
                }]  
            } 
        }
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}

function userrequest(sender) {
    messageData = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "รายจ่าย",
                    "subtitle": "Payment with yours - Chatbot",
                    "image_url": "https://s-media-cache-ak0.pinimg.com/736x/87/e4/6e/87e46e397be2ce9d430126d8b4e5a29f.jpg",
                    "buttons": [{
                        "type": "postback",
                        "title": "รายวัน",
                        "payload": "day",
                    },{
                        "type": "postback",
                        "title": "รายเดือน",
                        "payload": "month",
                    }, {
                        "type": "postback",
                        "title": "ทั้งหมด",
                        "payload": "all",
                    }],
                }]  
            } 
        }
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}

