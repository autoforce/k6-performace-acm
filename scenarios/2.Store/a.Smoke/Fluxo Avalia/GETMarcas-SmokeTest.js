//1 - inicializacao
import http from 'k6/http';
import { check, sleep } from 'k6';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

//2 - configuracao
export const options = {
    insecureSkipTLSVerify: true,
    stages: [
        { duration: '1m', target: 1 }
    ],
    thresholds: {
        checks: ['rate > 0.99'],
        http_req_failed: ['rate < 0.1'],
        http_req_duration: ['p(95) < 500']
    }

};

//3 - execucao
export default function () {

    const randomYear = Math.floor(Math.random() * 13) + 2010;

    const BASE_URL = 'http://autodealer.new.acmapp.work';
    const path = `/api/v1/vehicles/makes?year=${randomYear}`;
    const url = BASE_URL + path

    const res = http.get(url);
    const resBody = JSON.parse(res.body);
    console.log(`${url} --> ${res.status}`);

    check(res, {
        'Marcas Carregadas': (r) => r.status === 200
    });

    sleep(1);
};

//4 - desmontagem
export function handleSummary(data) {
    return {
        "GETmarcasSmokeTest.html": htmlReport(data),
    };
}