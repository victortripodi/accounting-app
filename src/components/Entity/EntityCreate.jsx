import React, { useState, useCallback } from 'react';
import { Text } from '@atlaskit/primitives';
import { Label } from '@atlaskit/form';
import { useNavigate } from 'react-router-dom';
import { Box } from '@atlaskit/primitives';
import { Radio } from '@atlaskit/radio';
import Button from '@atlaskit/button/new';
import Textfield from '@atlaskit/textfield';
import Heading from '@atlaskit/heading';
import SectionMessage from '@atlaskit/section-message';
import { useAuth } from '../../provider/authProvider';
import { serverUrl } from "../../utils/constants"
import '../../styles/Forms.css'


const EntityCreate = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [type, setType] = useState('vendor')
  const [name, setName] = useState('')
  const [ABN, setABN] = useState()
  const [email, setEmail] = useState()
  const [address, setAddress] = useState()
  const [postcode, setPostcode] = useState()

  const [isEntitySaved, setIsEntitySaved] = useState(false)

  const handleSaveEntity = useCallback(async () => {

    const entity = {
      type,
      name,
      ABN,
      email,
      address,
      postcode
    }

    try {
      const response = await fetch(`${serverUrl}/entity`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', "Authorization": token },
        body: JSON.stringify(entity),
      });

      if (!response.ok) {
        throw new Error('Failed to save entity');
      }

      const data = await response.json();
      console.log('Entity saved successfully:', data);
      setIsEntitySaved(true);
      // clean data
      setType('')
      setName('')
      setABN('')
      setEmail('')
      setAddress('')
      setPostcode('')
    } catch (error) {
      console.error('Error saving entity:', error);
    }
  }, [])

  return (
    <div className='container'>
      <div className='header'>
        <Heading size="large">Create entity</Heading>
        <Button onClick={() => navigate('/entity/list')}>Back to list</Button>
      </div>
      <Label>Type</Label>
      <Box>
        <Radio
          value="vendor"
          label="Vendor"
          isChecked={type === 'vendor'}
          onChange={() => setType('vendor')}
        />
        <Radio
          value="customer"
          label="Customer"
          isChecked={type === 'customer'}
          onChange={() => setType('customer')}
        />
      </Box>
      <Label>Name</Label>
      <Textfield
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Label>ABN</Label>
      <Textfield
        type="number"
        value={ABN}
        onChange={(e) => setABN(e.target.value)}
      />
      <Label>Email</Label>
      <Textfield
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Label>Address</Label>
      <Textfield
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <Label>Postcode</Label>
      <Textfield
        type="text"
        value={postcode}
        onChange={(e) => setPostcode(e.target.value)}
      />

      <div style={{ padding: '20px 0px' }}>
        <Button onClick={handleSaveEntity} appearance="primary">Save Entity</Button>
        {isEntitySaved && (
          <div style={{ padding: '20px 0px' }}>
            <SectionMessage appearance="success">
              <Text>The entity has been saved.</Text>
            </SectionMessage>
          </div>
        )}
      </div>
    </div>)
};

export default EntityCreate;
