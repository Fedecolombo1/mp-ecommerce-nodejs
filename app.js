const createError = require('http-errors');

const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

var express = require('express');
var exphbs  = require('express-handlebars');
var port = process.env.PORT || 3000

var app = express();
 
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(express.static('assets'));
 
app.use('/assets', express.static(__dirname + '/assets'));




app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.resolve(__dirname, '../public')));

const mercadopago = require("mercadopago")

mercadopago.configure({
    access_token: "APP_USR-6317427424180639-042414-47e969706991d3a442922b0702a0da44-469485398",
    integrator_id: "dev_24c65fb163bf11ea96500242ac130004"
})


app.get('/', function (req, res) {
    res.render('home');
});

app.get('/detail', function (req, res) {
    res.render('detail', req.query);
});

app.post("/comprar", function(req, res){
        /* preference = un carrito */
        let preference = {

            /*external_reference: {"colombofederico17@gmail.com"},*/

            payer:{
                name: "Lalo",
                surname: "Landa",
                email: "test_user_63274575@testuser.com",
                phone: {
                    area_code: "11",
                    number: 22223333
                },
                adress: {
                    zip_code: 1111,
                    street_name:"False",
                    street_number: 123
                }
            },

            payment_methods: {

                excluded_payment_methods: [
                    { id : "amex" }
                ],

                excluded_payment_types: [
                    { id : "atm" }
                ],

                installments: 6
            },

            items: [
                {
                    id: 1234,
                    picture_url:"https://mercadopago-fc.herokuapp.com/assets/samsung-galaxy-s9-xxl.jpg",
                    title: req.body.title,
                    description: "Dispositivo móvil de Tienda e-commerce",
                    unit_price: Number(req.body.price),
                    quantity: 1
                }
            ],

            external_reference:"colombofederico17@gmail.com",

            back_urls: {
                success: "https://mercadopago-fc.herokuapp.com/callback?status=success",

                pending: "https://mercadopago-fc.herokuapp.com/callback?status=pending",

                failure: "https://mercadopago-fc.herokuapp.com/callback?status=failure"
            },

            notification_url: "https://mercadopago-fc.herokuapp.com/notifications",

            /*back_urls: {
                success: "https://localhost3000/callback?status=success",

                pending: "https://localhost3000/callback?status=pending",

                failure: "https://localhost3000/callback?status=failure"
            },

            notification_url: "https://localhost3000/notifications",*/

            auto_return: "approved",
        }

        console.log(preference.items[0]);

        mercadopago.preferences.create(preference).then(response => {
            console.log(response);

            global.init_point = response.body.init_point

            res.redirect(global.init_point)
        }).catch(error =>{
            console.log(error);
            res.send("error")
        })

    
    })

    app.get("/callback", function(req, res){

        console.log(req.query);

        if(req.query.status.includes("success")){
            return res.render("success",{
                payment_type: req.query.payment_type,
                external_reference: req.query.external_reference,
                collection_id: req.query.collection_id
            })
        }
        if(req.query.status.includes("pending")){
            return res.render("pending")
        }
        if(req.query.status.includes("failure")){
            return res.render("failure")
        }
        
        return res.status(404).end()
    })

    app.post("/notifications", function(req, res){
        console.log("webhook", req.body);

        res.status(200).end("Ok")
    })

app.listen(port);


  
  module.exports = app;