import React, { useState } from 'react';
import { Label, HelperMessage } from '@atlaskit/form';
import Textfield from '@atlaskit/textfield';
import Button from '@atlaskit/button/new';
import '../../styles/SignUp.css';

const SignUp = ({ onSubmit }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignUp = (e) => {
    e.preventDefault();
    if (password.length < 8) {
      setError('Password must be at least 8 characters long!');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    const user = { email, password };
    console.log(user);
   
    onSubmit(user)
  };

  return (
    <div className="signupcontainer">
      <h2 style={{ textAlign: 'center' }}>Welcome to vTax</h2>
      <h4>Simplifying your accounting, so you can focus on what you do best.</h4>
      {error && <p>{error}</p>}
      <form>
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
        <div>
          <Label>Confirm Password:</Label>
          <Textfield
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <HelperMessage>Password must be at least 8 characters long</HelperMessage>
        </div>
        <div className="signup-button">
          <Button type="submit" appearance="primary" onClick={handleSignUp}>Sign up</Button>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
