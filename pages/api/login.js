import User from '../../models/userSchema'
import initDB from '../../helpers/initDB';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

initDB();

export default async function handler(req, res) {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(422).json({ error: "Please add all the fields." })
        }
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json({ error: "Email does not exist." })
        }
        const doMatch = await bcrypt.compare(password, user.password)
        if (doMatch) {
            const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" })
            const { name, role, email } = user;
            // console.log({ name, role, email })
            res.status(201).json({ token, user: { name, role, email } })
        } else {
            return res.status(404).json({ error: "Email or password not matched." })
        }

    } catch (e) {
        console.log(e);
    }
}