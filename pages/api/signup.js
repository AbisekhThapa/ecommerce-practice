import User from '../../models/userSchema'
import Cart from '../../models/cartSchema'
import initDB from '../../helpers/initDB';
import bcrypt from 'bcryptjs';

initDB();

export default async function handler(req, res) {
    const { name, email, password } = req.body;
    try {
        if (!name || !email || !password) {
            return res.status(422).json({ error: "Please add all the fields" })
        }
        const user = await User.findOne({ email })
        if (user) {
            return res.status(422).json({ error: "Email already exist." })
        }
        const hassedPassword = await bcrypt.hash(password, 12)
        const newUser = await new User({
            name,
            email,
            password: hassedPassword,
        }).save()

        await new Cart({
            user: newUser._id
        }).save()

        res.status(201).json({ message: "Signup successfull and redirecting" })
    } catch (e) {
        console.log(e);
    }
}