function datahog(data_in, title = "EMPTY TITLE", type = "info", domain = "", subdomain = "") {
    const localUrl = 'http://localhost:5055/reporting/log/';

    const data = {
        title: title,
        data: btoa(JSON.stringify(data_in)), // Using btoa to encode data as base64
        type: type,
        domain: domain,
        subdomain: subdomain
    };

    fetch(localUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        // Handle response here
        console.log('Response:', response);
    })
    .catch(error => {
        // Handle error here
        console.error('Error:', error);
    });
}


// --- Helpers ---
const types = ["debug", "info", "warn", "error"];
const domains = ["auth", "payment", "api", "frontend", "database"];
const subdomains = ["login", "checkout", "orders", "users", "reports"];

function randomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// Generate random payload (small → large)
function randomPayload() {
    const choice = Math.floor(Math.random() * 4);

    if (choice === 0) return { msg: "Simple test log", time: new Date().toISOString() };

    if (choice === 1) return {
        user: { id: Math.floor(Math.random()*1000), name: "User" + Math.floor(Math.random()*100) },
        action: randomItem(["login", "logout", "purchase", "update"]),
        time: new Date().toISOString()
    };

    if (choice === 2) {
        let arr = [];
        for (let i=0; i<20; i++) {
            arr.push({ id: i, value: Math.random().toString(36).substring(2,10) });
        }
        return { batch: arr, createdAt: Date.now() };
    }

    // Large nested object
    let big = {};
    for (let i=0; i<10; i++) {
        big["key_" + i] = Array.from({length: 50}, () => Math.random().toString(36).substring(2,7));
    }
    return { bigPayload: big, createdAt: new Date().toISOString() };
}

// --- Generate & send multiple logs ---
function pushRandomLogs(count = 10) {
    for (let i=0; i<count; i++) {
        const payload = randomPayload();
        const title = "Test log #" + (i+1);
        const type = randomItem(types);
        const domain = randomItem(domains);
        const subdomain = randomItem(subdomains);

        datahog(payload, title, type, domain, subdomain);
    }
}

// Example: push 20 random logs
pushRandomLogs(20);
