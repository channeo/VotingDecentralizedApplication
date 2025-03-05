import * as anchor from '@coral-xyz/anchor'
import { Program } from '@coral-xyz/anchor'
import { Keypair, PublicKey} from '@solana/web3.js'
import { Votingdapp } from '../target/types/votingdapp'
import { BankrunProvider, startAnchor } from "anchor-bankrun";
import { BN } from 'bn.js';
const IDL = require('../target/idl/voting.json');
const votingAddress = new PublicKey("coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF");
describe('votingdapp', () => {

  it('Initialize Votingdapp', async () => {
    const context = await startAnchor("", [{name:"voting",programId: votingAddress}], []);

	  const provider = new BankrunProvider(context);
    const VotingProgram = new Program<Votingdapp>(
      IDL,
      provider,
    );
    await VotingProgram.methods.initializePoll(
      new anchor.BN(1),
      "what is your favorite type of peanup butter?",
      new anchor.BN(2),
      new anchor.BN(1841086091)
    ).rpc();
  })
})
