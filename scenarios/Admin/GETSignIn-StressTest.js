//inicialização
import http from 'k6/http';
import {check} from 'k6';


//configuração
export const options = {
    stages: [
        {duration: '2m', target: 100},
        {duration: '5m', target: 100},
        {duration: '2m', target: 200},
        {duration: '5m', target: 200},
        {duration: '2m', target: 300},
        {duration: '5m', target: 300},
        {duration: '5m', target: 400},
        {duration: '5m', target: 400},
        {duration: '10m', target: 0}
    ]
}

//execução
export default function(){
    const res = http.get('https://ac-stage.com/managers/sign_in');

    check(res, {
        'status code é 200': (r) => r.status === 200
    });
}