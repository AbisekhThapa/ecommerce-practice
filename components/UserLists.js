import { parseCookies } from 'nookies';
import React, { useEffect, useState } from 'react'
import baseUrl from '../helpers/baseUrl';
import { Button, Table } from 'react-bootstrap';


const UserLists = () => {

    const { token } = parseCookies()

    const [user, setUser] = useState([""])

    useEffect(() => {
        fetchUsers();
    }, [])

    const fetchUsers = async () => {
        const res = await fetch(`${baseUrl}/api/users`, {
            method: "GET",
            headers: {
                "Authorization": token
            }
        })
        const res2 = await res.json()
        // console.log(res2)
        setUser(res2)
    }

    const handleRole = async (_id, role) => {
        const res = await fetch(`${baseUrl}/api/users`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            },
            body: JSON.stringify({
                _id,
                role
            })
        })
        const res2 = await res.json()
        // console.log(res2.role)
        const updateUser = user.map(item => {
            if ((item.role != res2.role) && item.email == res2.email) {
                return res2
            } else {
                return user
            }
        })
        setUser(updateUser)
    }

    return (
        <>
            <div>UserLists</div>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        user.map((item) => {
                            return (
                                <>
                                    <tr key={item._id}>
                                        <td>{item.name}</td>
                                        <td>{item.email}</td>
                                        <td><Button variant='outline-success' onClick={() => { handleRole(item._id, item.role) }}>{item.role}</Button> </td>
                                    </tr>
                                </>
                            )
                        })

                    }
                </tbody>
            </Table>
        </>

    )
}

export default UserLists