import React, { useEffect, useState } from 'react';
import Heading from '@atlaskit/heading';
import { Label } from '@atlaskit/form';
import { Text } from '@atlaskit/primitives';
import Button from '@atlaskit/button/new';
import DynamicTable from '@atlaskit/dynamic-table';
import { useAuth } from '../../provider/authProvider';
import { useParams, useNavigate } from 'react-router-dom';
import { getFormattedDate } from "../../utils/getFormattedDate";
import { serverUrl } from "../../utils/constants"
import '../../styles/Forms.css'

const ExpensesView = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const { expenseId } = useParams();
  const [expense, setExpense] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchExpense = async () => {
      try {
        console.log('Fetching expense with ID:', expenseId);

        const response = await fetch(`${serverUrl}/expenses/${expenseId}`, {
          method: "GET",
          headers: {
            'Content-Type': 'application/json',
            "Authorization": token
          }
        });

        const fetchedData = await response.json();
        console.log('Fetched Data:', fetchedData);

        if (response.ok) {
          console.log('Expense fetched successfully:', fetchedData.result);
          setExpense(fetchedData.result);
          setError('');
        } else {
          console.error('Failed to fetch expense. Message:', fetchedData.message);
          setError('Failed to fetch expense.');
        }
      } catch (error) {
        console.error('Error fetching expense:', error);
        setError('Error fetching expense.');
      }
    };

    fetchExpense();
  }, [expenseId, token]);

  if (!expenseId) {
    return <div>No Expense to display</div>;
  }

  if (!expense && !error) {
    return <div>Loading...</div>;
  }

  if (error) {
    console.error('Error state:', error);
    return <div>{error}</div>;
  }

  const head = {
    cells: [
      { key: 'account', content: 'Account', isSortable: false },
      { key: 'amount', content: 'Amount', isSortable: false },
      { key: 'tax', content: 'Tax', isSortable: false },
    ],
  };

  const rows = [{
    key: `row-1`,
    cells: [
      { key: 'account', content: expense.category.name },
      { key: 'amount', content: expense.amount },
      { key: 'tax', content: expense.tax },
    ],
  }];


  return (
    <div className='container'>
      <div className='header'>
        <Heading size="large">Expenses Details</Heading>
      </div>
      <div>
        <Label>Date:</Label> <Text>{getFormattedDate(new Date(expense.date))}</Text>
      </div>
      <div>
        <Label>Due Date:</Label>
        <Text>{getFormattedDate(new Date(expense.dueDate))}</Text>
      </div>
      <div>
        <Label>Description:</Label>
        <Text>{expense.description}</Text>
      </div >
      <div>
        <Label>Vendor:</Label>
        <Text>{expense.vendor.name}</Text>
      </div>
      <div className='heading'>
        <Heading size="medium">Expenses Lines</Heading>
      </div>
      <DynamicTable
        head={head}
        rows={rows}
        rowsPerPage={5}
        defaultPage={1}
        loadingSpinnerSize="large"
        isRankable
      />
      <Button onClick={() => navigate('/expenses/list')}>Back to list</Button>
    </div>
  );
};

export default ExpensesView;
