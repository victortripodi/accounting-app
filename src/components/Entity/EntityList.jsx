import React, { useEffect, useState, useMemo } from 'react';
import { Label } from '@atlaskit/form';
import Heading from '@atlaskit/heading';
import Select from '@atlaskit/select';
import { useNavigate } from 'react-router-dom';
import Button from '@atlaskit/button/new';
import DynamicTable from '@atlaskit/dynamic-table';
import { useAuth } from '../../provider/authProvider';
import { serverUrl } from "../../utils/constants"
import EmptyState from "../EmptyState"

const EntityList = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [error, setError] = useState('');
  const [entityType, setEntityType] = useState(null);

  useEffect(() => {
    const fetchEntities = async () => {
      try {
        const response = await fetch(`${serverUrl}/entity`, {
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
          setError('Failed to fetch entity.');
        }
      } catch (error) {
        setError('Error fetching entity.');
      }
    };

    fetchEntities(null, token);
  }, [token]);


  useEffect(() => {
    if (entityType) {
      const filtered = allData.filter(entity => entity.type === entityType);
      setFilteredData(filtered);
    } else {
      setFilteredData(allData);
    }
  }, [entityType, allData]);

  const head = useMemo(() => ({
    cells: [
      { key: 'name', content: 'Name', isSortable: false },
      { key: 'abn', content: 'ABN', isSortable: false },
      { key: 'email', content: 'Email', isSortable: false },
      { key: 'type', content: 'Type', isSortable: false },
      { key: 'address', content: 'Address', isSortable: false },
      { key: 'postcode', content: 'Postcode', isSortable: false },
    ]
  }), []);

  const tableContent = useMemo(() =>
    filteredData.map((entity) => ({
      key: entity._id,
      cells: [
        { key: 'name', content: entity.name },
        { key: 'abn', content: entity.ABN },
        { key: 'email', content: entity.email },
        { key: 'type', content: entity.type },
        { key: 'address', content: entity.address },
        { key: 'postcode', content: entity.postcode },
      ]
    })), [filteredData]);

  if (tableContent.length === 0 && !error) {
    return (
      <EmptyState
        path="/entity/create"
        name="entity"
      />
    );
  }

  return (
    <div className='container'>
      <div className='header'>
        <Heading size="large">Find Customer</Heading>
      </div>
      {error && <p className="error">{error}</p>}
      <div className='date-picker' style={{ paddingBottom: '20px' }}>
        <Label>Customer type </Label>
        <Select
          isClearable
          options={[
            {
              label: 'Vendor',
              value: 'vendor'
            },
            {
              label: 'Customer',
              value: 'customer'
            }
          ]}
          onChange={(selectedOption) => setEntityType(selectedOption ? selectedOption.value : null)}
        />
      </div>
      <DynamicTable
        head={head}
        rows={tableContent}
        rowsPerPage={9}
        defaultPage={1}
        loadingSpinnerSize="large"
        isLoading={tableContent.length === 0 && !error}
        isFixedSize
      />
      <div className='list-footer'>

        <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
        <Button appearance='primary' onClick={() => navigate('/entity/create')}>Create Entity</Button>
      </div>
    </div>

  );
};

export default EntityList;
