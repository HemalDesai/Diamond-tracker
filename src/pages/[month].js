import { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { getDatabase, ref, set, get, onValue, child } from 'firebase/database';
import { initializeApp } from 'firebase/app';
import { useRouter } from 'next/router';

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
const database = getDatabase(app);

const MonthPage = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  

  const { month } = router.query;
  

  const [diamondsData, setDiamondsData] = useState(Array(31).fill(0));
  const [pricePerDiamond, setPricePerDiamond] = useState(0);
  const [advance, setAdvance] = useState(0);
  const [totalSalary, setTotalSalary] = useState(0);

  const handleInputChange = (index, value) => {
    setDiamondsData((prevData) => {
      const newData = [...prevData];
      newData[index] =parseFloat(value) ;
      return newData;
    });
    updateDatabase(index, value);
    
  };

  const handlePriceChange = (value) => {
    setPricePerDiamond(Number(value));
    updatePricePerDiamond(value);

  };

  const handleAdvanceChange = (value) => {
    setAdvance(parseFloat(value)); // Convert the value to a float
    updateAdvance(value);
  };

  useEffect(() => {
    // Calculate total salary
    let sum = diamondsData.reduce((acc, curr) => acc + curr, 0);
    console.log(sum);
    let calculatedSalary = sum * pricePerDiamond - advance;
    calculatedSalary = calculatedSalary >= 0 ? calculatedSalary : 0;
    setTotalSalary(calculatedSalary);
  }, [diamondsData, pricePerDiamond, advance]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        fetchSalaryFromDatabase(user.uid);
        fetchDiamondsDataFromDatabase(user.uid);
        fetchPricePerDiamondFromDatabase(user.uid);
        fetchAdvanceFromDatabase(user.uid);
      } else {
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    auth.signOut()
      .then(() => {
        router.push('/login');
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const fetchDiamondsDataFromDatabase = (userId) => {
    const currmonth = month;
    const diamondsDataRef = ref(database, `users/${userId}/${currmonth}/diamondsData`);
    // const pricePerDiamondRef = ref(database, `users/${userId}/${currmonth}/pricePerDiamond`);
    // Fetch diamonds data from the database and update the state
    // ...
    get(diamondsDataRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const parsedData = data.map((value) => Number(value));
        setDiamondsData(parsedData);
      } else {
        // Handle case when no data exists in the database
        console.log('No diamonds data found in the database.');
      }
    })
    .catch((error) => {
      console.log(error);
    });
    // Example of setting initial data for demonstration purposes
    // const initialData = Array.from({ length: 31 }, () => 0);
    // setDiamondsData(initialData);
  };


  const fetchPricePerDiamondFromDatabase = (userId) => {
    const currmonth = month;
    const pricePerDiamondRef = ref(database, `users/${userId}/${currmonth}/pricePerDiamond`);

    get(pricePerDiamondRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const pricePerDiamondValue = snapshot.val();
          setPricePerDiamond(Number(pricePerDiamondValue));
        } else {
          // Handle case when no data exists in the database
          console.log('No pricePerDiamond value found in the database.');
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const fetchSalaryFromDatabase = (userId) => {
    const currmonth = month;
    const salaryRef = ref(database, `users/${userId}/${currmonth}/totalSalary`);
    onValue(salaryRef, (snapshot) => {
      const salaryValue = snapshot.val();
      setTotalSalary(salaryValue || '');
    });
  };

  const saveSalary = () => {
    const currmonth = month;
    const diamondsDataRef = ref(database, `users/${user.uid}/${currmonth}/diamondsData`);
    diamondsData.forEach((value, index) => {
      set(child(diamondsDataRef, index.toString()), value)
        .then(() => {
          console.log(`Updated diamondsData[${index}] in the database with value: ${value}`);
        })
        .catch((error) => {
          console.log(error);
        });
    });

    const salaryRef = ref(database, `users/${user.uid}/${currmonth}/totalSalary`);
    const diamondsDataCopy = [...diamondsData];
    set(salaryRef, totalSalary)
      .then(() => {
        console.log('Salary saved successfully!');

        setDiamondsData(diamondsDataCopy);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const updateDatabase = (index, value) => {
    const currmonth = month;
    const diamondsDataRef = ref(database, `users/${user.uid}/${currmonth}/diamondsData`);
    
    set(child(diamondsDataRef, index.toString()), value)
      .then(() => {
        console.log(`Updated diamondsData[${index}] in the database with value: ${value}`);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const updatePricePerDiamond = (value) => {
    const currmonth = month;
    const pricePerDiamondRef = ref(database, `users/${user.uid}/${currmonth}/pricePerDiamond`);
    set(pricePerDiamondRef, Number(value))
      .then(() => {
        console.log('Updated pricePerDiamond in the database with value:', value);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const updateAdvance = (value) => {
    const currmonth = month;
    const advanceRef = ref(database, `users/${user.uid}/${currmonth}/advance`);

    set(advanceRef, Number(value))
      .then(() => {
        console.log('Updated advance in the database with value:', value);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const fetchAdvanceFromDatabase = (userId) => {
    const currmonth = month;
    const advanceRef = ref(database, `users/${userId}/${currmonth}/advance`);

    get(advanceRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const advanceValue = snapshot.val();
          setAdvance(Number(advanceValue));
        } else {
          console.log('No advance value found in the database.');
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleBackClick = () => {
    router.push('/Homepage');
  };

  

  return (
    <div className="month-page">
      <h1 >{month}</h1>
      <div className="input-container">
        <div className="input-group">
          <label htmlFor="price-per-diamond" style={{color:'whitesmoke'}}>Price per Diamond:</label>
          <input
            id="price-per-diamond"
            type="number"
            value={pricePerDiamond}
            onChange={(e) => handlePriceChange(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label htmlFor="advance" style={{color:'whitesmoke', marginRight:'15px'}}>Advance:</label>
          <input
            id="advance"
            type="number"
            value={advance}
            onChange={(e) => handleAdvanceChange(e.target.value)}
          />
        </div>
      </div>
      <div className="date-inputs">
        {diamondsData.map((value, index) => (
          <div style={{color:'whitesmoke'}} key={index} className="input-container">
            <label htmlFor={`date-${index + 1}`}>{index + 1}</label>
            <input
  type="number"
  step="any"
  value={value}
  // value={diamondsData[index]}
  onChange={(e) => handleInputChange(index, e.target.value)}
/>
          </div>
        ))}
      </div>
      <div className="total-salary">
        <label style={{color:'whitesmoke'}}>Total Salary:</label>
        <span>{totalSalary}</span>
      </div>
      <button className='month-button' onClick={saveSalary}>Save Salary</button>
      <button className='month-button' style={{marginLeft:'40px'}} onClick={handleBackClick}>Back</button>
    </div>
  );
};

export default MonthPage;
