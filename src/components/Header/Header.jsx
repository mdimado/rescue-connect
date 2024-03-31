import React, {useRef,useEffect} from "react";

import { NavLink, useNavigate } from "react-router-dom";
import './header.css';
import userIcon from '../../assets/images/account-circle-line.png'
import { motion } from "framer-motion";


import { Container, Row } from "reactstrap";
import { useSelector } from "react-redux";
import useAuth from '../../custom-hooks/useAuth';
import { Link } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase.config";
import { toast } from "react-toastify";

const nav__links = [
  {
    path:'home',
    display:'Home'
  },
  {
    path:'dashboard',
    display:'Dashboard'
  },
  
]

const Header = () => {

  const headerRef = useRef(null);
  const {currentUser} = useAuth() 
  
  const profileActionRef = useRef(null)

 

  const menuRef = useRef(null);
  const navigate = useNavigate();
 

  const stickyHeaderFunc = ()=>{
    window.addEventListener('scroll',()=>{
      if(document.body.scrollTop > 80 || document.documentElement.scrollTop
        > 80){
          headerRef.current.classList.add('sticky__header')
        } else{
          headerRef.current.classList.remove('sticky__header')
        }
    })
  }

  const logout = ()=>{

    signOut(auth).then(()=>{
      toast.success('Logged out');
      navigate('/home')
    }).catch(err=>{
        toast.error(err.message)
    })


  }

  useEffect(()=>{
      stickyHeaderFunc()

      return ()=> window.removeEventListener('scroll', stickyHeaderFunc)
  });

  const menuToggle = () => menuRef.current.classList.toggle('active__menu')
  const toggleProfileActions = ()=> profileActionRef.current.classList.toggle('show__profileActions')

 

  return <header className="header" ref={headerRef}>
    <Container>
      <Row>
        <div className="nav__wrapper">
          <div className="logo">
            <Link to='/home'><h1 className="logo">A</h1></Link>
          </div>


            <div className="navigation" ref={menuRef} onClick = {menuToggle}>
              <ul className="menu">
                {nav__links.map((item, index) => (
                  <li className="nav__item" key={index}>
                    <NavLink 
                      to={item.path} 
                      className={(navClass) =>
                        navClass.isActive ? "nav__active" : ""
                      }
                    >
                      {item.display}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>

            <div className="nav__icons">
            <div className="profile">
                <motion.img whileTap={{scale:1.2}} src={ currentUser? currentUser.photoURL : userIcon} alt="" onClick={toggleProfileActions} />
                <div className="profile__actions" ref={profileActionRef} onClick={toggleProfileActions}>
                  {
                    currentUser ? <div className="d-flex align-items-center justify-content-center flex-column jobhi">
                      <span onClick={logout}>Logout</span>
                      <Link to='/cart'>My Cart</Link>
                      <Link to='/fav'>My Wishlist</Link>
                      <Link to='/myorders'>My orders</Link>
                      </div> : 
                    <div className="d-flex align-items-center justify-content-center flex-column jobhi">
                      <Link to='/signup'>Signup</Link>
                      <Link to='/login'>Login</Link>
                    </div>
                  }
                </div>
                
              </div>
            </div>

            

        </div>
      </Row>
    </Container>
  </header>
};

export default Header;