import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { Form, Container, Button, Card, Toast, ToastContainer } from 'react-bootstrap'
import baseUrl from '../../helpers/baseUrl'

const Signup = () => {

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const [show, setShow] = useState(false);
    const [message, setmessage] = useState("");
    const [color, setcolor] = useState("");

    const router = useRouter();

    const signuphandler = async (e) => {
        e.preventDefault()
        const res = await fetch(`${baseUrl}/api/signup`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                email,
                password
            })
        });

        const res2 = await res.json();
        if (res2.error) {
            setcolor("danger")
            setmessage(res2.error)
            setShow(true)

        } else {
            setcolor("success")
            setShow(true)
            setmessage(res2.message);
            setTimeout(() => {
                router.replace('/login')
            }, 2000);
        }


    }

    return (
        <>
            <Container className='d-flex justify-content-center'>
                <Card style={{ width: "70%", padding: "2rem" }}>
                    <Form onSubmit={signuphandler}>
                        <Form.Group className="mb-3" >
                            <Form.Label>User name</Form.Label>
                            <Form.Control type="text" placeholder="Name" value={name} onChange={(e) => { setName(e.target.value) }} />
                        </Form.Group>
                        <Form.Group className="mb-3" >
                            <Form.Label>Email address</Form.Label>
                            <Form.Control type="email" placeholder="name@example.com" value={email} onChange={(e) => { setEmail(e.target.value) }} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label column sm="2">
                                Password
                            </Form.Label>
                            <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => { setPassword(e.target.value) }} />
                        </Form.Group>
                        <Button varient="primary" type="submit">Sign up</Button>
                    </Form>
                </Card>
                <ToastContainer position="bottom-start" className='px-lg-5 mb-3 mx-5 text-white' >
                    <Toast onClose={() => setShow(false)} show={show} delay={2000} bg={color}>
                        <Toast.Header>
                            <strong className="me-auto">Message</strong>
                            <small></small>
                        </Toast.Header>
                        <Toast.Body >{message}</Toast.Body>
                    </Toast>
                </ToastContainer>
            </Container>
        </>
    )
}

export default Signup;