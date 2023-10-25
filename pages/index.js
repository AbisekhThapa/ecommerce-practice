import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row'
import { Button, Container } from 'react-bootstrap';
import Link from 'next/link';
import baseUrl from '../helpers/baseUrl';

const Home = ({ products }) => {
  const productList = products.map((product) => {
    return (
      <div key={product._id}>
        <Col>
          <Card style={{ width: '20rem' }}>
            <Card.Img variant="top" src={product.mediaUrl} style={{ height: '15rem' }} />
            <Card.Body>
              <Card.Title>{product.name}</Card.Title>
              <Card.Text>
                Rs {product.price}
              </Card.Text>
              <Link href={`/productDetail/${product._id}`}><Button varient="primary">View detail</Button> </Link>
            </Card.Body>
          </Card>
        </Col>
      </div>
    )
  })

  return (
    <>
      <Container className='mb-4'>
        <Row xs={1} md={2} xl={3} className="g-4">{productList}
        </Row></Container>

    </>
  )
}

export async function getStaticProps(context) {
  const res = await fetch(`${baseUrl}/api/getProducts`);
  const data = await res.json()
  return {
    props: { products: data },
  }
}

export default Home;