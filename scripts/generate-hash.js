const { webcrypto } = require('crypto');

// Simple SHA-256 Helper (Deterministic) - Matching auth.ts logic
async function getHash(password, salt) {
    const enc = new TextEncoder();
    const data = enc.encode(password + salt);
    const hashBuffer = await webcrypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
    return hashHex;
}

async function main() {
    const salt = 'a1b2c3d4-e5f6-4789-8012-345678901234'; // New salt
    const password = '1234';
    const hash = await getHash(password, salt);
    console.log(`${salt}:${hash}`);
}

main();
