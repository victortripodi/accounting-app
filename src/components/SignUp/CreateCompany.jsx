import React, { useState } from 'react';
import { Label } from '@atlaskit/form';
import Textfield from '@atlaskit/textfield';
import Button from '@atlaskit/button/new';
import { useNavigate } from 'react-router-dom';


const CreateCompany = ({ onSuccess }) => {
  const [companyName, setCompanyName] = useState('');
  const [abn, setAbn] = useState('');
  const [address, setAddress] = useState('');
  const [postcode, setPostcode] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();


  const handleCreateCompany = (e) => {
    e.preventDefault();

    if (abn.length !== 14) {
      setError('ABN must be 14 digits long!');
      return;
    }

    const company = { companyName, abn, address, postcode };
    console.log(company);

    // Call onSuccess to navigate to the dashboard and pass the company name
    onSuccess(company);
    // navigate('/dashboard');


    // // Clear form fields
    // setCompanyName('');
    // setAbn('');
    // setAddress('');
    // setState('');
    // setError('');
  };

  return (
    <div className="signupcontainer">
      <h2>Create Company</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleCreateCompany}>
        <div>
          <Label>Company Name:</Label>
          <Textfield
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            required
          />
        </div>
        <div>
          <Label>ABN:</Label>
          <Textfield
            type="text"
            value={abn}
            onChange={(e) => setAbn(e.target.value)}
            required
          />
        </div>
        <div>
          <Label>Address:</Label>
          <Textfield
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>
        <div>
          <Label>Postcode:</Label>
          <Textfield
            type="text"
            value={postcode}
            onChange={(e) => setPostcode(e.target.value)}
            required
          />
        </div>
        <div className="create-company-button">
          <Button type="submit" appearance="primary">Create Company</Button>
        </div>
      </form>
    </div>
  );
};

export default CreateCompany;
