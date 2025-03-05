#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF");

#[account]
#[derive(InitSpace)]
pub struct Poll{
  pub poll_id:u64,
  #[max_len(280)]
  pub description:String,
  pub poll_start:u64,
  pub poll_end:u64,
  pub candicate_amount:u64,
}

#[account]
#[derive(InitSpace)]
pub struct Candicate{
  #[max_len(32)]
  candicate_name:String,
  candicate_votes:u64,
}

#[program]
pub mod votingdapp {
    use super::*;
    pub fn Initialize_poll(ctx:Context<InitializePoll>, 
                            poll_id:u64,
                            description:String,
                            poll_start:u64,
                            poll_end:u64) -> Result<()>{
      let poll = &mut ctx.accounts.poll;
      poll.poll_id = poll_id;
      poll.poll_end = poll_end;
      poll.poll_start = poll_start;
      poll.description = description;
      poll.candicate_amount = 0;
      Ok(())
    }
    pub fn Initialize_candicate(ctx:Context<InitializeCandicate>,_candicate_name:String,_poll_id:u64)->Result<()>{
      let candicate = &mut ctx.accounts.candicate;
      let poll = &mut ctx.accounts.poll;
      poll.candicate_amount +=1;
      candicate.candicate_name = _candicate_name;
      candicate.candicate_votes = 0;
      Ok(())
    }
    pub fn votes(ctx:Context<Vote>,candicate_name:String,_poll_id:u64)->Result<()>{
      let candicate = &mut ctx.accounts.candicate;
      candicate.candicate_votes +=1;
      msg!("Vote for candicate:{}",candicate.candicate_name);
      msg!("Vote:{}",candicate.candicate_votes);
      Ok(())
    }
}
#[derive(Accounts)]
#[instruction(candicate_name:String,poll_id:u64)]
pub struct Vote<'info>{
  pub signer:Signer<'info>,
  #[account(
    mut,
    seeds = [poll_id.to_le_bytes().as_ref()],
    bump
  )]
  pub poll:Account<'info,Poll>,
  #[account(
    seeds = [poll_id.to_le_bytes().as_ref(),candicate_name.as_bytes()],
    bump
  )]
  pub candicate: Account<'info,Candicate>,
  pub system_program: Program<'info,System>
}

#[derive(Accounts)]
#[instruction(candicate_name:String,poll_id:u64)]
pub struct InitializeCandicate<'info>{
  #[account(mut)]
  pub signer:Signer<'info>,
  #[account(
    seeds = [poll_id.to_le_bytes().as_ref()],
    bump
  )]
  pub poll:Account<'info,Poll>,
  #[account(
    init,
    payer=signer,
    space = 8 + Candicate::INIT_SPACE,
    seeds = [poll_id.to_le_bytes().as_ref(),candicate_name.as_bytes()],
    bump
  )]
  pub candicate: Account<'info,Candicate>,
  pub system_program: Program<'info,System>
}


#[derive(Accounts)]
#[instruction(poll_id:u64)]
pub struct InitializePoll<'info>{
  #[account(mut)]
  pub signer:Signer<'info>,
  #[account(
    init,
    payer=signer,
    space = 8 + Poll::INIT_SPACE,
    seeds = [poll_id.to_le_bytes().as_ref()],
    bump,
  )]
  pub poll: Account<'info,Poll>,
  pub system_program: Program<'info,System>
}
