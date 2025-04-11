import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useWallet } from "@solana/wallet-adapter-react";

const categories = [
    {
        title: "Socials",
        items: ["Instagram", "Facebook", "Whatsapp", "Twitch", "X"],
    },
    {
        title: "Finance",
        items: ["Bank of America", "Paypal"],
    },
    {
        title: "Entertainment",
        items: ["Netflix", "Hulu", "iTunes", "Twitch"],
    },
    {
        title: "Work",
        items: ["Figma", "Gmail"],
    },
    {
        title: "Documents",
        items: ["Driver’s License", "Passport", "Japan Visa"],
    },
];

export default function Vault() {
    const { connected, publicKey } = useWallet();
    const navigate = useNavigate();

    useEffect(() => {
        if (!connected || !publicKey) {
            navigate("/");
        }
    }, [connected, publicKey, navigate]);

    return (
        <div className="min-h-screen bg-white px-12 pt-12 pb-20 relative font-sans">
            {/* Top control buttons */}
            <div className="absolute top-6 right-6 flex items-center gap-4 text-2xl">
                <IconButton title="Lock" icon="🔒" />
                <IconButton title="Menu" icon="≡" />
            </div>

            {/* Page title */}
            <h1 className="text-xl font-semibold mb-12">Vault</h1>

            {/* Category grid */}
            <div className="flex flex-wrap gap-12 justify-start">
                {categories.map((cat, idx) => (
                    <div key={idx}>
                        <div className="text-sm font-medium font-mono mb-3">
                            {cat.title}{" "}
                            <span className="text-gray-400 font-normal">({cat.items.length})</span>
                        </div>
                        <div className="flex flex-col gap-3">
                            {cat.items.map((item, i) => (
                                <VaultItem key={i} label={item} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Floating "+" button */}
            <button
                className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-purple-600 text-white text-4xl w-14 h-14 rounded-full shadow-lg hover:bg-purple-700"
                title="Add new"
            >
                +
            </button>

            {/* Home button */}
            <button
                onClick={() => navigate("/")}
                className="fixed bottom-8 right-8 bg-black text-white px-6 py-2 rounded-full text-base font-semibold shadow-md"
            >
                Home
            </button>
        </div>
    );
}

function VaultItem({ label }: { label: string }) {
    return (
        <div className="flex items-center justify-between bg-gray-100 text-sm rounded-full px-4 py-2 w-52 shadow-sm">
            <span className="truncate">{label}</span>
            <button title="Copy" className="text-gray-500 hover:text-black">📋</button>
        </div>
    );
}

function IconButton({ title, icon }: { title: string; icon: string }) {
    return (
        <button title={title} className="hover:scale-105 transition">
            {icon}
        </button>
    );
}
