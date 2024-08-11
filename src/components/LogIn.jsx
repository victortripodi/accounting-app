import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Label } from '@atlaskit/form';
import Textfield from '@atlaskit/textfield';
import Button from '@atlaskit/button/new';
import { useAuth } from '../provider/authProvider';
import { serverUrl } from "../utils/constants";
import '../styles/SignUp.css';

const LogIn = () => {
  const { setToken } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = useCallback(async (e) => {
    e.preventDefault();

    const user = { email, password };
    try {
        const response = await fetch(`${serverUrl}/users/jwt`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user),
        });

        const responseJSON = await response.json();

        if (response.status === 200) {
            setToken(responseJSON.jwt);
            navigate('/dashboard');
        } else {
            setError(responseJSON.message || "An error occurred");
        }

    } catch (error) {
        setError("An error occurred during login");
        console.log("error", { error });
    }
    // Clear form fields
    setEmail('');
    setPassword('');
  }, [email, password, setToken, navigate]);

  return (
    <div className="signupcontainer">
      <h2 style={{ textAlign: 'center' }}>Ready to manage your finances?</h2>
      <h4>Login to continue</h4>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleLogin}>
        <div>
          <Label>Email:</Label>
          <Textfield
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <Label>Password:</Label>
          <Textfield
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p>Not yet with us? <span onClick={() => navigate('/sign-up')} style={{color: 'blue', cursor: 'pointer', textDecoration: 'underline'}}>Create an account</span></p>
          <Button type="submit" appearance="primary">Login</Button>
        </div>
      </form>
    </div>
  );
};

export default LogIn;
