import http from 'k6/http';

export const options = {
    vus: 1,
    duration: '10s'
}

export default function () {
    const url = 'https://ac-stage.com/managers/sign_in';
    const payload = JSON.stringify({
        authenticity_token:'5n_a9PVQzmCxFyDqUun0fsxHNfG6rZuRk8KSC0cZfdXNeiZ6bcIEMry95Gf-BnEYgViFMroZ-mpkfCijqeKIkA',
        manageremail: '0gabrielvolponi0@gmail.com',
        managerpassword: 'dadsadas'
    });

    const params = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    http.post(url, payload, params);
}