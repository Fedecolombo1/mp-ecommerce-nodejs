var express = require('express');
var exphbs  = require('express-handlebars');
var port = process.env.PORT || 3000

var app = express();
 
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(express.static('assets'));
 
app.use('/assets', express.static(__dirname + '/assets'));


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
        let item = {
            id: "1",
            picture_url:"",
            title: "",
            price: "",
            description: "",
            unit_price: "",
            quantity: 1
        }
        /* preference = un carrito */
        let preference = {

            /*external_reference: {"colombofederico17@gmail.com"},*/

            payment_method: {

                payer:{
                    name: "Lalo",
                    surname: "Landa",
                    email: "test_user_63274575@testuser.com",
                    phone: {
                        area_code: "11",
                        number: "22223333"
                    },
                    adress: {
                        zip_code: 1111,
                        street_name:"False",
                        street_number: "123"
                    }
                },

                exluded_payment_methods: [
                    { id : "amex" }
                ],

                exluded_payment_types: [
                    { id : "atm" }
                ],

                installments: 6
            },

            items: [
                {
                    id: 1234,
                    picture_url:"https://mercadopagodh.herokuapp.com/images/products/jordan.jpg",
                    title: "nombre del producto",
                    price: 999,
                    description: "Dispositivo móvil de Tienda e-commerce",
                    unit_price: 999,
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

app.listen(port);