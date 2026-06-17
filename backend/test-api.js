const axios = require('axios');

async function test() {
  try {
    const res = await axios.post('http://localhost:5000/api/messages', {
      name: 'Test',
      phone: '9898558222',
      email: '',
      message: 'Hi'
    });
    console.log('Success:', res.data);
  } catch (err) {
    console.error('Error Status:', err.response?.status);
    console.error('Error Data:', err.response?.data);
  }
}

test();
