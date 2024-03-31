import React, { useState, useRef } from "react";
import Helmet from '../components/Helmet/Helmet';
import { Container, Row, Col, Form, FormGroup } from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { setDoc, doc } from "firebase/firestore";
import { auth, provider, storage, db } from '../firebase.config';
import { toast } from 'react-toastify';
import '../styles/login.css';
import googleimg from '../assets/images/google.png'

const Signup = () => {

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const fileUploadRef = useRef(null);

  const signup = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const storageRef = ref(storage, `images/${Date.now() + username}`);
      const uploadTask = uploadBytesResumable(storageRef.current, file);

      uploadTask.on("state_changed", (snapshot) => {

      }, (error) => {
        setLoading(false);
        toast.error(error.message);
      }, async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

        await updateProfile(user, {
          displayName: username,
          photoURL: downloadURL
        });

       
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          displayName: username,
          email,
          photoURL: downloadURL,
        });

        setLoading(false);
        toast.success('Account created');
        navigate('/login');
      });
    } catch (error) {
      setLoading(false);
      toast.error(error.message);
    }
  };

  const handleFileUpload = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const handleGoogleSignup = async () => {
    try {
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;

      const displayName = user.displayName || username;
      const photoURL = user.photoURL || null;

      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        displayName,
        email: user.email,
        photoURL,
      });

      setLoading(false);
      toast.success('Account created');
      navigate('/home');
    } catch (error) {
      setLoading(false);
      toast.error(error.message);
    }
  };

  return (
    <Helmet title='Signup'>
      <section className="sect__bg">
        <Container>
          <Row>
            {loading ? (
              <Col lg='12' className="text-center">
                <h5 className="fw-bold">Loading...</h5>
              </Col>
            ) : (
              <Col lg='6' className="m-auto text-center">
                <h3 className="fw-bold fs-2 mb-4">Welcome!</h3>
                <h6 className="mb-4">SignUp to continue</h6>

                <Form className="auth__form" onSubmit={signup}>
                  <div><button type="button" className="buy__button auth__btn google_btn " onClick={handleGoogleSignup}><img src={googleimg} alt="" /> Sign Up with Google</button>
                <p classname='OR'>OR</p></div>
                
                  <FormGroup className="form__group">
                    <input type="text" placeholder="Name" required value={username} onChange={e => setUsername(e.target.value)} />
                  </FormGroup>
                  <FormGroup className="form__group">
                    <input type="email" placeholder="E-mail" required value={email} onChange={e => setEmail(e.target.value)} />
                  </FormGroup>
                  <FormGroup className="form__group">
                    <input type="password" placeholder="Password" required value={password} onChange={e => setPassword(e.target.value)} />
                  </FormGroup>
                  <Col className="tes">
                    <FormGroup className="form__group">
                      <label htmlFor="fileUpload" className="pp_choose">Click here to choose a Profile Picture</label>
                      <input type="file" className="button_ok" placeholder="profile" id="fileUpload" accept="image/png, image/jpeg, image/jpg" onChange={handleFileUpload} ref={fileUploadRef} />
                    </FormGroup>
                  </Col>
                  <FormGroup className="checkbox">
                    <input type="checkbox" id="pp_t&c" name="pp_t&c" required />
                    <label htmlFor="pp_t&c">I have read and agree to the <Link className="checkbox__link" to='/privacypolicy'>Privacy Policy</Link> and <Link className="checkbox__link" to='/termsandconditions'>Terms and Conditions</Link></label>
                  </FormGroup>

                  <button type="submit" className="buy__button auth__btn">Let's get started</button>
                  <p>Already have an account? <Link to='/login'>Login</Link></p>
                  
                </Form>
              </Col>
            )}
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

export default Signup;
