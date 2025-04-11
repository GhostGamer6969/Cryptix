import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
    const { setVisible } = useWalletModal();
    const { connected } = useWallet();
    const navigate = useNavigate();

    const handleConnect = () => {
        setVisible(true);
    };

    useEffect(() => {
        if (connected) {
            navigate("/dashboard")
        }
    }, [connected]);

    return (
        <div className="h-screen w-screen bg-white flex flex-col items-center justify-center">
            <h1 className="text-[#1C1C1C] font-bold text-5xl mb-10">Cryptix</h1>

            <button
                onClick={handleConnect}
                className="bg-black text-white text-lg font-bold px-8 py-2 rounded-full"
            >
                Start
            </button>
        </div>
    );
}
