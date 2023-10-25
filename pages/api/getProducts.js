import initDB from '../../helpers/initDB';
import Products from '../../models/products'

initDB();

export default async function handler(req, res) {
    switch (req.method) {
        case "GET":
            await getallProduct(req, res);
            break;
        case "POST":
            await saveProduct(req, res);
            break;
    }
}

const getallProduct = async (req, res) => {
    try {
        const products = await Products.find()
        res.status(200).json(products)
    } catch (err) {
        res.status(500).json({ error: "server error" })
    }

}

const saveProduct = async (req, res) => {
    const { name, price, description, category, mediaUrl } = req.body;
    try {
        if (!name || !price || !description || !category || !mediaUrl) {
            return res.status(422).json({ error: "Please fill all the fields" })
        }
        const product = await new Products({
            name,
            price,
            category,
            description,
            mediaUrl,
        }).save()
        res.status(201).json(product)
    } catch (err) {
        res.status(500).json({ error: "internal server error" })
        console.log(err)
    }

}