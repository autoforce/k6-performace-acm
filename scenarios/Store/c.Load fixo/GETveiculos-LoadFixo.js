//1
import http from 'k6/http';
import { check, sleep } from 'k6';

//2
export const options = {
    insecureSkipTLSVerify: true,
    stages: [
        {duration: '20m', target: 100}
    ],
    thresholds: {
        checks: ['rate > 0.95'],
        http_req_failed: ['rate < 0.1']
    }
};

//3
export default function () {
    const BASE_URL = 'https://autodealer.ac-stage.com';
    const res = http.get(`${BASE_URL}/veiculos/`);

    check(res, {
        'Veiculos carregados': (r) => r.status === 200
    });
}

