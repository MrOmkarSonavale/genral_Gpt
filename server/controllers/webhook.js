import { request, response } from "express";
import Stripe from "stripe";
import Transaction from "../models/transcation.js";
import User from "../models/user.js";

export const stripeWebHook = async (req, res) => {
    const stripe = new Stripe(process.env.STRIPE_SEC_KEY);

    const sig = request.headers["stripe-signature"];

    let event;

    try {
        event = stripe.webhooks.constructEvent(request.body, sig, process.env.STRIPE_WEB_HOOK_SEC);
    } catch (error) {
        return response.status(400).send('webhook error' + error.message);
    };


    try {
        switch (event.type) {
            case "payment_intent.succeeded": {
                const paymentIntent = await stripe.checkout.sessions.list({
                    payment_intent: paymentIntent.id,
                });

                const session = sessionList.data[0];
                const { transactionId, appId } = session.metadatal

                if (appId === 'genralgpt') {
                    const transaction = await Transaction.findOne({
                        transactionId, isPaid: false
                    });

                    await User.updateOne({ _id: transaction.userId }, {
                        $inc: { credits: transaction.credits }
                    })

                    transaction.isPaid = true;
                    await transaction.save();
                } else {
                    return response.json({
                        recevied: true,
                        message: "Ignored Event: Invalid app"
                    });

                }

                break;
            }
            default:
                console.log("Unhandeled event type", event.type);
        }

        response.json({ recevied: true });
    } catch (err) {
        console.error("Webhook processing error");
        response.status(500).send("internal server error");
    }
};