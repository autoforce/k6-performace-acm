//1
import http from 'k6/http';
import { check, sleep } from 'k6';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

//2
export const options = {
    insecureSkipTLSVerify: true,
    stages: [
        { duration: '2m', target: 100 },
        { duration: '5m', target: 100 },
        { duration: '2m', target: 200 },
        { duration: '5m', target: 200 },
        { duration: '2m', target: 300 },
        { duration: '5m', target: 300 },
        { duration: '5m', target: 400 },
        { duration: '5m', target: 400 },
        { duration: '10m', target: 0 },
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

    sleep(1);
}

//4
//desmontagem
export function handleSummary(data) {
    return {
        "GETVeiculosStress.html": htmlReport(data),
    };
}