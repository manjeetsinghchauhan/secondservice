const axios = require('axios');

async function testAPI() {
    try {
        const response = await axios.get('http://localhost:4000/secondservice/api/v1/admin/states-list', {
            headers: {
                'accept': 'application/json',
                'authorization': 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjQwMDAiLCJhdWQiOiJBRE1JTiIsInN1YiI6IjY4YjZhYjYyMzkzMTRmNzY0ZWQ0MzcxYiIsImRldmljZUlkIjoiMyIsImlhdCI6MTc1NzU3NjgwMywiZXhwIjoxNzczMTI4ODAzLCJwcm0iOiJjNzhlNzYxNGNiZGQyNGQ1OWYzMzg1MjBkM2ZkYTNiNzMwMzc0ZjBhMWQ3Njc1NjQ1ZDZlMzE0YTcxODA4NTg1YTM2MjQ2NDU0YmY3NTAxZGYwMDU1YTI3NjNjYjdhMzRjNmEyZGFiMGUwYzU5YmIzMWRlZGQ3ODE1ODJiZmM0MCJ9.oMCP5g_8iDUEMbljimATSBdZ4qsCcm-lvbb8UmP2is8E_0Sy4ygRAp9CzqmMN4ffkVICVsZGY-SsPvOvDTUAoVpqQUZYIiGOArXmpKnCTVx6_btw_nuY_rXmnG4FXoxV2RD_oRnsjeUheQXgHplkwuf15lM2c7InNPz-f3L364A20981-MlP8Y0I95mvEN7TF_ek7BO8Zo0NwxygGL1kXm4Hr9Wl26tmTT7AW-dFiJkLXQ01YoOrVd3APeLb7IvkbiZV32Hf3UKbqUCWQMPYN6GNLxpi3fPd-15g0HTfzOohE13DINUoV1zVDIqK3fhTxM0W4Umk5U1_zhgnEmfk4Q',
                'platform': '1',
                'timezone': 'Asia/Kolkata',
                'offset': '0',
                'accept-language': 'en',
                'api_key': '1234'
            }
        });
        
        console.log('Response status:', response.status);
        console.log('Response data length:', response.data.data.length);
        console.log('First 5 state names:');
        response.data.data.slice(0, 5).forEach((item, index) => {
            console.log(`${index + 1}. "${item.stateName}"`);
        });
        
        // Check for duplicates
        const stateNames = response.data.data.map(item => item.stateName);
        const uniqueStateNames = [...new Set(stateNames)];
        console.log(`\nTotal states: ${stateNames.length}`);
        console.log(`Unique states: ${uniqueStateNames.length}`);
        console.log(`Duplicates found: ${stateNames.length - uniqueStateNames.length}`);
        
    } catch (error) {
        console.error('Error:', error.message);
    }
}

testAPI();
