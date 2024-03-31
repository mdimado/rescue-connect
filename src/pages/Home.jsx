import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Helmet from "../components/Helmet/Helmet";
import "../styles/home.css";
import { Container, Row, Col } from "reactstrap";
import Lottie from "react-lottie";
import animationData from "../assets/lottie/ani3.json";
import animationData2 from "../assets/lottie/ani2.json";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase.config";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase.config";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

const Home = () => {
  const [isAnimationPlaying, setIsAnimationPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const year = new Date().getFullYear();
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);
  

  

  

  const lottieOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const lottieOptions2 = {
    loop: true,
    autoplay: true,
    animationData: animationData2,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const handleGoogleLogin = async () => {
    try {
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;

      // Create a userData bucket and store user information
      const userDataRef = collection(db, "userData");
      const userData = {
        name: user.displayName,
        email: user.email,
      };

      // Check if the userData bucket already exists
      const userDataQuery = query(userDataRef, where("email", "==", userData.email));
      const snapshot = await getDocs(userDataQuery);
      const existingUserData = snapshot.docs.find((doc) => doc.data().email === userData.email);

      if (!existingUserData) {
        // Create the userData bucket if it doesn't exist
        await addDoc(userDataRef, userData);
      }

      setLoading(false);
      toast.success("Login successful");
      navigate("/dashboard");
    } catch (error) {
      setLoading(false);
      toast.error(error.message);
    }
  };

  const handleDashboardRedirect = () => {
    if (loggedIn) {
      navigate("/dashboard");
    } else {
      navigate("/register");
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <Helmet title={"Home"}>
      <section className="hero__section">
        <Container>
          <Row>
            <Col lg="6" md="6">
              <div className="hero_content">
                
                <div className="h21">
                  <h2 className="whitet">Unite for Rescue: Coordination in Crisis</h2>
                </div>
                
                <div className="boxxx"><p>
                Connecting Rescue Agencies Nationwide.

                </p></div>
                

                <button
                  whileHover={{ scale: 1.2 }}
                  className="btn"
                  onClick={handleDashboardRedirect}
                  role="button"
                >
                  {loggedIn ? <><i class="animation"></i>Dashboard<i class="animation"></i></> : <><i class="animation"></i>Register Now<i class="animation"></i></>}
                </button>

                
                <p className="lasto"></p>
                
              </div>
            </Col>

            

         
            <Col lg='6' className="dfdfdf" >
                <div className="rescuebox"></div>
                <div className="rescuebox2"></div>
                <div className="pix">
                  <div className="rescuebox3"></div>
                  <div className="rescuebox4"></div>

                </div>
            </Col>

          </Row>
        </Container>
      </section>


      
    </Helmet>
  );
};

export default Home;
