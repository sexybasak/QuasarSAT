// api/test-db.js
import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
  const uri = process.env.MONGODB_URI;
  
  if (!uri) {
    return res.status(500).json({ error: 'MONGODB_URI not set' });
  }

  // Don't log full URI (security), just check format
  const hasPassword = uri.includes('://') && !uri.includes('<password>');
  
  if (!hasPassword) {
    return res.status(500).json({ error: 'Connection string missing password' });
  }

  try {
    const client = new MongoClient(uri);
    await client.connect();
    await client.db('admin').command({ ping: 1 });
    await client.close();
    
    res.status(200).json({ 
      status: '✅ MongoDB connected',
      user: uri.split('://')[1].split(':')[0] // Shows username only
    });
  } catch (error) {
    res.status(500).json({ 
      error: error.message,
      code: error.code,
      hint: 'Check: 1) Password correct, 2) User exists in Database Access, 3) IP whitelisted'
    });
  }
}
