import React, { useContext,useEffect,useState } from 'react';
import { Box,Select,FormControl,FormLabel,NumberInput,NumberInputStepper,NumberIncrementStepper,NumberInputField,NumberDecrementStepper,Image,Button, useDisclosure} from '@chakra-ui/react';
import {Value} from '../../Components/contexts/ValuesContext';
import { addDoc, getDocs, setDoc,collection,doc,onSnapshot,updateDoc} from "firebase/firestore";
import { useToast } from '@chakra-ui/react'
import tree from "../../assets/Images/tree.jpg"
import { db } from '../../Components/Firebase/Firebase';
import { Authentication } from '../../Components/contexts/AuthContext';
import { Personal } from '../../Components/contexts/PersonalContext';
import bg from "../../assets/Images/bg.jpg"
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Text
  } from '@chakra-ui/react'

const Dashboard = () => {
  const toast = useToast()
  const [Cvalue,setCurrent_value] = useState("")
  const [data,setData] = useState("")
  const [Nvalue,setNew_value] = useState("")
  const [docs,setDocs] = useState("")
  const { isOpen, onOpen, onClose } = useDisclosure()
  const theme = {
    width: "100%",
    height: "735px",
    background: `
      radial-gradient(circle farthest-side at 0% 50%, #282828 23.5%, rgba(255, 170, 0, 0) 0) 21px 30px,
      radial-gradient(circle farthest-side at 0% 50%, #2c3539 24%, rgba(240, 166, 17, 0) 0) 19px 30px,
      linear-gradient(#282828 14%, rgba(240, 166, 17, 0) 0, rgba(240, 166, 17, 0) 85%, #282828 0) 0 0,
      linear-gradient(150deg, #282828 24%, #2c3539 0, #2c3539 26%, rgba(240, 166, 17, 0) 0, rgba(240, 166, 17, 0) 74%, #2c3539 0, #2c3539 76%, #282828 0) 0 0,
      linear-gradient(30deg, #282828 24%, #2c3539 0, #2c3539 26%, rgba(240, 166, 17, 0) 0, rgba(240, 166, 17, 0) 74%, #2c3539 0, #2c3539 76%, #282828 0) 0 0,
      linear-gradient(90deg, #2c3539 2%, #282828 0, #282828 98%, #2c3539 0%) 0 0 #282828`,
    backgroundSize: "40px 60px",
    color: "white"  // Ensures the text is visible against the dark background
  };
    const [values,setValues] = useContext(Value);
    const [personal,setPersonal] = useState("");
    const [user,setUser] = useContext(Authentication);
    const [id,setId] = useState("")
    const [input,setInput ]  = useState(1);
    const [body,setBody] = useState(null)
    
    //console.log(user)
    const [sex,setSex] = useState(null)
    const personalSubcollectionRef =
    user?.email
        ? collection(db, "Database", user.email, "personal")
        : null;
    const waste_bag = {"small":0 , "medium":1 , "large":2 , "extra large":3}
    const body_type = {"normal":0 ,"underweight":1, "overweight":2,"obese":3}
    const sex_type = {"male":0 , "female":1}
    const diet_map = {"vegan":1,"vegetarian":0,"pescatarian":2,"omnivore":3}
    const shower_mapping = {'less frequently': 0, 'daily': 1, 'more frequently': 2, 'twice a day': 3}
    const travel_air_mapping = {'never': 0, 'rarely': 1, 'frequently': 2, 'very frequently': 3}
    const heating_map = {"electricity":0 , "natural gas":1 , "wood":2 , "coal":3}
    const transport = {"public":0 , "private":2 , "walk/bicycle":1}
    const vehicle_type = {"NA":0 , "hybrid":1 , "diesel":3 , "petrol":2}

    const handleSendData = async () => {

        console.log("Body =", body);
        console.log("Sex =", sex);

        const dataToSend = {
          "Body Type":body_type[body],
          "Sex":sex_type[sex],
          "Diet":diet_map [values.diet],
          "How Often Shower": shower_mapping[values.shower],
          "Heating Energy Source": heating_map[values.heat],
          "Transport": transport[values.Transport],
          "Vehicle Type":vehicle_type[values.Vtype],
          "Monthly Grocery Bill": parseInt(values.Gbill),
          "Frequency of Traveling by Air": travel_air_mapping[values.Tair],
          "Vehicle Monthly Distance Km":parseInt(values.VmD),
          "Waste Bag Size": waste_bag[values.Wbs],
          "Waste Bag Weekly Count": parseInt(values.Wbwc),
          "How Long TV PC Daily Hour": parseInt(values.Tv),
          "How Many New Clothes Monthly": parseInt(values.NewClothes),
          "How Long Internet Daily Hour": parseInt(values.InternetDaily)
        }; // Example data
        console.log(dataToSend)
        const hasNullValues = (data) => {
            for (const key in data) {
                if (data[key] === null) {
                    return true; // Return true if any value is null
                }
            }
            return false; // Return false if no null values are found
        };
        
        try {
          console.log("Loading...");
          console.log(hasNullValues(dataToSend))
        //   if (!hasNullValues(dataToSend)){
        //     toast({
        //         position:"bottom-left",
        //         title: 'Enter Data',
        //         description: "Please input all data",
        //         status: 'warning',
        //         duration: 9000,
        //         isClosable: true,
        //       })
        //       return;
        //   }
          const response = await fetch('https://nasaspacechallenge-rj3s.onrender.com/send-data', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataToSend),
          });
      
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
      
          const data = await response.json();
          console.log('Response from server:', data);
          setData(data)
          
          /*let carbonFootprintSubcollectionRef = collection(db, 'Database',`${user.email}`, 'carbonfootprint');
          onSnapshot(carbonFootprintSubcollectionRef,(snapshot)=>{
            let carbonFootprintSubcollectionRef = collection(db, 'Database',`${user.email}`, 'carbonfootprint');
            const docs = snapshot;
            console.log(docs)
           
              if (docs.empty) {
                console.log(data)
                const docData = {
                    Footprint: data.data_sent
                  };
                  try{
                    addDoc(carbonFootprintSubcollectionRef, docData)
                        .then((docRef) => {
                            console.log("Document written with ID: ", docRef.id);
                        })
                        .catch((error) => {
                            console.error("Error adding document: ", error);
                        });
                  }
                  catch(error){
                    console.log(error)
                  }
               
              }
              else{
                setDocs(docs.docs[0].id);
                setCurrent_value(docs.docs[0]._document.data.value.mapValue.fields.Footprint.doubleValue)
                setNew_value(data.data_sent)
                
               
                return 0;
              }
          }
          )*/
          
          // Handle success (e.g., update the UI, show a success message, etc.)
        } catch (error) {
          console.error('Error sending data:', error);
          // Handle error (e.g., show error message to the user)
        } finally {
           
                
          console.log('Loading finished.');
          // Reset loading state or perform other cleanup if needed
          
            
          setValues({
            diet:"null",
            shower:"null",
            heat:"null",
            Gbill:0,
            Transport:"null",
            Vtype:"null",
            Tair:"null",
            VmD:0,
            Wbs:"null",
            Wbwc:0,
            Tv:0,
            NewClothes:0,
            InternetDaily:0
        })
        }
      };
      
    const HandleOnSubmit = async () => {
        setInput(0)
        
        await handleSendData();
        onOpen();
        if(personal===false){
            const personalDocumentRef = doc(db,"Database",user.email,"personal",id);

            // Update the document with new 'body' and 'sex' values
            updateDoc(personalDocumentRef, {
                body: body,
                sex: sex
            })
            .then(() => {
                console.log("Document successfully updated!");
            })
            .catch((error) => {
                console.error("Error updating document: ", error);
            });
            
        }
        console.log(values)
       
    }
    
    //console.log(user)
    useEffect(() => {
    // TEMPORARILY DISABLED
}, []);
    
  return (
    <Box
       
        style={{
            width: theme.width,
            height: theme.height,
            background: theme.background,
            backgroundSize: theme.backgroundSize,
            color: theme.color  // Apply the text color
        }}
        display="flex"
        justifyContent="center"
        alignItems="center"
    >
      <Box
        display = "flex"
        flexDirection="column"
         position="relative"
        
        justifyContent="space-evenly"
        alignItems="center"
        width="690px"
        height="404px"
        bg="rgb(223, 225, 235)"
        borderRadius="50px"
        backdropFilter="blur(10px)"
        zIndex={1}  // Lower z-index
        sx={{
          boxShadow: `
            rgba(0, 0, 0, 0.17) 0px -23px 25px 0px inset,
            rgba(0, 0, 0, 0.15) 0px -36px 30px 0px inset,
            rgba(0, 0, 0, 0.1) 0px -79px 40px 0px inset,
            rgba(0, 0, 0, 0.06) 0px 2px 1px,
            rgba(0, 0, 0, 0.09) 0px 4px 2px,
            rgba(0, 0, 0, 0.09) 0px 8px 4px,
            rgba(0, 0, 0, 0.09) 0px 16px 8px,
            rgba(0, 0, 0, 0.09) 0px 32px 16px
          `,
        }}

       
      >
        
        {<Image
            src = {bg}
            alt="background"
            position="absolute"
            
            w="100%"
            borderRadius="50px"
            filter="blur(5px)" // Set the desired blur effect
            h="404px"
            zIndex={5}  // Higher z-index
        >
            
        </Image>}
        {input===0?
        <Box
        zIndex={10}  
        w="100%"
        h="200px"
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
       >
           <FormControl
           display="flex"
           flexDirection="column"
           alignItems="center"
               
           >
               <FormLabel
                   w="300px"
                   color="white"
                   pl="10px"
               >Body</FormLabel>
               <Select placeholder='Select option' w="300px"
                   bgColor="grey"
                   onChange={(e)=>{setBody(e.target.value)}}
                   
               >
                   <option value='obese' 
                       style={{color:"black",bgColor:"grey"}}
                   >obese</option>
                   <option value='overweight' style={{color:"black",bgColor:"grey"}}>overweight</option>
                   <option value='normal' style={{color:"black",bgColor:"grey"}}>normal</option>
                   <option value='underweight' style={{color:"black",bgColor:"grey"}}>underweight</option>
                   
               </Select>
           </FormControl>
           <FormControl
           display="flex"
           flexDirection="column"
           alignItems="center"
               
           >
               <FormLabel
                   w="300px"
                   color="white"
                   pl="10px"
               >Sex</FormLabel>
               <Select placeholder='Select option' w="300px"
                   bgColor="grey"
                   onChange={(e)=>{setSex(e.target.value)}}
               >
                   <option value='male' style={{color:"black",bgColor:"grey"}}>male</option>
                   <option value='female' style={{color:"black",bgColor:"grey"}}>female</option>
               </Select>
           </FormControl>
        </Box>
        :null}
        {input===1?<Box
        zIndex={10} 
         w="100%"
         h="200px"
         display="flex"
         flexDirection="row"
         justifyContent="space-between"
         alignItems="center"
        >
            <FormControl
            display="flex"
            flexDirection="column"
            alignItems="center"
                
            >
                <FormLabel
                    w="300px"
                    color="white"
                    pl="10px"
                >Diet</FormLabel>
                <Select placeholder='Select option' w="300px"
                    bgColor="grey"
                    onChange={(e)=>{setValues((prevValues) => ({
                        ...prevValues,
                        diet:e.target.value 
                      }));}}
                      value={values.diet}
                >
                    <option value='vegetarian' 
                        style={{color:"black",bgColor:"grey"}}
                    >vegetarian</option>
                    <option value='pescatarian' style={{color:"black",bgColor:"grey"}}>pescatarian</option>
                    <option value='omnivore' style={{color:"black",bgColor:"grey"}}>omnivore</option>
                    <option value='vegan' style={{color:"black",bgColor:"grey"}}>vegan</option>
                </Select>
            </FormControl>
            
            <FormControl
                display="flex"
                flexDirection="column"
                alignItems="center"
                
            >
                <FormLabel
                    w="300px"
                    color="white"
                    pl="10px"
                >How Often do you Shower?</FormLabel>
                <Select placeholder='Select option' w="300px"
                    bgColor="grey"
                    onChange={(e)=>{setValues((prevValues) => ({
                        ...prevValues,
                        shower:e.target.value 
                      }));}}
                      value={values.shower}
                >
                    <option value='more frequently' style={{color:"black",bgColor:"grey"}}>more frequently</option>
                    <option value='twice a day' style={{color:"black",bgColor:"grey"}}>twice a day</option>
                    <option value='daily' style={{color:"black",bgColor:"grey"}}>daily</option>
                    <option value='less frequently' style={{color:"black",bgColor:"grey"}}>less frequently</option>
                </Select>
            </FormControl>
        
        </Box>:null}
        {input===2?<Box
            zIndex={10} 
            w="100%"
            h="200px"
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
        >
            <FormControl
                display="flex"
                flexDirection="column"
                alignItems="center"
                
            >
                <FormLabel
                    w="300px"
                    color="white"
                    pl="10px"
                >Heating Energy Source</FormLabel>
                <Select placeholder='Select option' w="300px"
                    bgColor="grey"
                    onChange={(e)=>{setValues((prevValues) => ({
                        ...prevValues,
                        heat:e.target.value 
                      }));}}
                      value={values.heat}
                >
                    <option value='coal' style={{color:"black",bgColor:"grey"}}>coal</option>
                    <option value='natural gas' style={{color:"black",bgColor:"grey"}}>natural gas</option>
                    <option value='wood' style={{color:"black",bgColor:"grey"}}>wood</option>
                    
                </Select>
            </FormControl>
            
            <FormControl
                display="flex"
                flexDirection="column"
                alignItems="center"
                
            >
                <FormLabel
                    w="300px"
                    color="white"
                    pl="10px"
                >Monthly Grocery Bill</FormLabel>
                <NumberInput
                    value={values.Gbill}
                >
                    <NumberInputField w="300px"
                    bgColor="grey"
                    onChange={(e)=>{setValues((prevValues) => ({
                        ...prevValues,
                        Gbill:e.target.value 
                      }));}}
                      
                      
                      />
                    <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                    </NumberInputStepper>
                </NumberInput>
            </FormControl>
        
        </Box>:null}
        {input===3?<Box
            zIndex={10} 
            w="100%"
            h="200px"
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
        >
            <FormControl
            display="flex"
            flexDirection="column"
            alignItems="center"
                
            >
                <FormLabel
                    w="300px"
                    color="white"
                    pl="10px"
                >Frequency of Traveling by Air</FormLabel>
                <Select placeholder='Select option' w="300px"
                    bgColor="grey"
                    value={values.Tair}
                    onChange={(e)=>{setValues((prevValues) => ({
                        ...prevValues,
                        Tair:e.target.value 
                      }));}}
                      >
                    <option value='very frequently' style={{color:"black",bgColor:"grey"}}>very frequently</option>
                    <option value='frequently' style={{color:"black",bgColor:"grey"}}>frequently</option>
                    <option value='rarely' style={{color:"black",bgColor:"grey"}}>rarely</option>
                    <option value='never' style={{color:"black",bgColor:"grey"}}>never</option>
                    
                </Select>
            </FormControl>
            
            <FormControl
                display="flex"
                flexDirection="column"
                alignItems="center"
                
            >
                <FormLabel
                    w="300px"
                    color="white"
                    pl="10px"
                >Vehicle Monthly Distance Km</FormLabel>
                 <NumberInput
                    value={values.VmD}
                 >
                    <NumberInputField w="300px"
                    bgColor="grey"
                    onChange={(e)=>{setValues((prevValues) => ({
                        ...prevValues,
                        VmD:e.target.value 
                      }));}}
                      
                      />
                    <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                    </NumberInputStepper>
                </NumberInput>
            </FormControl>
        
        </Box>:null}
      
        {input===4?<Box
            zIndex={10} 
            w="100%"
            h="200px"
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
        >
            <FormControl
            display="flex"
            flexDirection="column"
            alignItems="center"
                
            >
                <FormLabel
                    w="300px"
                    color="white"
                    pl="10px"
                >Transport</FormLabel>
                <Select placeholder='Select option' w="300px"
                    bgColor="grey"
                    onChange={(e)=>{setValues((prevValues) => ({
                        ...prevValues,
                        Transport:e.target.value 
                      }));}}
                      value={values.Transport}
                >
                    <option value='public' style={{color:"black",bgColor:"grey"}}>Public</option>
                    <option value='private' style={{color:"black",bgColor:"grey"}}>private</option>
                    <option value='walk/bicycle' style={{color:"black",bgColor:"grey"}}>walk/bicycle</option>
                    
                    
                </Select>
            </FormControl>
            
            <FormControl
                display="flex"
                flexDirection="column"
                alignItems="center"
                
            >
                <FormLabel
                    w="300px"
                    color="white"
                    pl="10px"
                >Vehicle Type</FormLabel>
                <Select placeholder='Select option' w="300px"
                    bgColor="grey"
                    onChange={(e)=>{setValues((prevValues) => ({
                        ...prevValues,
                        Vtype:e.target.value 
                      }));}}
                      value={values.Vtype}
                >
                    <option value='petrol' style={{color:"black",bgColor:"grey"}}>petrol</option>
                    <option value='diesel' style={{color:"black",bgColor:"grey"}}>diesel</option>
                    <option value='hybrid' style={{color:"black",bgColor:"grey"}}>hybrid</option>
                    
                   
                    
                </Select>
                 
            </FormControl>
        
        </Box>:null}
        
        {input===5?<Box
            zIndex={10} 
            w="100%"
            h="200px"
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
        >
            <FormControl
                display="flex"
                flexDirection="column"
                alignItems="center"
                
            >
                <FormLabel
                    w="300px"
                    color="white"
                    pl="10px"
                >Waste Bag Size</FormLabel>
                <Select placeholder='Select option' w="300px"
                    bgColor="grey"
                    onChange={(e)=>{setValues((prevValues) => ({
                        ...prevValues,
                        Wbs:e.target.value 
                      }));}}
                      value={values.Wbs}
                >
                    <option value='extra large' style={{color:"black",bgColor:"grey"}}>extra large</option>
                    <option value='large' style={{color:"black",bgColor:"grey"}}>large</option>
                    <option value='medium' style={{color:"black",bgColor:"grey"}}>medium</option>
                    <option value='small' style={{color:"black",bgColor:"grey"}}>small</option>
                    
                </Select>
            </FormControl>
            
            <FormControl
                display="flex"
                flexDirection="column"
                alignItems="center"
                
            >
                <FormLabel
                    w="300px"
                    color="white"
                    pl="10px"
                >Waste Bag Weekly Count</FormLabel>
                <NumberInput
                    value={values.Wbwc}
                >
                    <NumberInputField w="300px"
                    bgColor="grey"
                    onChange={(e)=>{setValues((prevValues) => ({
                        ...prevValues,
                        Wbwc:e.target.value 
                      }));}}
                      
                      />
                       
                    <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                    </NumberInputStepper>
                </NumberInput>
            </FormControl>
        
        </Box>:null}
        {input===6?<Box
            zIndex={10} 
            w="100%"
            h="200px"
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
        >
            <FormControl
            display="flex"
            flexDirection="column"
            alignItems="center"
                
            >
                <FormLabel
                    w="300px"
                    color="white"
                    pl="10px"
                >How Long TV PC Daily Hour</FormLabel>
                <NumberInput
                    value={values.Tv}
                >
                    <NumberInputField w="300px"
                    bgColor="grey"
                    onChange={(e)=>{setValues((prevValues) => ({
                        ...prevValues,
                        Tv:e.target.value 
                      }));}}
                      
                      />
                    <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                    </NumberInputStepper>
                </NumberInput>
            </FormControl>
            
            <FormControl
                display="flex"
                flexDirection="column"
                alignItems="center"
                
            >
                <FormLabel
                    w="300px"
                    color="white"
                    pl="10px"
                >How Many New Clothes Monthly</FormLabel>
                 <NumberInput
                    value={values.NewClothes}  
                 >
                    <NumberInputField w="300px"
                    bgColor="grey"
                    onChange={(e)=>{setValues((prevValues) => ({
                        ...prevValues,
                       NewClothes:e.target.value 
                      }));}}
                      
                      />
                    <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                    </NumberInputStepper>
                </NumberInput>
            </FormControl>
        
        </Box>:null}
        {input===7?<Box
            zIndex={10} 
            w="100%"
            h="200px"
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
        >
            <FormControl
                display="flex"
                flexDirection="column"
                alignItems="center"
                
            >
                <FormLabel
                    w="300px"
                    color="white"
                    pl="10px"
                >How Long Internet Daily Hour</FormLabel>
                <NumberInput
                    value={values.InternetDaily}
                >
                    <NumberInputField w="300px"
                    bgColor="grey"
                    onChange={(e)=>{setValues((prevValues) => ({
                        ...prevValues,
                        InternetDaily:e.target.value 
                      }));}}
                      
                     />
                    <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                    </NumberInputStepper>
                </NumberInput>
            </FormControl>
            
            
        
        </Box>:null}

        <Box
            zIndex={10} 
            w="100%"
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
            p="20px"
           
        >
            <Box
                zIndex={10} 
                display="flex"
                justifyContent="flex-start"
                alignItems="center"
            >
                {input > 0 && (
                    <Button
                        colorScheme="teal"
                        onClick={() => setInput((prev) => prev - 1)}
                    >
                        Previous
                    </Button>
                )}
                
            </Box>
            <Box
                zIndex={10} 
                display="flex"
                justifyContent="flex-end"
                alignItems="center"
            >
                {input < 7 && (
                    <Button
                        colorScheme="teal"
                        onClick={() => setInput((prev) => prev + 1)}
                    >
                        Next
                    </Button>
                )}

                {input === 7 && (
                    <Button
                        colorScheme="teal"
                        onClick={HandleOnSubmit}
                    >
                        Submit
                    </Button>
                )}
            </Box>
           
            
        </Box>
      </Box>
      <Modal  isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent
            h="500px"
        >
            
          <ModalHeader
            pl="100px"
          >
            
            YOUR CARBON FOOTPRINT</ModalHeader>
          <ModalCloseButton />
          <ModalBody
            p="0"
            m="0"
          >
            <Image w="450px" h= "380px" src={tree} position="relative"></Image>
            <Text fontWeight='bold' fontSize="20px" color="black" position="absolute" top="100px" right="100px">
                {Number(data?.data_sent ?? 0).toFixed(3)} Kg CO<sub>2</sub> Per Month
            </Text>
            <Text fontWeight='bold' fontSize="20px" color="black" position="absolute" top="400px" right="150px">
                You owe {Math.floor((data?.data_sent ?? 0) / 500)} Trees
            </Text>
            
          </ModalBody>

          <ModalFooter
                p="0"
                m="0"
                h="60px"
          >
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
            
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Dashboard;
