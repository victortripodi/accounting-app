import React, { useEffect, useMemo, useState } from 'react';
import { Text } from '@atlaskit/primitives';
import { Chart } from 'react-charts';
import { useAuth } from '../provider/authProvider';
import { serverUrl } from "../utils/constants";
import Heading from '@atlaskit/heading';
import ResizableBox from "./ResizableBox";
import '../styles/Forms.css';

const Dashboard = () => {
  const { token } = useAuth();
  const [, setError] = useState('');
  const [chartDataRevenue, setChartDataRevenue] = useState([]);
  const [chartDataExpenses, setChartDataExpenses] = useState([]);

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

        const monthData = {};
        fetchedData.result.forEach((sale) => {
          const date = new Date(sale.date);
          const year = date.getFullYear();
          if (year === 2024) {
            const month = date.toLocaleString('default', { month: 'long' });
            monthData[month] = (monthData[month] || 0) + sale.amount;
          }
        });

        let chartDataArrayRevenue = [];

        for (const [key, value] of Object.entries(monthData)) {
          const item = {
            label: key,
            data: [
              {
                primary: key,
                secondary: value
              }
            ]
          };

          chartDataArrayRevenue = [...chartDataArrayRevenue, item];
        }

        setChartDataRevenue(chartDataArrayRevenue);
        if (!response.ok) {
          setError('Failed to fetch sales.');
        }
      } catch (error) {
        setError('Error fetching sales.');
      }
    };

    const fetchExpenses = async () => {
      try {
        const response = await fetch(`${serverUrl}/expenses`, {
          method: "GET",
          headers: {
            'Content-Type': 'application/json',
            "Authorization": token
          }
        });

        const fetchedData = await response.json();

        const monthData = {};
        fetchedData.result.forEach((expense) => {
          const date = new Date(expense.date);
          const year = date.getFullYear();
          if (year === 2024) {
            const month = date.toLocaleString('default', { month: 'long' });
            monthData[month] = (monthData[month] || 0) + expense.amount;
          }
        });

        let chartDataArrayExpenses = [];

        for (const [key, value] of Object.entries(monthData)) {
          const item = {
            label: key,
            data: [
              {
                primary: key,
                secondary: value
              }
            ]
          };

          chartDataArrayExpenses = [...chartDataArrayExpenses, item];
        }

        setChartDataExpenses(chartDataArrayExpenses);
        if (!response.ok) {
          setError('Failed to fetch expenses.');
        }
      } catch (error) {
        setError('Error fetching expenses.');
      }
    };

    fetchSales();
    fetchExpenses();
  }, [token]);

  const primaryAxis = useMemo(
    () => ({
      getValue: datum => datum.primary,
    }),
    []
  );

  const secondaryAxes = useMemo(
    () => [
      {
        getValue: datum => datum.secondary,
      },
    ],
    []
  );

  return (
    <div className='container'>
      <div className='header'>
        <Heading size="large">Dashboard</Heading>
      </div>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <div style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Text size="large" weight="bold"> Welcome!</Text>
          <Text size="medium" weight="medium"> Take a look at your data </Text>
          <Text weight="medium">
            To start adding insights to your reports, navigate to the Sales and Expenses modules.
          </Text>
        </div>
        {chartDataRevenue.length > 0 &&
          <div>
            <div className='heading'>
              <Heading size="small">Monthly Sales</Heading>
            </div>
            <ResizableBox>
              <Chart
                options={{
                  data: chartDataRevenue,
                  primaryAxis,
                  secondaryAxes,
                }}
              />
            </ResizableBox>
          </div>
        }
        {chartDataExpenses.length > 0 &&
          <div>
            <div style={{ marginTop: '20px' }} className='heading'>
              <Heading size="small">Monthly Expenses</Heading>
            </div>
            <ResizableBox>
              <Chart
                options={{
                  data: chartDataExpenses,
                  primaryAxis,
                  secondaryAxes,
                }}
              />
            </ResizableBox>
          </div>
        }
      </div>
    </div>
  );
};

export default Dashboard;
