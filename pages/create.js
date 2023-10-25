import React, { useState } from 'react'
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import { Button, Figure, Toast, ToastContainer } from 'react-bootstrap';
import baseUrl from '../helpers/baseUrl';
import { parseCookies } from 'nookies';
import cookie from 'js-cookie'

const Create = () => {
    const [name, setname] = useState("");
    const [price, setprice] = useState("");
    const [description, setdescription] = useState("");
    const [category, setcategory] = useState("");
    const [media, setmedia] = useState(null);
    const [show, setShow] = useState(false);
    const [message, setmessage] = useState("");
    const [color, setcolor] = useState("");


    const addHandle = async (e) => {
        e.preventDefault()
        const mediaUrl = await imageUpload()
        const res = await fetch(`${baseUrl}/api/getProducts`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name,
                price,
                category,
                description,
                mediaUrl,
            })
        })

        const res2 = await res.json()
        if (res2.error) {
            setcolor("danger")
            setmessage("Please enter all the fields above.")
            setShow(true)

        } else {
            setcolor("success")
            setShow(true)
            setmessage("Successfully product added")
        }
        setname("")
        setprice("")
        setdescription("")
        setcategory("")
        setmedia(null)
    }

    const imageUpload = async () => {
        const data = new FormData()
        data.append('file', media)
        data.append('upload_preset', "practiceimg")
        data.append('cloud_name', "ddnaszm8n")
        const res = await fetch('https://api.cloudinary.com/v1_1/ddnaszm8n/image/upload', {
            method: "POST",
            body: data
        })
        const res2 = await res.json()
        return res2.url;
    }

    const handleFileChange = (event) => {
        // resetting the file input
        event.target = null;
    };

    return (
        <>
            <Container>
                <Form onSubmit={addHandle}>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>Name of Product</Form.Label>
                        <Form.Control type="text" placeholder="Name" value={name} onChange={(e) => { setname(e.target.value) }} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>Price of Product</Form.Label>
                        <Form.Control type="number" placeholder="Price" value={price} onChange={(e) => { setprice(e.target.value) }} />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                        <Form.Label>Description</Form.Label>
                        <Form.Control as="textarea" rows={3} placeholder="Description" value={description} onChange={(e) => { setdescription(e.target.value) }} />
                    </Form.Group>
                    <Form.Select aria-label="Category" value={category} onChange={(e) => { setcategory(e.target.value) }}>
                        <option>Select Category</option>
                        <option value="Electronics">electronics</option>
                        <option value="Home-appliances">Home appliances</option>
                        <option value="furniture">Furniture</option>
                    </Form.Select>
                    <br />
                    <Form.Group className="mb-3">
                        <Form.Label>Select image</Form.Label>
                        <Form.Control type="file" accept='image/*' onChange={(e) => {
                            setmedia(e.target.files[0]);
                            handleFileChange
                        }} />
                    </Form.Group>
                    <Figure>
                        {media ? <>
                            <Figure.Image
                                width={171}
                                height={180}
                                alt="171x180"
                                src={media ? URL.createObjectURL(media) : ""}
                            />
                        </> : <></>}
                    </Figure><br />
                    <Button type="submit" varient="primary">Add Product</Button>
                </Form>
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

export async function getServerSideProps(ctx) {
    const usercookie = parseCookies()
    console.log(usercookie)
    const user = usercookie.user ? JSON.parse(cookie.user) : ""
    if (user.role != 'admin') {
        const { res } = ctx
        res.writeHead(302, { Location: "/" })
        res.end()
    }
    return {
        props: {}
    }
}

export default Create