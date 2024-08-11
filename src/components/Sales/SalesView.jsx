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

const SalesView = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const { saleId } = useParams();
  const [sale, setSale] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSale = async () => {
      try {
        console.log('Fetching sale with ID:', saleId);

        const response = await fetch(`${serverUrl}/sales/${saleId}`, {
          method: "GET",
          headers: {
            'Content-Type': 'application/json',
            "Authorization": token
          }
        });

        const fetchedData = await response.json();
        console.log('Fetched Data:', fetchedData);

        if (response.ok) {
          console.log('Sale fetched successfully:', fetchedData.result);
          setSale(fetchedData.result);
          setError('');
        } else {
          console.error('Failed to fetch sale. Message:', fetchedData.message);
          setError('Failed to fetch sale.');
        }
      } catch (error) {
        console.error('Error fetching sale:', error);
        setError('Error fetching sale.');
      }
    };

    fetchSale();
  }, [saleId, token]);

  if (!saleId) {
    return <div>No Sale to display</div>;
  }

  if (!sale && !error) {
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
      { key: 'account', content: sale.category.name },
      { key: 'amount', content: sale.amount },
      { key: 'tax', content: sale.tax },
    ],
  }];


  return (
    <div className='container'>
      <div className='header'>
        <Heading size="large">Sales Details</Heading>
      </div>
      <div>
        <Label>Date:</Label> <Text>{getFormattedDate(new Date(sale.date))}</Text>
      </div>
      <div>
        <Label>Due Date:</Label>
        <Text>{getFormattedDate(new Date(sale.dueDate))}</Text>
      </div>
      <div>
        <Label>Description:</Label>
        <Text>{sale.description}</Text>
      </div >
      <div>
        <Label>Customer:</Label>
        <Text>{sale.customer.name}</Text>
      </div>
      <div className='heading'>
        <Heading size="medium">Sales Lines</Heading>
      </div>
      <DynamicTable
        head={head}
        rows={rows}
        rowsPerPage={5}
        defaultPage={1}
        loadingSpinnerSize="large"
        isRankable
      />
      <Button onClick={() => navigate('/sales/list')}>Back to list</Button>
    </div>
  );
};

export default SalesView;
