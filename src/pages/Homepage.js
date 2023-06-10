import MonthButton from "../components/MonthButton";
import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, signOut  } from 'firebase/auth';
import { useRouter } from 'next/router';
import { initializeApp } from 'firebase/app';
import Loader from "../components/Loader";


const firebaseConfig = {
  apiKey: "AIzaSyDSXrKf5c-hGYqvFLDHmOytKYHJCyNtVXA",
  authDomain: "diamond-1619c.firebaseapp.com",
  projectId: "diamond-1619c",
  storageBucket: "diamond-1619c.appspot.com",
  messagingSenderId: "324303631105",
  appId: "1:324303631105:web:a9bfa7fc3c6928aed7e100"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const Homepage = () => {
    const router = useRouter();
  const [user, setUser] = useState(null);
  
  const [isLoading, setIsLoading] = useState(true);

  
    
  
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        router.push('/');
      }
    });
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/LoginPage');
    } catch (error) {
      console.log('Logout error:', error);
    }
  };

  

  return (
    <div className="homepage-container">
      {isLoading ? (
        <div className="loader-container">
        <div className="diamondCon">
          <ul className="diamond">
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
          </ul>
          <div className="textCon">Loading...</div>
        </div>
      </div>
      ) : (
   

    <div className="content-container" style={{ fontFamily: 'Ubuntu' }}>
       <div className="heading-container">
      <h2 style={{color:'whitesmoke', fontWeight:'300', marginTop:'20px', marginBottom:'10px'}}>Welcome {user?.displayName}</h2>
      <h4 style={{color:'whitesmoke', fontWeight:'200', marginTop:'20px', marginBottom:'10px'}}>Select a Month</h4>
      </div>
      <div className="month-buttons">
        {months.map((month, index) => (
          <MonthButton key={index} month={month} />
        ))}
      </div>
      <button className="logout-button" onClick={() => handleLogout()}>
        Logout
      </button>
      
    </div>
    )}
    </div>
    
    
  );
};

export default Homepage;
