import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class CustomerService {
    getData() {
        return [
            {
                id: 1000,
                name: 'James Butt',
                country: {
                    name: 'Algeria',
                    code: 'dz'
                },
                company: 'Benton, John B Jr',
                date: '2015-09-13',
                status: 'unqualified',
                verified: true,
                activity: 17,
                representative: {
                    name: 'Ioni Bowcher',
                    image: 'ionibowcher.png'
                },
                balance: 70663
            },
            {
                id: 1001,
                name: 'Josephine Darakjy',
                country: {
                    name: 'Egypt',
                    code: 'eg'
                },
                company: 'Chanay, Jeffrey A Esq',
                date: '2019-02-09',
                status: 'proposal',
                verified: true,
                activity: 0,
                representative: {
                    name: 'Amy Elsner',
                    image: 'amyelsner.png'
                },
                balance: 82429
            },
            {
                id: 1002,
                name: 'Art Venere',
                country: {
                    name: 'Panama',
                    code: 'pa'
                },
                company: 'Chemel, James L Cpa',
                date: '2017-05-13',
                status: 'qualified',
                verified: false,
                activity: 63,
                representative: {
                    name: 'Asiya Javayant',
                    image: 'asiyajavayant.png'
                },
                balance: 28334
            },
            {
                id: 1003,
                name: 'Lenna Paprocki',
                country: {
                    name: 'Slovenia',
                    code: 'si'
                },
                company: 'Feltz Printing Service',
                date: '2020-09-15',
                status: 'new',
                verified: false,
                activity: 37,
                representative: {
                    name: 'Xuxue Feng',
                    image: 'xuxuefeng.png'
                },
                balance: 88521
            },
            {
                id: 1004,
                name: 'Donette Foller',
                country: {
                    name: 'South Africa',
                    code: 'za'
                },
                company: 'Printing Dimensions',
                date: '2016-05-20',
                status: 'proposal',
                verified: true,
                activity: 33,
                representative: {
                    name: 'Asiya Javayant',
                    image: 'asiyajavayant.png'
                },
                balance: 93905
            },
            {
                id: 1005,
                name: 'Simona Morasca',
                country: {
                    name: 'Egypt',
                    code: 'eg'
                },
                company: 'Chapman, Ross E Esq',
                date: '2018-02-16',
                status: 'qualified',
                verified: false,
                activity: 68,
                representative: {
                    name: 'Ivan Magalhaes',
                    image: 'ivanmagalhaes.png'
                },
                balance: 50041
            },
            {
                id: 1006,
                name: 'Mitsue Tollner',
                country: {
                    name: 'Paraguay',
                    code: 'py'
                },
                company: 'Morlong Associates',
                date: '2018-02-19',
                status: 'renewal',
                verified: true,
                activity: 54,
                representative: {
                    name: 'Ivan Magalhaes',
                    image: 'ivanmagalhaes.png'
                },
                balance: 58706
            },
            {
                id: 1007,
                name: 'Leota Dilliard',
                country: {
                    name: 'Serbia',
                    code: 'rs'
                },
                company: 'Commercial Press',
                date: '2019-08-13',
                status: 'renewal',
                verified: true,
                activity: 69,
                representative: {
                    name: 'Onyama Limba',
                    image: 'onyamalimba.png'
                },
                balance: 26640
            },
            {
                id: 1451,
                name: 'Lonna Diestel',
                country: {
                    name: 'Philippines',
                    code: 'ph'
                },
                company: 'Dimmock, Thomas J Esq',
                date: '2017-02-10',
                status: 'proposal',
                verified: true,
                activity: 9,
                representative: {
                    name: 'Xuxue Feng',
                    image: 'xuxuefeng.png'
                },
                balance: 56415
            },
            {
                id: 1452,
                name: 'Cristal Samara',
                country: {
                    name: 'Australia',
                    code: 'au'
                },
                company: 'Intermed Inc',
                date: '2016-08-17',
                status: 'qualified',
                verified: true,
                activity: 99,
                representative: {
                    name: 'Ioni Bowcher',
                    image: 'ionibowcher.png'
                },
                balance: 33427
            },
            {
                id: 1453,
                name: 'Kenneth Grenet',
                country: {
                    name: 'Croatia',
                    code: 'hr'
                },
                company: 'Bank Of New York',
                date: '2020-07-24',
                status: 'negotiation',
                verified: true,
                activity: 78,
                representative: {
                    name: 'Anna Fali',
                    image: 'annafali.png'
                },
                balance: 44004
            },
            {
                id: 1454,
                name: 'Elli Mclaird',
                country: {
                    name: 'Switzerland',
                    code: 'ch'
                },
                company: 'Sportmaster Intrnatl',
                date: '2017-06-10',
                status: 'qualified',
                verified: true,
                activity: 61,
                representative: {
                    name: 'Elwin Sharvill',
                    image: 'elwinsharvill.png'
                },
                balance: 37227
            },
            {
                id: 1455,
                name: 'Alline Jeanty',
                country: {
                    name: 'Denmark',
                    code: 'dk'
                },
                company: 'W W John Holden Inc',
                date: '2015-12-08',
                status: 'renewal',
                verified: true,
                activity: 74,
                representative: {
                    name: 'Asiya Javayant',
                    image: 'asiyajavayant.png'
                },
                balance: 44560
            },
            {
                id: 1456,
                name: 'Sharika Eanes',
                country: {
                    name: 'Chile',
                    code: 'cl'
                },
                company: 'Maccani & Delp',
                date: '2018-08-16',
                status: 'qualified',
                verified: true,
                activity: 14,
                representative: {
                    name: 'Amy Elsner',
                    image: 'amyelsner.png'
                },
                balance: 50922
            },
            {
                id: 1457,
                name: 'Nu Mcnease',
                country: {
                    name: 'Pakistan',
                    code: 'pk'
                },
                company: 'Amazonia Film Project',
                date: '2018-07-03',
                status: 'negotiation',
                verified: true,
                activity: 47,
                representative: {
                    name: 'Onyama Limba',
                    image: 'onyamalimba.png'
                },
                balance: 61262
            },
            {
                id: 1458,
                name: 'Daniela Comnick',
                country: {
                    name: 'Tunisia',
                    code: 'tn'
                },
                company: 'Water & Sewer Department',
                date: '2017-07-07',
                status: 'negotiation',
                verified: true,
                activity: 31,
                representative: {
                    name: 'Anna Fali',
                    image: 'annafali.png'
                },
                balance: 13459
            }
        ];
    }

    constructor(private http: HttpClient) {}
    
    getCustomersMini() {
        return Promise.resolve(this.getData().slice(0, 5));
    }

    getCustomersSmall() {
        return Promise.resolve(this.getData().slice(0, 10));
    }

    getCustomersMedium() {
        return Promise.resolve(this.getData().slice(0, 50));
    }

    getCustomersLarge() {
        return Promise.resolve(this.getData().slice(0, 200));
    }

    getCustomersXLarge() {
        return Promise.resolve(this.getData());
    }

    getCustomers(params?: any) {
        return this.http.get<any>('https://www.primefaces.org/data/customers', { params: params }).toPromise();
    }
};