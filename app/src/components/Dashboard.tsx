import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useNavigate } from "react-router-dom";
import { computeAuthHash } from "../utils/crypto";

export default function Dashboard() {
    const { connected, publicKey } = useWallet();
    const [password, setPassword] = useState("");
    const [pub_address, setPubAddress] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!connected) {
            navigate("/");
        } else if (publicKey) {
            const pubkeyString = publicKey.toBase58();
            setPubAddress(pubkeyString);
        }
    }, [connected, publicKey, navigate]);

    const handleLogin = async () => {
        if (!password.trim() || !pub_address) return;
        console.log("Master Password:", password);
        console.log("Public Address:", pub_address);
        const authHash = await computeAuthHash(password, pub_address);
        console.log("Auth hash:", authHash);

    };

    return (
        <div className="h-screen flex flex-col items-center justify-center bg-white">
            <h1 className="text-5xl font-bold mb-10">Dashboard</h1>

            <div className="flex items-center gap-2 bg-gray-100 px-4 py-3 rounded-lg">
                <input
                    type="password"
                    placeholder="Enter Master Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-transparent outline-none text-lg placeholder-gray-500"
                />
                <button
                    onClick={handleLogin}
                    className="bg-black text-white px-4 py-1.5 rounded-md text-sm font-mono hover:bg-gray-800 transition"
                >
                    Login
                </button>
            </div>
        </div>
    );
}
