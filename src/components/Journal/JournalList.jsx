import React, { useEffect, useState, useCallback, useMemo } from 'react';
import Heading from '@atlaskit/heading';
import { Label } from '@atlaskit/form';
import { useNavigate } from 'react-router-dom';
import Button from '@atlaskit/button/new';
import DynamicTable from '@atlaskit/dynamic-table';
import { useAuth } from '../../provider/authProvider';
import { DatePicker } from '@atlaskit/datetime-picker';
import { getFormattedDate } from "../../utils/getFormattedDate"
import { serverUrl } from "../../utils/constants"
import EmptyState from "../EmptyState"
import '../../styles/Forms.css'


const JournalList = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [error, setError] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleDelete = useCallback(async (journalToDelete) => {
    if (!journalToDelete) return;

    try {
      const response = await fetch(`${serverUrl}/journal/${journalToDelete}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": token
        }
      });

      if (response.ok) {
        setAllData(allData.filter(journal => journal._id !== journalToDelete));
        setFilteredData(filteredData.filter(journal => journal._id !== journalToDelete));
        setError('');
      } else {
        setError('Failed to delete journal.');
      }
    } catch (error) {
      setError('Error deleting journal.');
    }
  }, [allData, filteredData]);



  useEffect(() => {
    const fetchJournals = async () => {
      try {
        const response = await fetch(`${serverUrl}/journal`, {
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

    fetchJournals();
  }, [token]);


  useEffect(() => {
    if (startDate && endDate) {
      const filtered = allData.filter(journal => {
        const journalDate = new Date(journal.date);
        return journalDate >= new Date(startDate) && journalDate <= new Date(endDate);
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
      { key: 'actions', content: 'Actions' }
    ]
  }), []);

  const tableContent = useMemo(() =>
    filteredData.map((journal) => ({
      key: journal._id,
      date: journal.date,
      description: journal.title,
      cells: [
        { key: 'date', content: getFormattedDate(new Date(journal.date)) },
        { key: 'description', content: journal.title },
        {
          key: 'actions', content: <>
            <Button appearance="danger" onClick={() => handleDelete(journal._id)}>Delete</Button>
            <Button appearance="subtle" onClick={() => navigate(`/journal/view/${journal._id}`)}>View</Button>
          </>
        }
      ]
    })), [filteredData, navigate, handleDelete]);

  if (tableContent.length === 0 && !error) {
    return (
      <EmptyState
        path="/journal/create"
        name="journals"
      />
    );
  }


  return (
    <div className='container'>
      <div className='header'>

        <Heading size="large">Find journals</Heading>
        {error && <p className="error">{error}</p>}
      </div>
      <div style={{ paddingHorizontal: '20px', paddingBottom: '20px', display: 'flex' }}>
        <div style={{ marginRight: '10px' }}>
          <Label>Start Date: </Label>
          <DatePicker className="date-picker"
            selected={startDate}
            onChange={(date) => setStartDate(date ? new Date(date) : null)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            isClearable
            placeholderText="Select a start date"
          />
        </div>
        <div>
          <Label>End Date: </Label>
          <DatePicker className="date-picker"
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
        isFixedSize
        defaultSortKey="date"
        defaultSortOrder="ASC"
      />
      <div className='list-footer'>
        <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
        <Button appearance='primary' onClick={() => navigate('/journal/create')}>Create Journal</Button>
      </div>
    </div>
  );
};

export default JournalList;
