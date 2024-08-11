import React, { useState, useEffect } from 'react';
import { Text } from '@atlaskit/primitives';
import { useNavigate } from 'react-router-dom';
import Select from '@atlaskit/select';
import DynamicTable from '@atlaskit/dynamic-table';
import Button from '@atlaskit/button/new';
import { Label } from '@atlaskit/form';
import Textfield from '@atlaskit/textfield';
import Heading from '@atlaskit/heading';
import SectionMessage from '@atlaskit/section-message';
import { fetchAccounts } from "../../services/account"
import { useAuth } from '../../provider/authProvider';
import { serverUrl } from "../../utils/constants"
import '../../styles/Forms.css'

const typeOptions = [
  { label: 'Debit', value: 'DR' },
  { label: 'Credit', value: 'CR' }
];

// Table header configuration
const head = {
  cells: [
    { key: 'account', content: 'Account', isSortable: true },
    { key: 'amount', content: 'Amount', isSortable: true },
    { key: 'type', content: 'Type', isSortable: true },
    { key: 'actions', content: 'Actions' },
  ],
};

const emptyLineData = {
  accountId: '',
  accountName: '',
  amount: '',
  type: '',
}
const emptyHeaderData = {
  date: '',
  description: '',
}

const JournalCreate = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [headerData, setHeaderData] = useState(emptyHeaderData);
  const [lineData, setLineData] = useState(emptyLineData);
  const [journalLines, setJournalLines] = useState([]);
  const [errors, setErrors] = useState({});
  const [totals, setTotals] = useState({ dr: 0, cr: 0 });
  const [accountOptions, setAccountOptions] = useState([]);
  const [isJournalSaved, setIsJournalSaved] = useState(false);

  const getAccounts = async () => {
    try {
      const options = await fetchAccounts();
      setAccountOptions(options);
    } catch (error) {
      setErrors('Error fetching accounts.');
    }
  };

  useEffect(() => {
    getAccounts();
  }, []);

  useEffect(() => {
    const drTotal = journalLines
      .filter(line => line.type === 'DR')
      .reduce((acc, line) => acc + parseFloat(line.amount), 0);

    const crTotal = journalLines
      .filter(line => line.type === 'CR')
      .reduce((acc, line) => acc + parseFloat(line.amount), 0);

    setTotals({ dr: drTotal, cr: crTotal });
  }, [journalLines]);

  // Handlers
  const handleHeaderChange = (field, value) => {
    setHeaderData({
      ...headerData,
      [field]: value
    });
  };

  const handleLineChange = (field, value) => {
    if (field === 'account') {
      setLineData({
        ...lineData,
        accountId: value.value,
        accountName: value.label
      });
    } else {
      setLineData({
        ...lineData,
        [field]: value
      });
    }
  };

  const handleDelete = (index) => {
    setJournalLines(journalLines.filter((_, i) => i !== index));
  };

  const handleSaveLine = (event) => {
    event.preventDefault();
    const fieldErrors = validateFields();
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
    } else {
      setJournalLines([...journalLines, lineData]);
      setErrors({});
    }
  };

  const handleSaveJournal = async () => {
    if (totals.dr !== totals.cr) {
      alert('Total debit and credit amounts must match before saving the journal.');
      return;
    }

    const journal = {
      date: headerData.date,
      title: headerData.description,
      lines: journalLines
    };
    try {
      const response = await fetch(`${serverUrl}/journal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', "Authorization": token },
        body: JSON.stringify(journal),
      });

      if (!response.ok) {
        throw new Error('Failed to save journal');
      }

      const data = await response.json();
      console.log('Journal saved successfully:', data);
      setIsJournalSaved(true);
      // clean data
      setHeaderData(emptyHeaderData)
      setLineData(emptyLineData)
      setJournalLines([])
    } catch (error) {
      console.error('Error saving journal:', error);
    }
  };

  // Function to validate form fields
  const validateFields = () => {
    const newErrors = {};
    if (!headerData.date) newErrors.date = 'Date is required';
    if (!headerData.description) newErrors.description = 'Description is required';
    if (!lineData.accountId) newErrors.accountId = 'Account is required';
    if (!lineData.amount) newErrors.amount = 'Amount is required';
    if (!lineData.type) newErrors.type = 'Type is required';
    return newErrors;
  };

  // Mapping journal lines to table rows
  const rows = journalLines.map((line, index) => ({
    key: `row-${index}`,
    cells: [
      { key: `account-${index}`, content: line.accountName },
      { key: `amount-${index}`, content: line.amount },
      { key: `type-${index}`, content: line.type },
      { key: `actions-${index}`, content: <Button appearance="danger" onClick={() => handleDelete(index)}>Delete</Button> },
    ],
  }));

  return (
    <div className="container">
      <div className="header-fields">
        <div>
          <Heading size="large">Create general journal</Heading>
        </div>
        <Label>Date</Label>
        <Textfield
          type="date"
          value={headerData.date}
          onChange={(e) => handleHeaderChange('date', e.target.value)}
        />
        {errors.date && <span style={{ color: 'red' }}>{errors.date}</span>}
      </div>
      <div>
        <Label>Description</Label>
        <Textfield
          type="text"
          value={headerData.description}
          onChange={(e) => handleHeaderChange('description', e.target.value)}
        />
        {errors.description && <span style={{ color: 'red' }}>{errors.description}</span>}
      </div>
      <div>
        <div style={{ marginTop: '20px' }}>
          <Heading size="medium">Journal lines</Heading>
        </div>
        <div>
          <Label>Account</Label>
          <Select
            options={accountOptions}
            onChange={(selectedOption) => handleLineChange('account', selectedOption)}
          />
          {errors.account && <span style={{ color: 'red' }}>{errors.account}</span>}
        </div>
        <div>
          <Label>Amount</Label>
          <Textfield
            type="number"
            value={lineData.amount}
            onChange={(e) => handleLineChange('amount', e.target.value)}
          />
          {errors.amount && <span style={{ color: 'red' }}>{errors.amount}</span>}
        </div>
        <div style={{ paddingBottom: '20px' }}>
          <Label>Type</Label>
          <Select
            options={typeOptions}
            onChange={(selectedOption) => handleLineChange('type', selectedOption.value)}
          />
          {errors.type && <span style={{ color: 'red' }}>{errors.type}</span>}
        </div>
        <div style={{ paddingBottom: '20px' }}>
          <Button onClick={handleSaveLine} appearance="discovery">Add journal line</Button>
        </div>
      </div>
      <div style={{ paddingTop: '10px' }}>
        <Heading size="medium">Journal</Heading>
        <DynamicTable
          head={head}
          rows={rows}
          rowsPerPage={5}
          defaultPage={1}
          isSortable
          loadingSpinnerSize="large"
        />
        <div className='total-footer'>
          <Text>Total Debit: {totals.dr}</Text>
          <Text>Total Credit: {totals.cr}</Text>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><Button onClick={() => navigate('/journal/list')}>Back to list</Button>
        <Button onClick={handleSaveJournal} appearance="primary">Save Journal</Button>
      </div>
      {isJournalSaved && (
        <SectionMessage appearance="success">
          <p>The journal has been saved.</p>
        </SectionMessage>
      )}
    </div>
  );
};

export default JournalCreate;
