
export default async function handler(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Method not allowed' });
    }
  
    const { email, password } = req.body;
  
    const BASE_URL = 'https://charming-ninnetta-knust-028ea081.koyeb.app/api/v1';
  
    try {
      const response = await fetch(`${BASE_URL}/users/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      if (!response.ok) {
        const error = await response.json();
        return res.status(response.status).json(error);
      }
  
      const data = await response.json();
      res.status(200).json(data); // Send the API response back to the client
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  }
  