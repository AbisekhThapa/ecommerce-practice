import React from 'react'
import baseUrl from '../../helpers/baseUrl'
import { parseCookies } from 'nookies'
import { Container, ListGroup, ListGroupItem } from 'react-bootstrap'
import UserLists from '../../components/UserLists'

const Account = ({ orders }) => {
    const cookie = parseCookies()
    const user = cookie.user ? JSON.parse(cookie.user) : "";

    const UserInfo = () => {
        return (
            <Container >
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 50 }}>
                    <h5>{user.name}</h5>
                    <h5>{user.email}</h5>
                </div>
            </Container>
        )
    }

    const OrderHistory = () => {
        return (
            <>
                <div>

                    {orders.map(item => {

                        return (
                            <>

                                <div key={item._id} className='mb-5'>

                                    {item.products.map((pitem) => {

                                        return (
                                            <>
                                                <h5 key={pitem._id} className="mb-3 mt-3">
                                                    <ListGroup>
                                                        <ListGroup.Item disabled>Time : {item.createdAt}</ListGroup.Item>
                                                        <ListGroup.Item>{pitem.product.name}</ListGroup.Item>
                                                        <ListGroup.Item>{pitem.quantity} x {pitem.product.price}</ListGroup.Item>

                                                    </ListGroup>
                                                </h5>
                                            </>
                                        )
                                    })}
                                    <h3>Total {item.total}</h3>
                                    <hr />
                                </div>
                            </>
                        )
                    })}

                </div>
                {user.role == 'root' && <UserLists />}
            </>
        )
    }


    return (<>
        <h1>Account</h1>

        <UserInfo />
        <Container>
            <h2>Orders</h2>
            {
                orders.length == 0 ?
                    <h5>No orders</h5>
                    :
                    <>
                        <OrderHistory />
                    </>
            }
        </Container>

    </>
    )
}

export async function getServerSideProps(ctx) {
    const { token } = parseCookies(ctx)
    if (!token) {
        const { res } = ctx
        res.writeHead(302, { Location: "/login" })
        res.end()
    }
    const res = await fetch(`${baseUrl}/api/orders`, {
        headers: {
            "Authorization": token
        }
    })
    const res2 = await res.json()
    return {
        props: { orders: res2 }
    }
}

export default Account