import React, { useEffect, useState } from 'react';
import Button from '@atlaskit/button/new';
import DynamicTable from '@atlaskit/dynamic-table';
import { Label } from '@atlaskit/form';
import { Text } from '@atlaskit/primitives';
import { useAuth } from '../../provider/authProvider';
import Heading from '@atlaskit/heading';
import { useParams, useNavigate } from 'react-router-dom';
import { getFormattedDate } from "../../utils/getFormattedDate"
import { serverUrl } from "../../utils/constants"

const JournalView = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const { journalId } = useParams();
  const [journal, setJournal] = useState()
  const [error, setError] = useState()

  useEffect(() => {
    const fetchJournal = async () => {
      try {
        const response = await fetch(`${serverUrl}/journal/${journalId}`, {
          method: "GET",
          headers: {
            'Content-Type': 'application/json',
            "Authorization": token
          }
        });

        const fetchedData = await response.json();

        if (response.ok) {
          setJournal(fetchedData.result);
          setError('');
        } else {
          setError('Failed to fetch journal.');
        }
      } catch (error) {
        setError('Error fetching journal.');
      }
    };

    fetchJournal();
  }, [])

  if (!journalId) {
    return <div>No journal to display</div>;
  }

  if (!journal) {
    return <>Loading...</>
  }

  if (error) {
    return <>{error}</>
  }

  const { date, title, lines } = journal;

  const head = {
    cells: [
      { key: 'account', content: 'Account', isSortable: false },
      { key: 'amount', content: 'Amount', isSortable: false },
      { key: 'type', content: 'Type', isSortable: false },
    ],
  };

  const rows = lines.map((line, index) => ({
    key: `row-${index}`,
    cells: [
      { key: `account-${index}`, content: line.account.name },
      { key: `amount-${index}`, content: line.amount },
      { key: `type-${index}`, content: line.entryType === 'DR' ? 'Debit' : 'Credit' },
    ],
  }));

  return (
    <div className="container">
      <div style={{ marginBottom: '20px' }}>
        <Heading size="large">Journal Details</Heading>
      </div>
      <div>
        <Label>Date:</Label> <Text>{getFormattedDate(new Date(date))}</Text>
      </div>
      <div>
        <Label>Description:</Label> <Text>{title}</Text>
      </div>
      <div >
        <div style={{ margin: '20px 0px' }}>
          <Heading size="medium">Journal Lines</Heading>
        </div>
        <DynamicTable
          head={head}
          rows={rows}
          rowsPerPage={5}
          defaultPage={1}
          loadingSpinnerSize="large"
          isRankable
        />
      </div>
      <Button onClick={() => navigate('/journal/list')}>Back to list</Button>

    </div>
  );
};

export default JournalView;
