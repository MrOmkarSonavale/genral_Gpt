import Stripe from "stripe";
import Transaction from "../models/transcation.js";
import User from "../models/user.js";

export const stripeWebHook = async (req, res) => {
    const stripe = new Stripe(process.env.STRIPE_SEC_KEY);

    const sig = req.headers["stripe-signature"];
    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEB_HOOK_SEC
        );

        console.log("Webhook hit");
        console.log("Event type:", event.type);

    } catch (error) {
        return res.status(400).send("Webhook Error: " + error.message);
    }

    try {
        switch (event.type) {
            case "payment_intent.succeeded": {

                const paymentIntent = event.data.object;

                const sessionList = await stripe.checkout.sessions.list({
                    payment_intent: paymentIntent.id,
                });

                const session = sessionList.data[0];

                if (!session) {
                    return res.status(400).json({ message: "Session not found" });
                }

                const { transactionId, appId } = session.metadata;

                if (appId !== "genralgpt") {
                    return res.json({
                        received: true,
                        message: "Ignored Event: Invalid app",
                    });
                }

                const transaction = await Transaction.findOne({
                    transactionId,
                    isPaid: false,
                });

                if (!transaction) {
                    return res.status(404).send("Transaction not found");
                }

                await User.updateOne(
                    { _id: transaction.userId },
                    { $inc: { credits: transaction.credits } }
                );

                transaction.isPaid = true;
                await transaction.save();

                break;
            }

            default:
                console.log("Unhandled event type:", event.type);
        }

        res.json({ received: true });

    } catch (err) {
        console.error("Webhook processing error:", err);
        res.status(500).send("Internal server error");
    }
};