// "Over / Under" is a betting game that allows users to bet on the outcome of the next random number, between 0 and 100, inclusive of 0 and 100.
// In round 1, a random number is generated. In subsequent rounds, a new random number is generated.
// Users bet on the outcome of the next random number, and whether that number will be higher or lower than the previous round's number.
// If the number is the same as the last round, the house wins the pot.
// Losers pay winners, and the house takes a cut of the winnings.

use anchor_lang::{
    prelude::*,
    system_program::{transfer, Transfer},
};

mod contexts;
use contexts::*;
//use crate::errors::Error;
mod errors;
mod state;

use std::collections::HashMap;

use state::Bet;
use state::Round;

declare_id!("4z3ZzM7rVH8D2mBuL81TuYBtAxMrWdDziKf8Z34tLxr");

#[program]
pub mod over_under {

    use super::*;

    pub fn init_global(ctx: Context<GlobalC>) -> Result<()> {
        ctx.accounts.init(&ctx.bumps)?;
        Ok(())
    }

    pub fn init_round(ctx: Context<RoundC>, _round: u64) -> Result<()> {
        ctx.accounts.init(_round, &ctx.bumps)?;
        Ok(())
    }

    pub fn place_bet(ctx: Context<BetC>, amount: u64, bet: u8, round: u64) -> Result<()> {
        ctx.accounts.init(amount, bet, round, &ctx.bumps)?;
        ctx.accounts.deposit(amount)?;
        Ok(())
    }

    pub fn play_round(ctx: Context<PlayRoundC>, sig: Vec<u8>) -> Result<()> {
        ctx.accounts.verify_ed25519_signature(&sig)?;
        ctx.accounts.play_round(&ctx.bumps, &sig)?;
    
        let pot = ctx.accounts.vault.lamports();
        let mut winners_pot: u64 = 0;
        let mut winners = HashMap::new();
        let total_accounts: usize = ctx.remaining_accounts.len();
        msg!("Total Remaining Accounts: {}", total_accounts);
    
        for account in ctx.remaining_accounts.iter() {
            let _account_key = account.key();
            let data = account.try_borrow_mut_data();
            let account_to_write = Bet::try_deserialize(&mut data.unwrap().as_ref())
                .expect("Error Deserializing Bet Account Data");
    
            if account_to_write.bet == ctx.accounts.round.outcome {
                winners_pot += account_to_write.amount;
                winners.insert(account_to_write.player, account_to_write.amount);
            }
        }
    
        for (pubkey, bet_amount) in &winners {
            let payout = (*bet_amount / winners_pot) * pot;
            ctx.accounts.round.winners.push((*pubkey, payout));
        }
    
        Ok(())
    }
    
    pub fn pay_close(ctx: Context<PayCloseC>) -> Result<()> {
        let winners = ctx.accounts.round.winners.clone();
        let system_program_info = ctx.accounts.system_program.to_account_info();
        let cpi_program = system_program_info;
        let vault = ctx.accounts.vault.to_account_info();
        let round = ctx.accounts.round.to_account_info();
    
        for account in ctx.remaining_accounts.iter() {
            let data = account.try_borrow_mut_data()?;
            let account_to_write = Bet::try_deserialize(&mut data.as_ref())
                .expect("Error Deserializing Bet Account Data");
    
            if winners
                .iter()
                .any(|(pubkey, _)| *pubkey == account_to_write.player)
            {
                let winner = winners
                    .iter()
                    .find(|(pubkey, _)| *pubkey == account_to_write.player)
                    .unwrap();
                let cpi_accounts = Transfer {
                    from: vault.to_account_info(),
                    to: account.to_account_info(),
                };
    
                let seeds = &[b"vault", round.key.as_ref(), &[ctx.accounts.round.bump]];
                let signer_seeds = &[&seeds[..]];
                let cpi_ctx =
                    CpiContext::new_with_signer(cpi_program.clone(), cpi_accounts, signer_seeds);
    
                transfer(cpi_ctx, winner.1)?;
            }
        }
    
        for account in ctx.remaining_accounts.iter() {
            let data = account.try_borrow_mut_data()?;
            let account_to_write = Bet::try_deserialize(&mut data.as_ref())
                .expect("Error Deserializing Bet Account Data");
    
          //  account_to_write.close();
        }
    
        for account in ctx.remaining_accounts.iter() {
            let data = account.try_borrow_mut_data()?;
            let account_to_write = Round::try_deserialize(&mut data.as_ref())
                .expect("Error Deserializing Bet Account Data");
    
           // account_to_write.close();

    }
Ok(())
}
}