import initDb from '../../helpers/initDB';
import Order from '../../models/orderSchema'
import Authenticated from '../../helpers/authenticated'

initDb()

export default Authenticated(async (req, res) => {
    const orders = await Order.find({
        user: req.userId,
    }).populate("products.product")
    res.status(200).json(orders)
})

