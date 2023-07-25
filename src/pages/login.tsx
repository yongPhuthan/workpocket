import { Button } from '@material-ui/core';
import { auth, GoogleProvider } from '../../firebase';
import { signInWithPopup,signInWithRedirect } from "firebase/auth";
import React from 'react';

const LoginPage = () => {
  const signIn = () => {
    signInWithRedirect(auth, GoogleProvider)
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        console.error('error',error);
      });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <h1>Welcome to My App</h1>
      <button  color="primary" onClick={signIn}>
        Sign in with Google
      </button>
    </div>
  );
};

export default LoginPage;
