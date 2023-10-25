import { useRouter } from 'next/router'
import { parseCookies } from 'nookies'
import React, { useState } from 'react'
import baseUrl from '../../helpers/baseUrl'
import { Button, Container, Toast, ToastContainer } from 'react-bootstrap'
import cookie2 from 'js-cookie'
import Link from 'next/link'
import StripeCheckout from 'react-stripe-checkout'


const Cart = ({ error, products }) => {


    // const [show, setShow] = useState(false);
    // const [message, setmessage] = useState("");
    // const [color, setcolor] = useState("");

    const [cProduct, setCProduct] = useState(products)

    const router = useRouter()

    const { token } = parseCookies()
    if (!token) {
        return (
            <>
                <div className='center mx-5'>
                    <h3>Please Login to add to cart</h3>
                    <Link href='/login'><Button variant="primary">Login</Button> </Link>
                </div>
            </>
        )
    }

    if (error) {
        // setcolor("danger")
        // setmessage(error)
        // setShow(true)
        cookie2.remove("user")
        cookie2.remove("token")
        router.push("/login")
        console.log("err")

    } else {
        // setcolor("danger")
        // setmessage(error)
        // setShow(true)
        console.log("no err")
    }

    const handleDelete = async (pid) => {
        const res = await fetch(`${baseUrl}/api/cart`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            },
            body: JSON.stringify({
                productId: pid
            })
        })
        const res2 = await res.json()
        setCProduct(res2)
    }



    const CartItem = () => {
        let price = 0
        return (
            <>
                <Container>

                    {
                        cProduct.map((item) => {
                            price = price + item.quantity * item.product.price
                            return (
                                <>
                                    <div className='py-3' style={{ display: "flex" }}>
                                        <div><img src={item.product.mediaUrl} style={{ height: "10rem", width: "10rem" }} /></div>
                                        <div className='p-3'>
                                            <h6>{item.product.name}</h6>
                                            <h6>{item.quantity} X {item.product.price}</h6>
                                            <Button variant='danger' onClick={() => { handleDelete(item.product._id) }}>Remove</Button>
                                        </div>
                                    </div>

                                </>)
                        })

                    }
                    <div className='d-flex justify-content-between mt-5'>
                        <h2>Total </h2>
                        <div className='d-flex'>
                            <h2 className='me-4'>
                                Rs {price} </h2>
                            {products.length > 0 ?
                                <StripeCheckout
                                    name="Test store"
                                    amount={price * 100}
                                    image={products.length > 0 ? products[0].product.mediaUrl : ""}
                                    currency="NPR"
                                    shippingAddress={true}
                                    billingAddress={true}
                                    zipCode={true}
                                    stripeKey="pk_test_51MZXbgDyrc57iIczII0la74lXZfo4gNVsrI8vAYc0rfHfyZZ2skSrAbFB3BXMaIbrPOrgFq3qYkGcTYkVXW8iyuD00Z4JfEjDl"
                                    token={(paymentInfo) => handleCheckout(paymentInfo)}
                                >

                                    <button className='btn btn-primary'>Check out</button>
                                </StripeCheckout> : ""}
                        </div>
                    </div>
                </Container>
            </>
        )
    }

    const handleCheckout = async (paymentInfo) => {
        // console.log(paymentInfo)
        const res = await fetch(`${baseUrl}/api/payment`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            },
            body: JSON.stringify({
                paymentInfo
            })
        })
        const res2 = await res.json()
        console.log(res2)
    }



    return (
        <>
            <Container><h2>Cart</h2></Container>

            <CartItem />




            {/* <ToastContainer position="bottom-start" className='px-lg-5 mb-3 mx-5 text-white' >
                <Toast onClose={() => setShow(false)} show={show} delay={2000} bg={color}>
                    <Toast.Header>
                        <strong className="me-auto">Message</strong>
                        <small></small>
                    </Toast.Header>
                    <Toast.Body >{message}</Toast.Body>
                </Toast>
            </ToastContainer> */}
        </>
    )
}

export async function getServerSideProps(ctx) {
    const cookie = parseCookies(ctx)
    if (!cookie.token) {
        return {
            props: { product: [] }
        }
    }

    const res = await fetch(`${baseUrl}/api/cart`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": cookie.token
        },
    })

    const products = await res.json()
    if (products.error) {
        return {
            props: { error: products.error }
        }
    }
    return {
        props: { products }
    }
}

export default Cart