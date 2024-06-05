var express = require('express')
var bodyparsser = require('body-parser')
var app = express()



var db = require('./model/db')
var pa = require("path")
app.set('view engine', 'ejs')
app.set('views', 'views')


app.use(express.urlencoded({ extended: false }))
var parser = bodyparsser.urlencoded({ extended: true })
const sessions = require('express-session');
const { Console } = require('console');
const { render } = require('express/lib/response');
const { name } = require('ejs')
const oneDay = 1000 * 60 * 60 * 24;


app.use(express.static(pa.join(__dirname, "static")))



var multer = require('multer')
const { isNull } = require('util')
const path = require('path')

app.use(sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: true,
    // store
}));

app.get('/', (req, res) => {
    res.render('login')
})

app.get('/insert', (req, res) => {
    res.render('insert')
})


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, pa.join(__dirname, "static", "images"))
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-'
        cb(null, uniqueSuffix + file.originalname)
    }
})
const upload = multer({ storage: storage })
app.get('/insert', (req, res) => {
    res.render('insert')
})

app.post('/upload', upload.single('myfile'), (req, res) => {

    console.log(req.file)
    console.log(req.body)
    res.render('show', [name = req.file.filename])


})
app.post("/login", parser, (req, res) => {
    var username = req.body.user
    var password = req.body.pass
    var s = req.session
    userid = req.body.user
    var s = "SELECT username FROM users WHERE username='" + username + "' AND password='" + password + "' ";
    if (username == 'admin' && password == '0000') {

        console.log(req.session)
        res.render('index', { title: 'aaa', name: userid })
    }
    else {
        db.query(s, (err, result) => {

            if (result!=0) {
                console.log(result)
                res.render('view', { title: 'aaa', name: userid })

            }
            else {
                console.log("not found")
            }

        })
    }

})
app.get('/index', (req, res) => {

    res.render('index')


})
app.get('/signup', (req, res) => {

    res.render('signup')


})
app.get('/search', (req, res) => {

    res.render('search')
})
app.get('/update', (req, res) => {

    res.render('update')
})
app.get('/view', (req, res) => {

    res.render('view')
})
app.post("/add_user", parser, (req, res) => {
    var user = req.body.user
    var password = req.body.password
    userid = req.body.user
    var p = "insert into users(username,password)values('" + user + "','" + password + "')"
    db.query(p, (err, result) => {
        console.log('added')
        res.render('view', { title: 'aaa', name: userid })

    })


})
app.post("/updatefood", parser, (req, res) => {
    var new_name = req.body.new_name
    var name = req.body.name
    var new_price = req.body.new_price
    
    var o = "'UPDATE food SET name='" + new_name +  "',price='" + new_price +  "')"  
    db.query(o, (err, result) => {

        if (!err) {
            res.send(result)
            console.log(result)
        }
        else {
            console.log(err)

            res.redirect("index")
        }
    })
})
app.post("/add_food", parser, (req, res) => {
    var name = req.body.name
    var price = req.body.price
    var q = "insert into menu (name,price)values(' " + name + "',' " + price + "')"
    db.query(q, (err, result) => {

        if (!err) {
            console.log(result.affectedRows)
        }
        else {
            console.log(err)

            res.redirect("index")
        }
    })
})

app.post('/search2', parser, (req, res) => {
    var t = req.body.name;
    var s = "SELECT * FROM menu WHERE name='" + t +"'";
 
    db.query(s, (err, result) => {
        if (result !=null) {
            console.log(result)
            
            res.send(result)
        }
        
        else {
           
         console.log("not found")
         res.send(err)
        }
    
})
})


app.get('/show', (req, res) => {
    var q = "SELECT * FROM menu";
    db.query(q, (err, result) => {
        if (!err) {


            res.send(result)
        }
        else {
            console.log(err)
            res.redirect("view")
        }
       
    })
})



app.listen(3000, () => {
    console.log("Server run !!!")
})