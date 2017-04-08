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
            if (/[ก-๙]/.test(text))
                sendTextMessage(sender,"Type English only Please. กูอ่านไม่ออก WTF")
            else if (text === 'hi') {
                sendGenericMessage(sender)
            }
            // else sendTextMessage(sender, ""/*start text*/ + text.substring(0, 200))
            else reqSimsimi(sender, text)
        }
        if (event.postback) {
            text = JSON.stringify(event.postback)
            sendTextMessage(sender, "Postback received: "+text.substring(0, 200), token)
            continue
        }
    }
    res.sendStatus(200)
})

var token = "EAAK9e5TfD2kBAM9rh0sfvyqrJOYtPIwP3GNZCTHbwCxw2c9zCvtQNWIIkoIpyWi3eJYxqwnO9b7ZCVkYJl17Mlq0ZAcbpZC6JYBwfUSAoNG7GWCK2ALMCO31l39thJdVMXZAZAPSGYQlG7cPrcvPyUFYYWzJiz40uBh2F1yKJvZCgZDZD"

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
                    "title": "Ai Chat Bot Communities",
                    "subtitle": "Communities to Follow",
                    "image_url": "http://1u88jj3r4db2x4txp44yqfj1.wpengine.netdna-cdn.com/wp-content/uploads/2016/04/chatbot-930x659.jpg",
                    "buttons": [{
                        "type": "web_url",
                        "url": "https://www.facebook.com/groups/aichatbots/",
                        "title": "FB Chatbot Group"
                    }, {
                        "type": "web_url",
                        "url": "https://www.reddit.com/r/Chat_Bots/",
                        "title": "Chatbots on Reddit"
                    },{
                        "type": "web_url",
                        "url": "https://twitter.com/aichatbots",
                        "title": "Chatbots on Twitter"
                    }],
                },{
                    "title": "Learning More",
                    "subtitle": "Aking the Deep Questions",
                    "image_url": "http://www.brandknewmag.com/wp-content/uploads/2015/12/cortana.jpg",
                    "buttons": [{
                        "type": "postback",
                        "title": "AIML",
                        "payload": "Checkout Artificial Intelligence Mark Up Language. Its easier than you think!",
                    },{
                        "type": "postback",
                        "title": "Machine Learning",
                        "payload": "Use python to teach your maching in 16D space in 15min",
                    }, {
                        "type": "postback",
                        "title": "Communities",
                        "payload": "Online communities & Meetups are the best way to stay ahead of the curve!",
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
app.get('/test/:text',function(req,res){
    param = req.params.text
     // var url = "http://sandbox.api.simsimi.com/request.p?key=5dcc66e5-502c-4f8d-8d05-930c3d704188&lc=th&ft=1.0&text="+param
     var url = "http://www.simsimi.com/getRealtimeReq?uuid=x05UQevdOagK43juPwfg5pKmYFLXJD6t4UIQP2sEL7B&lc=th&ft=1&status=W&reqText="+param
    request(url, function(error, ress, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        }else if(ress.statusCode != 200){
            console.log("มึงพูดอะไร กูไม่เข้าใจ")
        }else{
            console.log(body);
            // var text = JSON.parse(body).response
            var text = JSON.parse(body).respSentence
            console.log(text)
        }
    })
});

//simsimi
function reqSimsimi(sender,text){
    // var url = "http://sandbox.api.simsimi.com/request.p?key=5dcc66e5-502c-4f8d-8d05-930c3d704188&lc=th&ft=1.0&text="+text
    var url = "http://www.simsimi.com/getRealtimeReq?uuid=x05UQevdOagK43juPwfg5pKmYFLXJD6t4UIQP2sEL7B&lc=th&ft=1&status=W&reqText="+text
    request(url, function(error, ress, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        }else if(ress.statusCode != 200){
            sendTextMessage(sender,"มึงพูดอะไร กูไม่เข้าใจ")
        }else{
            // var text = JSON.parse(body).response
            var text = JSON.parse(body).respSentence
            sendTextMessage(sender,text)
        }
    })
}

