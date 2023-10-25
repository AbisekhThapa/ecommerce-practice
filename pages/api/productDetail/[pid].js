import initDB from '../../../helpers/initDB'
import Product from '../../../models/products'

initDB();

export default async function handler(req, res) {
    switch (req.method) {
        case "GET":
            await getProductdetail(req, res);
            break;
        case "DELETE":
            await deleteProductdetail(req, res);
            break;
    }
}

const getProductdetail = async (req, res) => {
    const { pid } = req.query;
    const product = await Product.findOne({ _id: pid })
    res.status(200).json(product)
}

const deleteProductdetail = async (req, res) => {
    const { pid } = req.query;
    await Product.findOneAndDelete({ _id: pid })
    res.status(200).json()

}