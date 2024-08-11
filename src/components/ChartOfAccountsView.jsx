import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box } from '@atlaskit/primitives';
import TableTree from '@atlaskit/table-tree';
import Button from '@atlaskit/button/new';
import { serverUrl } from "../utils/constants"

const Code = (props) =>  <Box as="span">{props.code}</Box>;
const Name = (props) => <Box as="span">{props.name}</Box>;
const Type = (props) => <Box as="span">{props.type}</Box>;

const ChartOfAccounts = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAccounts = async () => {
      console.log("Fetching accounts...");
      try {
        const response = await fetch(`${serverUrl}/accounts`, {
          method: "GET",
          headers: {
            'Content-Type': 'application/json'
          }
        });

        const fetchedData = await response.json();
        console.log("Data received:", fetchedData);

        if (response.ok) {
          const tableContent = fetchedData.result.map((account) => {
            const mappedAccount = {
              id: account.id,
              content: {
                code: account.code,
                name: account.name,
                type: account.type
              }
            }
            return mappedAccount
          })
          setData(tableContent);
        } else {
          console.error('Failed to fetch accounts.');
          setError('Failed to fetch accounts.');
        }
      } catch (error) {
        console.error('Error fetching accounts:', error);
        setError('Error fetching accounts.');
      }
    };

    fetchAccounts();
  }, []);

  return (
    <div>
      <h2>Chart of Accounts</h2>
      {error && <p className="error">{error}</p>}
      <TableTree
        columns={[Code, Name, Type]}
        headers={['Code', 'Name', 'Type']}
        columnWidths={['120px', '200px', '200px']}
        items={data}
        label="Chart of Accounts"
      />
      <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
    </div>
  );
};

export default ChartOfAccounts;
