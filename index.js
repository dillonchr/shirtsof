const fs = require('fs');
const express = require('express');
const app = express();
const fetch = require('@dillonchr/fetch');
const bodyParser = require('body-parser');
const crypto = require('crypto');

app.use(express.static('public'));
app.use(bodyParser.json({extended: false}));

app.post('/subscribe', (req, res) => {
    try {
        const { fname, lname, email } = req.body;

        const apiKey = process.env.API_KEY;
        const listId = process.env.LIST_ID;
        const dataCenter = apiKey.substr(apiKey.indexOf('-') + 1);
        const md5 = crypto.createHash('md5').update(email.trim().toLowerCase()).digest('hex');
        const url = `https://${dataCenter}.api.mailchimp.com/3.0/lists/${listId}/members/${md5}`;
        const payload = {
            email_address: email,
            status: 'subscribed',
            merge_tags: {
                FNAME: fname,
                LNAME: lname
            }
        };

        fetch({
            url,
            method: 'PUT',
            body: payload,
            headers: {
                Authorization: 'Basic ' + Buffer.from(`user:${apiKey}`).toString('base64')
            }
        }, (err, data) => {
            if (err) {
                console.error('ERROR', err);
                res.status(500);
                res.send('sorry');
            } else {
                if (data.status && data.status > 200) {
                    res.status(data.status);
                    res.send(data.title);
                } else {
                    res.send('ok');
                }
            }
        });

    } catch(err) {
        console.error('Fetch fail', err);
        res.status(400);
        res.send('data bad');
    }
});

app.listen(process.env.PORT || 3030);
