import { Box, Button, Image, useDisclosure } from '@chakra-ui/react';
import { signInWithPopup } from "firebase/auth";
import { useContext, useRef, useState } from "react";
import { db } from '../Firebase/Firebase';
import { addDoc, getDocs, setDoc,collection,doc,onSnapshot} from "firebase/firestore";
import { auth, provider } from "../Firebase/Firebase";
import { useNavigate,useLocation, Navigate } from "react-router-dom";
import {Authentication} from "../contexts/AuthContext"
import "./Navbar.css";
import React,{ useEffect } from 'react';
import { Value } from '../contexts/ValuesContext';
import { Personal } from '../contexts/PersonalContext';
import logo from "../../assets/Images/logo.jpg"
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Input,
} from '@chakra-ui/react'

const Navbar = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // For smooth scrolling
    });
  };

  const [navbarColor, setNavbarColor] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = useRef()
 
  const theme = {
  width: "100%",
  height: "10%",
  background: `
    radial-gradient(circle farthest-side at 0% 50%, #282828 23.5%, rgba(255, 170, 0, 0) 0) 21px 30px,
    radial-gradient(circle farthest-side at 0% 50%, #2c3539 24%, rgba(240, 166, 17, 0) 0) 19px 30px,
    linear-gradient(#282828 14%, rgba(240, 166, 17, 0) 0, rgba(240, 166, 17, 0) 85%, #282828 0) 0 0,
    linear-gradient(150deg, #282828 24%, #2c3539 0, #2c3539 26%, rgba(240, 166, 17, 0) 0, rgba(240, 166, 17, 0) 74%, #2c3539 0, #2c3539 76%, #282828 0) 0 0,
    linear-gradient(30deg, #282828 24%, #2c3539 0, #2c3539 26%, rgba(240, 166, 17, 0) 0, rgba(240, 166, 17, 0) 74%, #2c3539 0, #2c3539 76%, #282828 0) 0 0,
    linear-gradient(90deg, #2c3539 2%, #282828 0, #282828 98%, #2c3539 0%) 0 0 #282828`,
  backgroundSize: "40px 60px"
}  
  const [email,setEmail] = useState(null) 
 
  const[personal,setPersonal] = useContext(Personal)
  const [user,setUser] = useContext(Authentication);
  const [pic,setPic] = useState(null)
  const navigate = useNavigate();
  const location = useLocation();
  const personalSubcollectionRef =
  email
    ? collection(db, "Database", email, "personal")
    : null;
  const carbonFootprintSubcollectionRef =
  email
    ? collection(db, "Database", email, "carbon footprint")
    : null;
  

  const handleScroll = () => {
    if (window.scrollY > 50) {  // Change the value '50' to adjust the scroll threshold
      setNavbarColor(true);
    } else {
      setNavbarColor(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    // Cleanup the event listener on unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(()=>{
    try{
      if (user && personalSubcollectionRef) {
    onSnapshot(personalSubcollectionRef, (snapshot) => {
      const docs = snapshot.docs;

      if (docs.length === 0) return;

      console.log(docs[0]._document.data.value.mapValue.fields);
      setPersonal(docs[0]._document.data.value.mapValue.fields);
});
      }
    }
    catch(error){
      console.log(error)
    }
    
   },[user, email])
 
  const HandleGetStarted = () =>{
    if(email){
     
    }
    else{
      try{
        HandleSignin()
          
        
      }
      catch(error){
        console.log(error)
      }
      
    }
  }
  const HandleSignin = async() =>{
    try {
      
      const userCredentials = await signInWithPopup(auth, provider);
      //console.log(userCredentials)
      const users = userCredentials.user;
      console.log(users.email)
      console.log(users)
      console.log(users.photoURL)

      if (users) {
    setEmail(users.email);
    setUser(users);

    const personalDocRef = doc(
        db,
        "Database",
        users.email,
        "personal",
        "profile"
    );

    try {
        await setDoc(
            personalDocRef,
            {
                body: "none",
                sex: "none"
            },
            { merge: true }
        );

        console.log("Firestore profile created successfully");
    } catch (err) {
        console.error("Firestore write failed:", err);
    }

    setPic(users.photoURL);
    console.log("hi");
    console.log(users.photoURL);
}
      
      
  } catch (error) {
    console.log("error:", error)
  }
  finally{
      
      navigate('/Dashboard')
   

  }
  
  
  }
  return (
    <div id="navContainer" style = {!navbarColor?theme:{background:"#2c2a2a" , transition:"ease-in-out"}}>
      {/*,borderBottom: "2px solid #4CAF50"*/}
      <div
        className='Left_icons'
      >
          <Image 
            
            src={logo} 
            alt="logo" 
            w="70px"
            h="70px"
            borderRadius="60px"
            p="5px"
           />
      </div>
      
      <ul id="list">
        
        {user?<>
          <li onClick={()=>navigate("/")}>Home</li>
          <li onClick={()=>navigate("/Dashboard")}>DashBoard</li>
          <li onClick={()=>navigate("/Leaderboard")}>LeaderBoard</li>
        </>:<>
        <li onClick={scrollToTop}>Home</li>
        <li><a href="#about">About</a></li>
        </>
        }
        
      </ul>
      <Box
        display="flex"
        w="250px"
        h="70px"
        justifyContent="flex-end"
        alignItems="center"
        flexDirection="row"
      >
      {!email?<Button 
        colorScheme='teal' 
        size='md'
        onClick={()=>{HandleSignin()}}
        mr="10px"
        >
        Login
      </Button>:null}
      {!email?<Button 
        colorScheme='teal' 
        size='md'
        mr="10px"
        >
        Sign Up
      </Button>:null}      
      {email!==null?<Image
        src={pic}
        w="60px"
        h="60px"
        borderRadius="100px"
        m="10px"
        ref={btnRef}
        onClick={onOpen}
      >

      </Image>:null}
      </Box>
      <Drawer
        isOpen={isOpen}
        placement='right'
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerFooter bg="white">
            <Button sx={{margin:"20px"}} size="md">Sign Out</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}

export default Navbar;
