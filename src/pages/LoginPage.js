import { useState } from 'react';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useRouter } from 'next/router';

import { initializeApp } from 'firebase/app';
import { useEffect } from 'react';

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
const provider = new GoogleAuthProvider();

export default function LoginPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        router.push('/Homepage');
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      setUser(user);
      router.push('/Homepage');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="login-page-container">
    <div className="video-overlay" />
    <div className="video-wrapper">
      <video
        src="https://i.imgur.com/iWAB8gD.mp4"
        className="video-background"
        autoPlay
        loop
        muted
      />
    </div>
    <div className="content">
    <button className='button-17'  onClick={signInWithGoogle}>Sign in with Google</button>
    </div>
  </div>
    // <div>
    //   <h1>Login Page</h1>
    //   <button onClick={signInWithGoogle}>Sign in with Google</button>
    // </div>
  );
}



