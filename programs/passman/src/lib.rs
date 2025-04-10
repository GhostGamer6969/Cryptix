use anchor_lang::prelude::*;

declare_id!("7wjYR42krbWqEGoCSpzQE7FGX47nTis9RtF3nPGZZqnR");
#[program]
pub mod passman {
    use super::*;

    pub fn initialize_vault(ctx: Context<InitializeVault>, auth_hash: [u8; 32]) -> Result<()> {
        let vault = &mut ctx.accounts.vault;
        vault.auth_hash = auth_hash;
        vault.entries = Vec::new();
        Ok(())
    }

    pub fn add_entry(
        ctx: Context<AddEntry>,
        auth_hash: [u8; 32],
        website: String,
        username: String,
        password: String,
    ) -> Result<()> {
        let vault = &mut ctx.accounts.vault;

        require!(
            vault.entries.len() < Vault::MAX_ENTRIES,
            PassmanError::VaultFull
        );

        let entry = Entry {
            website,
            username,
            password,
        };

        vault.entries.push(entry);
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(auth_hash: [u8; 32])]
pub struct InitializeVault<'info> {
    #[account(
        init,
        payer = user,
        space = 8 + Vault::MAX_SIZE,
        seeds = [b"vault", auth_hash.as_ref()],
        bump
    )]
    pub vault: Account<'info, Vault>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(auth_hash: [u8; 32])]
pub struct AddEntry<'info> {
    #[account(
        mut,
        seeds = [b"vault", auth_hash.as_ref()],
        bump
    )]
    pub vault: Account<'info, Vault>,
}

#[account]
pub struct Vault {
    pub auth_hash: [u8; 32],
    pub entries: Vec<Entry>,
}

impl Vault {
    pub const MAX_ENTRIES: usize = 32;
    pub const MAX_SIZE: usize = 32 + 4 + (Entry::SIZE * Self::MAX_ENTRIES);
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct Entry {
    pub website: String,
    pub username: String,
    pub password: String,
}

impl Entry {
    pub const SIZE: usize = (4 + 100) * 3;
}

#[error_code]
pub enum PassmanError {
    #[msg("Vault has reached the maximum number of entries.")]
    VaultFull,
}
