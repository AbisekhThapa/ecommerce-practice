import Stripe from "stripe";
import { v4 as uuidv4 } from 'uuid';
import Cart from '../../models/cartSchema';
import jwt from "jsonwebtoken";
import Order from '../../models/orderSchema';

const stripe = Stripe(process.env.STRIPE_SECRET)

export default async function handler(req, res) {
    const { authorization } = req.headers
    const { paymentInfo } = req.body
    // console.log(paymentInfo)
    if (!authorization) {
        return res.status(401).json({ error: "you must login" })
    }
    try {
        const { userId } = jwt.verify(authorization, process.env.JWT_SECRET)
        const cart = await Cart.findOne({ user: userId })
            .populate("products.product")
        let price = 0
        cart.products.forEach(item => {
            price = price + item.quantity * item.product.price
        })
        const prevCustomer = await stripe.customers.list({
            email: paymentInfo.email
        })
        const isExistingCustomer = prevCustomer.data.length > 0
        let newCustomer
        if (!isExistingCustomer) {
            newCustomer = await stripe.customers.create({
                email: paymentInfo.email,
                source: paymentInfo.id
            })
        }
        await stripe.charges.create(
            {
                currency: "NPR",
                amount: price * 100,
                receipt_email: paymentInfo.email,
                customer: isExistingCustomer ? prevCustomer.data[0].id : newCustomer.id,
                description: `you purchased a product (${paymentInfo.email})`
            },
            {
                idempotencyKey: uuidv4(),
            }
        )
        await new Order({
            user: userId,
            email: paymentInfo.email,
            total: price,
            products: cart.products
        }).save()
        await Cart.findOneAndUpdate(
            { _id: cart._id },
            { $set: { products: [] } }
        )
        res.status(200).json({ message: "Payment successful" })
    } catch (err) {
        console.log(err)
        return res.status(401).json({ error: err })
    }

}