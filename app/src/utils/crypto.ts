// src/utils/crypto.ts

async function hashSHA256(input: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function computeAuthHash(password: string, pubAddress: string): Promise<string> {
    const hashPass = await hashSHA256(password);
    const hashPub = await hashSHA256(pubAddress);
    const combined = hashPass + hashPub;
    const authHash = await hashSHA256(combined);
    return authHash;
}

