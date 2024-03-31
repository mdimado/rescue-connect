import React, { useState } from "react";
import Helmet from '../components/Helmet/Helmet';
import { Container, Row, Col, Form, FormGroup } from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase.config";
import { toast } from 'react-toastify';
import '../styles/login.css';
import googleimg from '../assets/images/google.png'

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const signIn = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      setLoading(false);
      toast.success('Login successful');
      navigate('/cart');
    } catch (error) {
      setLoading(false);
      toast.error(error.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;

      setLoading(false);
      toast.success('Login successful');
      navigate('/cart');
    } catch (error) {
      setLoading(false);
      toast.error(error.message);
    }
  };

  return (
    <Helmet title='Login'>
      <section className="sect__bg">
        <Container>
          <Row>
            {loading ? (
              <Col lg='12' className="text-center">
                <h5 className="fw-bold">Loading...</h5>
              </Col>
            ) : (
              <Col lg='6' className="m-auto text-center">
                <h3 className="fw-bold fs-2 mb-4">Welcome Back!</h3>
                <h6 className="mb-4">Login to continue</h6>

                <Form className="auth__form" onSubmit={signIn}>
                <button type="button" className="buy__button auth__btn google_btn " onClick={handleGoogleLogin}><img src={googleimg} alt="" /> Login with Google</button><p className="OR">OR</p>
                  <FormGroup className="form__group">
                    <input type="email" placeholder="E-mail" value={email} onChange={e => setEmail(e.target.value)} />
                  </FormGroup>
                  <FormGroup className="form__group">
                    <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
                  </FormGroup>

                  <button type="submit" className="buy__button auth__btn">Let's go</button>
                  <p>Don't have an account? <Link to='/signup'>Sign Up</Link></p>
                  
                </Form>
              </Col>
            )}
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

export default Login;
