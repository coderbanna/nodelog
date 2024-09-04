// Create express app
var express = require("express")
var app = express()
var db = require("./database.js")
var md5 = require("md5")

var bodyParser = require("body-parser");
// Set a higher limit for bodyParser
app.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use('/', express.static('public'));

// Set EJS as templating engine
app.set('view engine', 'ejs');

// Server port
var HTTP_PORT = 8000
// Start server
app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%", HTTP_PORT))
});
// Root endpoint
app.get("/", (req, res, next) => {
    res.json({ "message": "Ok" })
});

// Insert here other API endpoints

app.get("/logs", (req, res, next) => {
    var sql = "select * from logs ORDER by id DESC"
    var params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }

        var final = [];
        rows.forEach(element => {
            element.logmsg = Buffer.from(element.logmsg, 'base64').toString('utf-8');
            element.logmsg = element.logmsg.substring(0, 100);
            final.push(element);
        });

        res.render('logs', { data: final });
    });
});

app.get("/log/:id", (req, res, next) => {
    var sql = "select * from logs where log_hash = ?"
    var params = [req.params.id]
    db.get(sql, params, (err, row) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }

        row.logmsg = Buffer.from(row.logmsg, 'base64').toString('utf-8');

        res.render('singlelog', { data: row });
      });
});

app.post("/reporting/log/", (req, res, next) => {
    var errors=[]

    var logmsg = req.body.data;
    var title = req.body.title;
    var type = req.body.type;
    var domain = req.body.domain;
    var subdomain = req.body.subdomain;

    var log_hash = md5(logmsg);
    // if (!req.body.password){
    //     errors.push("No password specified");
    // }
    // if (!req.body.email){
    //     errors.push("No email specified");
    // }
    // if (errors.length){
    //     res.status(400).json({"error":errors.join(",")});
    //     return;
    // }

    var sql ='INSERT INTO logs (logmsg, title, domain, subdomain, log_hash) VALUES (?,?,?,?,?)'
    var params =[logmsg, title, domain, subdomain, log_hash]
    db.run(sql, params, function (err, result) {
        if (err){
            console.log(err.message);
            res.status(400).json({"error": err.message})
            return;
        }
    });

    res.json({
                "message": "success",
                "data": []
            })
})

// Default response for any other request
app.use(function (req, res) {
    res.status(404);
});
