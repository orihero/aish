const axios = require('axios');

const testBusinessRegistration = async () => {
  try {
    console.log('🧪 Testing Business Registration Endpoint...\n');

    const testData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@testcompany.com',
      password: 'password123',
      phone: '+1234567890',
      company: {
        name: 'Test Company Inc.',
        industry: 'Technology'
        // All other fields are now optional
      }
    };

    console.log('📤 Sending registration request...');
    console.log('Data:', JSON.stringify(testData, null, 2));

    const response = await axios.post('http://localhost:5000/api/auth/register-business', testData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('\n✅ Registration successful!');
    console.log('Response:', JSON.stringify(response.data, null, 2));

  } catch (error) {
    console.error('\n❌ Registration failed!');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Error:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
};

// Run the test
testBusinessRegistration();
