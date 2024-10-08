import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Text } from '@atlaskit/primitives';
import { DatePicker } from '@atlaskit/datetime-picker';
import { Label } from '@atlaskit/form';
import { useNavigate } from 'react-router-dom';
import Select from '@atlaskit/select';
import Button from '@atlaskit/button/new';
import Textfield from '@atlaskit/textfield';
import SectionMessage from '@atlaskit/section-message';
import Heading from '@atlaskit/heading';
import { useAuth } from '../../provider/authProvider';
import { fetchAccounts } from "../../services/account";
import { fetchEntities } from "../../services/entities";
import { serverUrl } from "../../utils/constants";
import '../../styles/Forms.css';

const ExpenseCreate = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [vendors, setVendors] = useState();
  const [accountOptions, setAccountOptions] = useState([]);

  const [vendor, selectVendor] = useState([]);
  const [invoiceNumber, setInvoiceNumber] = useState();
  const [date, setDate] = useState();
  const [dueDate, setDueDate] = useState();
  const [description, setDescription] = useState();
  const [category, setCategory] = useState();
  const [tax, setTax] = useState();
  const [amount, setAmount] = useState(0);
  const [error, setErrors] = useState();

  const getVendors = useCallback(async () => {
    try {
      const result = await fetchEntities('vendor', token);
      const options = result.map(entity => ({
        label: entity.name,
        value: entity._id
      }));
      setVendors(options);
    } catch (error) {
      setErrors('Error fetching vendors.');
    }
  }, [token]);

  const getAccounts = useCallback(async () => {
    try {
      const result = await fetchAccounts('expense');
      setAccountOptions(result);
    } catch (error) {
      setErrors('Error fetching accounts.');
    }
  }, []);

  useEffect(() => {
    getVendors();
    getAccounts();
  }, [getVendors, getAccounts]);

  const [isExpenseSaved, setIsExpenseSaved] = useState(false);

  const handleSaveExpenses = useCallback(async () => {
    if (!date || !dueDate) {
      setErrors('Please select both an issue date and a due date.');
      return;
    }

    const expense = {
      vendor,
      date,
      dueDate,
      description,
      category,
      amount,
      tax
    };

    try {
      const response = await fetch(`${serverUrl}/expenses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', "Authorization": token },
        body: JSON.stringify(expense),
      });

      if (!response.ok) {
        throw new Error('Failed to save expense');
      }

      const data = await response.json();
      console.log('Expense saved successfully:', data);
      setIsExpenseSaved(true);
      // Clean data
      selectVendor('');
      setDate('');
      setDueDate('');
      setDescription('');
      setCategory('');
      setAmount('');
      setTax('');
      setErrors('');
    } catch (error) {
      console.error('Error saving entity:', error);
      setErrors('An error occurred while saving the expense.');
    }
  }, [amount, category, vendor, date, description, dueDate, tax, token]);

  const taxResult = useMemo(() => tax === '10%' ? amount * 0.1 : 0, [tax, amount]);

  return (
    <div className="container">
      <div className='header'>
        <Heading size="large">Create Invoice</Heading>
        <div>
          <Button appearance='primary' onClick={() => navigate('/entity/create')}>Create vendor</Button>
          <Button onClick={() => navigate('/entity/list')}>View vendors</Button>
        </div>
      </div>
      {error && <SectionMessage appearance="error"><p>{error}</p></SectionMessage>}

      <div style={{ display: 'flex' }}>
        <div style={{ marginRight: '10px' }}>
          <Label>Issue Date</Label>
          <DatePicker
            onChange={(date) => setDate(date ? new Date(date) : null)}
          />
        </div>
        <div>
          <Label>Due Date</Label>
          <DatePicker
            onChange={(date) => setDueDate(date ? new Date(date) : null)}
          />
        </div>
      </div>
      <Label>Vendor</Label>
      <Select
        options={vendors}
        onChange={(selectedOption) => selectVendor(selectedOption.value)}
        noOptionsMessage={() => "Please create a vendor"}
      />
      <Label>Invoice number</Label>
      <Textfield
        type="number"
        value={invoiceNumber}
        onChange={(e) => setInvoiceNumber(e.target.value)}
      />

      <div>
        <Label>Description</Label>
        <Textfield
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Label>Account</Label>
        <Select
          options={accountOptions}
          onChange={(selectedOption) => setCategory(selectedOption.value)}
        />
        <Label>Amount</Label>
        <Textfield
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <Label>Tax</Label>
        <Select
          options={[
            {
              label: '10%',
              value: '10%'
            },
            {
              label: 'exempt',
              value: 'exempt'
            }
          ]}
          onChange={(selectedOption) => setTax(selectedOption.value)}
        />
      </div>

      <div className='total-footer'>
        <Text>Subtotal: {amount}</Text>
        <Text>Tax: {taxResult}</Text>
        <Text>Total: {Number(taxResult) + Number(amount)}</Text>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button onClick={() => navigate('/expenses/list')}>Back to list</Button>
        <Button onClick={handleSaveExpenses} appearance="primary">Save Expense</Button>
      </div>
      {isExpenseSaved && (
        <SectionMessage appearance="success">
          <Text>The expense has been saved.</Text>
        </SectionMessage>
      )}
    </div>
  );
};

export default ExpenseCreate;
