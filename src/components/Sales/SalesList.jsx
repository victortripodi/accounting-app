import React, { useEffect, useState, useCallback, useMemo } from 'react';
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

const SalesList = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [error, setError] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const response = await fetch(`${serverUrl}/sales`, {
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
    };

    fetchSales();
  }, [token]);


  useEffect(() => {
    if (startDate && endDate) {
      const filtered = allData.filter(sales => {
        const salesDate = new Date(sales.date);
        return salesDate >= new Date(startDate) && salesDate <= new Date(endDate);
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
      { key: 'customer', content: 'Customer', isSortable: true },
      { key: 'actions', content: 'Actions' }
    ]
  }), []);

  const tableContent = useMemo(() =>
    filteredData.map((sales) => ({
      key: sales._id,
      date: sales.date,
      description: sales.description,
      cells: [
        { key: 'date', content: getFormattedDate(new Date(sales.date)) },
        { key: 'description', content: sales.description },
        { key: 'customer', content: sales.customer.name },

        {
          key: 'actions', content: <>
            <Button appearance="subtle" onClick={() => navigate(`/sales/view/${sales._id}`)}>View</Button>
          </>
        }
      ]
    })), [filteredData])

  if (tableContent.length === 0 && !error) {
    return (
      <EmptyState
        path="/sales/create"
        name="invoice"
      />
    );
  }

  return (
    <div className='container'>
      <div className='header'>
        <Heading size="large">Find sales invoices</Heading>
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
        <Button appearance='primary' onClick={() => navigate('/sales/create')}>Create Invoice</Button>
      </div>
    </div>
  );
};

export default SalesList;
