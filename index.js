import getCustomer from './scenarios/tipos de teste examples/get-customer.js.js';
import getVehicles from './scenarios/tipos de teste examples/get-vehicles.js.js';
import { group, sleep } from 'k6';

export default () => {
    group('Login', () => {
        getVehicles();
    });

    sleep(1);
};