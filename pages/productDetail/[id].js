import { React, useState } from 'react'
import baseUrl from '../../helpers/baseUrl';
import { Card, Container, Button, Modal, Form, Toast, ToastContainer } from 'react-bootstrap';
import { useRouter } from 'next/router';
import { parseCookies } from 'nookies';
import cookie2 from 'js-cookie';

const Detail = ({ product }) => {

    const cookie = parseCookies()
    const user = cookie.user ? JSON.parse(cookie.user) : ""
    const router = useRouter();

    const [quantity, setquantity] = useState("1")
    const [showModal, setShowModal] = useState(false);
    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);

    const [showToast, setShowToast] = useState(false);
    const [message, setmessage] = useState("");
    const [color, setcolor] = useState("");

    const deletePost = async () => {
        const res = await fetch(`${baseUrl}/api/productDetail/${product._id}`, {
            method: "DELETE"
        })
        router.replace('/')
    }
    const addToCart = async () => {
        const res = await fetch(`${baseUrl}/api/cart`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": cookie.token
            },
            body: JSON.stringify({
                quantity,
                productId: product._id,
            })
        })
        const res2 = await res.json()
        if (res2.error) {
            setcolor("danger")
            setmessage(res2.error)
            setShowToast(true)
            cookie2.remove("user")
            cookie2.remove("token")
            setTimeout(() => {
                router.replace('/login')
            }, 2000);

        } else {
            setcolor("success")
            setShowToast(true)
            setmessage(res2.message);
        }
    }

    return (
        <Container className='d-flex justify-content-center mb-3'>
            <Card>
                <Card.Img variant="top" src={product.mediaUrl} style={{ height: "28rem" }} />

                {user ? <><Form.Group className="my-3 px-5" controlId="exampleForm.ControlInput1">
                    <Form.Control type="number" value={quantity} onChange={(e) => { setquantity(e.target.value) }} />
                    <div className='d-flex justify-content-center'><Button variant='primary' onClick={addToCart} className='my-3'>Add to cart</Button></div>
                </Form.Group>

                </> : <></>}

                <Card.Body>
                    <Card.Text>
                        {product.name}
                    </Card.Text>
                    <br />
                    <Card.Text>
                        {product.price}
                    </Card.Text>
                    <br />
                    <Card.Text>
                        {product.description}
                    </Card.Text>


                    {user.role == 'admin' && <div className='d-flex justify-content-end'><Button onClick={handleShow} variant="outline-danger">Delete</Button></div>}


                </Card.Body>
            </Card>

            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>

                </Modal.Header>
                <Modal.Body>Are you sure you want to delete this?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="danger" onClick={deletePost}>
                        Yes
                    </Button>
                </Modal.Footer>
            </Modal>

            <ToastContainer position="bottom-start" className='px-lg-5 mb-3 mx-5 text-white' >
                <Toast onClose={() => setShowToast(false)} show={showToast} delay={2000} bg={color}>
                    <Toast.Header>
                        <strong className="me-auto">Message</strong>
                        <small></small>
                    </Toast.Header>
                    <Toast.Body >{message}</Toast.Body>
                </Toast>
            </ToastContainer>
        </Container>
    )
}

export async function getServerSideProps({ params: { id } }) {
    const res = await fetch(`${baseUrl}/api/productDetail/${id}`, {
        method: "GET"
    });
    const data = await res.json()
    return {
        props: { product: data }
    }
}


export default Detail