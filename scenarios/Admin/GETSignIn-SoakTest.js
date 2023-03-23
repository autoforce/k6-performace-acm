//inicialização
import http from 'k6/http';
import {check} from 'k6';


//configuração
export const options = {
    stages: [
        {duration: '2m', target: 400},
        {duration: '3h30m', target: 400},
        {duration: '2m', target: 0}
    ]
}

//execução
export default function(){
    const res = http.get('https://ac-stage.com/managers/sign_in');

    check(res, {
        'status code é 200': (r) => r.status === 200
    });
}