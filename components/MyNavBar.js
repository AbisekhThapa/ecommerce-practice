import Link from 'next/link';
import React from 'react'
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown'
import { parseCookies } from 'nookies';
import { useRouter } from 'next/router';
import cookie from 'js-cookie'

const MyNavBar = () => {

    const router = useRouter()

    const usercookie = parseCookies()
    // console.log(usercookie)
    const user = usercookie.user ? JSON.parse(usercookie.user) : ""
    // console.log(user)
    return (
        <>

            <Navbar className='mb-4' bg="light" expand="lg">
                <Container fluid className='mx-lg-5 px-lg-5'>
                    <Navbar.Brand href="/" className='pe-5'>Logo</Navbar.Brand>
                    <Navbar.Toggle aria-controls="navbarScroll" />
                    <Navbar.Collapse id="navbarScroll">
                        <Nav
                            className=" mx-auto my-2 my-lg-0 "
                            style={{ maxHeight: '280px' }}
                            navbarScroll
                        >
                            <Nav.Link as={Link} href="/">Home</Nav.Link>
                            <NavDropdown title="Categories" id="navbarScrollingDropdown">
                                <NavDropdown.Item href="#action3">Furniture</NavDropdown.Item>
                                <NavDropdown.Item href="#action4">
                                    Electronics
                                </NavDropdown.Item>
                                <NavDropdown.Item href="#action5">
                                    Home Appliances
                                </NavDropdown.Item>
                            </NavDropdown>
                            <Nav.Link as={Link} href="/service">
                                Services
                            </Nav.Link>
                            <Nav.Link href="#" >
                                About us
                            </Nav.Link>
                            <Nav.Link as={Link} href="/cart">
                                Cart
                            </Nav.Link>
                            {(user.role == 'admin' || user.role == 'root') && <Nav.Link as={Link} href="/create">
                                Create
                            </Nav.Link>}

                            {user ?
                                <>

                                    <Nav.Link as={Link} href="/account">
                                        Account
                                    </Nav.Link>

                                </>
                                :
                                <>
                                    <Nav.Link as={Link} href="/signup">
                                        Sign up
                                    </Nav.Link>
                                    <Nav.Link as={Link} href="/login">
                                        Log in
                                    </Nav.Link>
                                </>}



                        </Nav>
                        {user ? <><Button className='me-3' variant="outline-danger" onClick={(e) => {
                            cookie.remove('token')
                            cookie.remove('user')
                            router.replace('/login')
                        }}>
                            logout
                        </Button></> : <></>}
                        <Form className="d-flex">
                            <Form.Control
                                type="search"
                                placeholder="Search"
                                className="me-2"
                                aria-label="Search"
                            />
                            <Button variant="outline-primary">Search</Button>
                        </Form>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    )
}

export default MyNavBar