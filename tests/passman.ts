import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Passman } from "../target/types/passman";

describe("passman", () => {
    const provider = anchor.AnchorProvider.env();
    anchor.setProvider(provider);
    const program = anchor.workspace.Passman as Program<Passman>;

    // Sample auth hash (should be SHA256(SHA256(pass) + SHA256(pubkey)))
    const authHash = Buffer.from(
        "1ce8e106cad65f19eca31c0bc085d5cb2b77b23425d6ee298b400916d18ee39c",
        "hex"
    );

    it("Initialize vault", async () => {
        const [vaultPDA] = anchor.web3.PublicKey.findProgramAddressSync(
            [Buffer.from("vault"), authHash],
            program.programId
        );

        await program.methods
            .initializeVault([...authHash])
            .accounts({
                vault: vaultPDA,
                user: provider.wallet.publicKey,
                systemProgram: anchor.web3.SystemProgram.programId,
            })
            .signers([])
            .rpc();

        console.log("✅ Vault initialized:", vaultPDA.toBase58());
    });

    it("Add an entry", async () => {
        const [vaultPDA] = anchor.web3.PublicKey.findProgramAddressSync(
            [Buffer.from("vault"), authHash],
            program.programId
        );

        await program.methods
            .addEntry([...authHash], "insta", "abc", "xyz")
            .accounts({
                vault: vaultPDA,
            })
            .rpc();

        console.log("✅ Entry added to vault");

        // 🔍 Inspect the vault
        const vault = await program.account.vault.fetch(vaultPDA);
        console.log("📦 Vault Data:", vault);

        vault.entries.forEach((entry: any, index: number) => {
            console.log(`🔐 Entry #${index + 1}`);
            console.log("   Website: ", entry.website);
            console.log("   Username:", entry.username);
            console.log("   Password:", entry.password);
        });
    });

});
