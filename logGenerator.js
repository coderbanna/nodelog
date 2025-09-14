import { faker } from '@faker-js/faker';

const LOG_ENDPOINT = 'http://localhost:8000/reporting/log/'; // Your Python endpoint

const logTypes = ['info', 'warn', 'error', 'success'];

function base64Encode(obj) {
    const str = typeof obj === 'string' ? obj : JSON.stringify(obj, null, 2);
    return btoa(str);
}

function getRandomLog() {
    const type = faker.helpers.arrayElement(logTypes);

    const dataPayload = {
        user: faker.internet.userName(),
        ip: faker.internet.ip(),
        action: faker.hacker.verb(),
        detail: faker.hacker.phrase(),
        system: faker.commerce.department(),
        path: faker.system.filePath(),
        uuid: faker.string.uuid(),
        date: new Date().toISOString(),
    };

    const title = `${type.toUpperCase()} | ${dataPayload.system} - ${dataPayload.action}`;

    return {
        title,
        data: base64Encode(dataPayload),
        type,
        domain: faker.internet.domainName(),
        subdomain: faker.internet.domainWord()
    };
}

function sendLog(log) {
    fetch(LOG_ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(log)
    })
    .then(res => {
        if (!res.ok) throw new Error(`Failed to send log: ${res.status}`);
        return res.json();
    })
    .then(data => {
        console.log(`✅ Sent log: ${log.title}`);
    })
    .catch(err => {
        console.error('❌ Error sending log:', err);
    });
}

export function sendRandomLogs(count = 10) {
    for (let i = 0; i < count; i++) {
        const delay = Math.random() * 1000;
        setTimeout(() => {
            const log = getRandomLog();
            sendLog(log);
        }, delay);
    }
}