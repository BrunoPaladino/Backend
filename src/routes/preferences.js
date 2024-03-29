import { express } from "express";

const preferenceRouter = express.router();

preferenceRouter.post('/createPrefence', (req,res)=>{
    let preference = {
        items: [
            {
                title: req.body.description,
                unit_price: Number(req.body.price),
                quantity: Number(req.body.quantity),
            }
        ],
        back_urls: {
            "success": "http://localhost:8080/feedback",
            "failure": "http://localhost:8080/feedback",
            "pending": "http://localhost:8080/feedback"
        },
        auto_return: "approved",
    };
    }
);




mercadopago.preferences.create(preference)
    .then(function (response) {
        res.json({
            id: response.body.id
        });
    }).catch(function (error) {
        console.log(error);
    });
});

app.get('/feedback', function (req, res) {
res.json({
    Payment: req.query.payment_id,
    Status: req.query.status,
    MerchantOrder: req.query.merchant_order_id
});
});

app.listen(8080, () => {
console.log("The server is now running on Port 8080");
});