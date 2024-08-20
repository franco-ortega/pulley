const METHODS_WITHOUT_BODY = ['GET', 'DELETE'];

const request = async (method, path, data) => {
const headers = METHODS_WITHOUT_BODY.includes(method)
? {}
: { 'Content-Type': 'application/json' };

    const response = await fetch(path, {
    	method,
    	headers,
    	body: JSON.stringify(data),
    }).then((res) => res.json());

    return response;

};

const BASE_URL = 'https://ciphersprint.pulley.com';
const EMAIL = 'francoortegadev@gmail.com';
const STARTING_URL = `${BASE_URL}/${EMAIL}`;

const blah = request('GET', STARTING_URL);

console.log(blah);

// const code = 'task_OTU4ZjUxZTdmNzJjMDNjMWU3OTE5YmE3MTI0ZWQ1Ng==';

// const parsed = code.slice(5);

// console.log(parsed);

// const decodedMessage = atob(parsed);

// console.log(`task_${decodedMessage}`);
