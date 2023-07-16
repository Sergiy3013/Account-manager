// Modules
const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const fs = require('fs');
const crypt = require('./modules/crypt.js');


const PORT = 3000;
const dbFile = './DB/db.json';


// EJS
app.engine('ejs', require('ejs-locals'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(bodyParser.json());

app.use("/img", express.static(__dirname + "/views/img"));
app.use("/styles", express.static(__dirname + "/views/styles"));
app.use("/js", express.static(__dirname + "/views/js"));


var db = require(dbFile);

// Services page
app.get('/', function (req, res) {
    res.render('index', {
        title: 'Home page',
        menu: db.services,
        services: db.services,
        links: db.links
    })
})
// Adding a service
app.post('/services/add/', function (req, res) {
    var new_service = req.body;
    if (db.links.includes(new_service.code)) {
        res.send('Add new services. FAILED!');
        return false
    }

    db.links.push(new_service.link);
    db.auth_data[new_service.link] = [];
    db.services.push(new_service);

    dbupdate(db);
    res.send('Add new services. SUCCESS!');
});
// Delete the service
app.post('/services/remove/', function (req, res) {
    var service_link = req.body.link;
    if (db.links.includes(service_link)) {
        var servide_id = db.links.indexOf(service_link);

        db.links.splice(servide_id, 1)
        db.services.splice(servide_id, 1)
        if (db.auth_data[service_link]) db.auth_data[service_link] = undefined;
        dbupdate(db);
        res.send('Remove services. SUCCESS!');
    } else {
        res.send('Remove services. FAILED!');
    }
});
// Changing the service
app.post('/services/edit/', function (req, res) {
    var service_link = req.body.link;
    var service_old_link = req.body.old_link;

    if (db.links.includes(service_old_link)) {
        var servide_id = db.links.indexOf(service_old_link);

        db.services[servide_id] = {
            title: req.body.title,
            link: service_link,
            icon: req.body.icon
        }
        db.links[servide_id] = service_link;

        dbupdate(db);
        res.send('Edit services. SUCCESS!');
    } else {
        res.send('Edit services. FAILED!');
    }
});

// Service page with accounts
app.get('/services/:service', function (req, res) {
    var service = req.params.service;
    if (db.links.includes(service)) {
        var pass = req.query.pass
        if (db.auth_data[service]) {
            res.render('service', {
                title: service,
                data: db.auth_data[service],
                menu: db.services || [],
                links: db.links,
                img: db.services[db.links.indexOf(service)].icon
            })
        } else {
            res.render('service', {
                title: service,
                data: [],
                links: db.links,
                img: db.services[db.links.indexOf(service)].icon
            })  
        }
    }
})

// Добавление аккаунта
app.post('/services/:service/add/', function (req, res) {
    var service = req.params.service;
    var new_acc = req.body;
    // console.log(service, new_acc)
    var cryptPass = crypt.encrypt(new_acc.pass, new_acc.key)
    if (!db.auth_data[service]) db.auth_data[service] = [];

    db.auth_data[service].push({ login: new_acc.login, pass: cryptPass, stat: new_acc.stat, comment: new_acc.comment})

    dbupdate(db);
});
// Changing the account
app.post('/services/:service/update/', function (req, res) {
    var service = req.params.service;
    var new_acc = req.body;
    var cryptPass = false
    if (new_acc.key != "" || new_acc.key.trim() != "") {cryptPass = crypt.encrypt(new_acc.pass, new_acc.key)
    }
    if (!db.auth_data[service]) db.auth_data[service] = [];

    db.auth_data[service].forEach(el => {
        if (el.login == new_acc.login){
            if (cryptPass) el.pass = cryptPass;
            el.stat = new_acc.stat;
            el.comment = new_acc.comment;
        }
    });
    dbupdate(db);
});

// Delete the account
app.post('/services/:service/remove/', function (req, res) {
    var service = req.params.service;
    var st = req.body;
    if (db.auth_data[service][st.id].login == st.login) {
        db.auth_data[service].splice(st.id, 1)
        dbupdate(db);
        res.send('Remove account. SUCCESS!');
        return true
    }
    res.send('Remove account. FAILED!');
    return false
});
// View the password
app.get('/pass/:pass/:key/', function (req, res) {
    var krpass = req.params.pass;
    var key = req.params.key;
    var pass = crypt.decrypt(krpass, key);
    // console.log(pass);
    res.send({ pass: pass });
})

app.post('/crypt/encrypt/', function (req, res) {
    var data = req.body;
    console.log(crypt.encrypt(data.key, data.pass));

    res.send('Response');
    return false
});

app.post('/crypt/decrypt/', function (req, res) {
    var data = req.body;
    var result = crypt.decrypt(data.key, data.pass);
    if (result) {
        res.send(`{"status": true, "data": "${result}"}`);
        return true;
    }
    res.send(false);
    return false;
});

// 404
app.get('/*', function (req, res) {
    res.send("<h1>404</h1><br><h2>Тут ничего нет!</h2>");
});

app.listen(PORT, () => console.log(`Started server at http://localhost:` + PORT));



// dbupdate(db)
function dbupdate(data) {
    fs.writeFile(dbFile, JSON.stringify(data), (err) => {
        if (err) { console.error(err); return; };
        console.log("DB has been updated");
    });
}

