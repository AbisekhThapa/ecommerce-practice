import Authenticated from "../../helpers/authenticated";
import User from "../../models/userSchema"
import initDB from "../../helpers/initDB";

initDB();

export default async function handler(req, res) {
    switch (req.method) {
        case "GET":
            await fetchUser(req, res)
            break;
        case "PUT":
            await changeRole(req, res)
            break
    }

}

const fetchUser = Authenticated(async (req, res) => {

    const users = await User.find({ _id: { $ne: req.userId } })
    res.status(200).json(users)

})

const changeRole = Authenticated(async (req, res) => {

    const { _id, role } = req.body
    const newRole = role == 'user' ? "admin" : "user"
    const user = await User.findOneAndUpdate(
        { _id },
        { role: newRole },
        { new: true }
    )
    res.status(200).json(user)
})