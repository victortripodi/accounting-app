import { serverUrl } from "../utils/constants"

export const fetchAccounts = async (accountType) => {

    const url = accountType ? `${serverUrl}/accounts/findByType/${accountType}` :`${serverUrl}/accounts`
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const fetchedData = await response.json();

      if (response.ok) {
        return fetchedData.result.map(account => ({
          label: account.name,
          value: account._id
        }));
      } else {
        console.error('Failed to fetch accounts.');
        throw Error('Failed to fetch accounts.');
      }
    } catch (error) {
      console.error('Error fetching accounts:', error);
      throw Error('Error fetching accounts.');
    }
}