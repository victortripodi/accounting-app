
const serverUrl = "http://localhost:3001";

export const fetchEntities = async (entityType, token) => {
    try {
      const response = await fetch(`${serverUrl}/entity/findByType/${entityType}`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          "Authorization": token
        }
      });

      const fetchedData = await response.json();

      if (response.ok) {
        return fetchedData.result
      } else {
        console.error('Failed to fetch entities.');
        throw Error('Failed to fetch entities.');
      }
    } catch (error) {
      console.error('Error fetching entities:', error);
      throw Error('Error fetching entities.');
    }
}