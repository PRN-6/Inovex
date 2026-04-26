import http from 'k6/http';
import { check, sleep } from 'k6';

// --- LOAD TEST CONFIGURATION ---
export const options = {
    stages: [
        { duration: '30s', target: 500 }, // Ramp up to 500 users
        { duration: '1m', target: 500 },  // Stay at 500 users for 1 minute
        { duration: '30s', target: 0 },   // Ramp down
    ],
    thresholds: {
        http_req_failed: ['rate<0.01'], // Fail if more than 1% of requests error
        http_req_duration: ['p(95)<500'], // 95% of requests must be under 500ms
    },
};

// --- TEST SCENARIO ---
export default function () {
    const url = 'http://localhost:5000/api/register';
    
    // Generate randomized student data
    const payload = JSON.stringify({
        name: `Test Student ${Math.floor(Math.random() * 1000)}`,
        email: `test_${Date.now()}_${Math.random().toString(36).substr(2, 5)}@college.edu`,
        phone: "9876543210",
        college: "INOVEX INSTITUTE",
        usn: `1RV22CS${Math.floor(Math.random() * 9999).toString().padStart(4, '0')}_${Math.random().toString(36).substr(2, 3).toUpperCase()}`,
        year: "3",
        department: "CSE",
        registrations: [
            { eventName: "RexHack", teammates: [] },
            { eventName: "Techsaurus", teammates: [] }
        ],
        amount: 700,
        transactionId: `K6_TEST_${Math.random().toString(36).substr(2, 5).toUpperCase()}`
    });

    const params = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    // 1. Check System Status
    const statusRes = http.get('http://localhost:5000/api/status');
    check(statusRes, { 'System is online': (r) => r.json().maintenance === false });

    // 2. Submit Registration
    const res = http.post(url, payload, params);

    check(res, {
        'Registration successful': (r) => r.status === 201,
        'Response time < 200ms': (r) => r.timings.duration < 200,
    });

    sleep(1); // Wait 1 second before the next registration attempt
}
