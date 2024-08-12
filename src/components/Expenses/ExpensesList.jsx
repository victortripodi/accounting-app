import React, { useEffect, useState, useMemo } from 'react';
import Spinner from '@atlaskit/spinner';
import { Label } from '@atlaskit/form';
import { useNavigate } from 'react-router-dom';
import Button from '@atlaskit/button/new';
import DynamicTable from '@atlaskit/dynamic-table';
import { DatePicker } from '@atlaskit/datetime-picker';
import Heading from '@atlaskit/heading';
import { useAuth } from '../../provider/authProvider';
import { getFormattedDate } from "../../utils/getFormattedDate"
import { serverUrl } from "../../utils/constants"
import EmptyState from "../EmptyState"
import '../../styles/Forms.css'

const ExpensesList = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [error, setError] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        setLoading(true)
        const response = await fetch(`${serverUrl}/expenses`, {
          method: "GET",
          headers: {
            'Content-Type': 'application/json',
            "Authorization": token
          }
        });

        const fetchedData = await response.json();

        if (response.ok) {
          setAllData(fetchedData.result);
          setFilteredData(fetchedData.result);
          setError('');
        } else {
          setError('Failed to fetch journals.');
        }
      } catch (error) {
        setError('Error fetching journals.');
      }
      setLoading(false)
    };

    fetchExpenses();
  }, [token]);


  useEffect(() => {
    if (startDate && endDate) {
      const filtered = allData.filter(expenses => {
        const expensesDate = new Date(expenses.date);
        return expensesDate >= new Date(startDate) && expensesDate <= new Date(endDate);
      });
      setFilteredData(filtered);
    } else {
      setFilteredData(allData);
    }
  }, [startDate, endDate, allData]);

  const head = useMemo(() => ({
    cells: [
      { key: 'date', content: 'Date', isSortable: true },
      { key: 'description', content: 'Description', isSortable: true },
      { key: 'vendor', content: 'Vendor', isSortable: true },
      { key: 'actions', content: 'Actions' }
    ]
  }), []);

  const tableContent = useMemo(() =>
    filteredData.map((expenses) => ({
      key: expenses._id,
      date: expenses.date,
      description: expenses.description,
      cells: [
        { key: 'date', content: getFormattedDate(new Date(expenses.date)) },
        { key: 'description', content: expenses.description },
        { key: 'vendor', content: expenses.vendor.name },

        {
          key: 'actions', content: <>
            <Button appearance="subtle" onClick={() => navigate(`/expenses/view/${expenses._id}`)}>View</Button>
          </>
        }
      ]
    })), [filteredData, navigate])


  if (isLoading) {
    return <div className='loading'>
      <Spinner size={"large"} label="Loading" />
    </div>
  }

  if (tableContent.length === 0 && !error) {
    return (
      <EmptyState
        path="/expenses/create"
        name="invoice"
      />
    );
  }

  return (
    <div className='container'>
      <div className='header'>
        <Heading size="large">Find expenses invoices</Heading>
        {error && <p className="error">{error}</p>}
      </div>
      <div className='list-date-header'>
        <div style={{ marginRight: '10px' }}>
          <Label>Start Date: </Label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date ? new Date(date) : null)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            isClearable
            placeholderText="Select a start date"
          />
        </div>
        <div style={{ marginRight: '10px' }}>
          <Label>End Date: </Label>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date ? new Date(date) : null)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            isClearable
            placeholderText="Select an end date"
          />
        </div>
      </div>
      <DynamicTable
        head={head}
        rows={tableContent}
        rowsPerPage={5}
        defaultPage={1}
        loadingSpinnerSize="large"
        isLoading={tableContent.length === 0 && !error}
        isSortable
      />
      <div className='list-footer'>
        <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
        <Button appearance='primary' onClick={() => navigate('/expenses/create')}>Create Invoice</Button>
      </div>
    </div>
  );
};

export default ExpensesList;
