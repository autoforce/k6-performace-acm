//1
import http from 'k6/http';
import { check, sleep } from 'k6';

//2
export const options = {
    stages: [
        {duration:'10s', target:'10'},//ramp up
        {duration:'10s', target:'10'},//carga nominal
        {duration:'10s', target:'0'},//ramp down
    ],
    thresholds: {
        checks: ['rate > 0.95'],
        http_req_duration: ['p(90) < 200']
    }
    
}

//3
export default function(){
    const BASE_URL = 'https://test-api.k6.io/public/crocodiles/';
    const req = http.get(BASE_URL);
    check(req, {
        'Status code 200': (r) => r.status === 200
    });

    // sleep(1);
}