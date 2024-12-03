import { Navbar, Container } from "react-bootstrap";

export default function Header() {
  return (
    <Navbar expand='lg'>
      <Container>
        <img
          alt='book icon'
          className='mx-auto'
          height='100px'
          src='/book.svg'
          width='100px'
        />
      </Container>
    </Navbar>
  );
}
