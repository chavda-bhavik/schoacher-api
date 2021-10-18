import { testConn } from './testConn';

export default async () => {
    await testConn(true)
    console.log('\nhello, this is just before tests start running');
};

