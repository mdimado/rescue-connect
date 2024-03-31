import React,{useEffect} from "react";
import './footer.css'
import { Container, Row, Col, ListGroup, ListGroupItem } from "reactstrap";
import {Link} from "react-router-dom";

const Footer = () => {
  useEffect(()=>{
    window.scrollTo(0,0)
  })
  
  const year = new Date().getFullYear()
  return <footer className="footer">
    
  
    <Container>
      <Row>
        
        <Col className="text-center social" lg='12'>
        <p className="socialp">
          <a href="https://www.instagram.com/mdimado/?hl=en" target="_blank" rel="noopener noreferrer">
            <i className="ri-instagram-line"></i>
          </a>
          <a href="https://www.instagram.com/abhiram.reddy_29/?hl=en" target="_blank" rel="noopener noreferrer">
          <i className="ri-instagram-line"></i>
          </a>
          <a href="https://www.instagram.com/am.i.not.ok/?hl=en" target="_blank" rel="noopener noreferrer">
          <i className="ri-instagram-line"></i>
          </a>
          
        </p>
        </Col>





        <Col lg='12'>
          <p className="footer__copyright">A <i class="ri-copyright-line"></i> {year} All rights reserved. </p>
          
        </Col>
      </Row>
    </Container>
  </footer>
};

export default Footer;