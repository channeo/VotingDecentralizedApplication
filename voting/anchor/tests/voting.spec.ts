import * as anchor from '@coral-xyz/anchor'
import { Program } from '@coral-xyz/anchor'
import { Keypair, PublicKey} from '@solana/web3.js'
import { Votingdapp } from '../target/types/votingdapp'
import { BankrunProvider, startAnchor } from "anchor-bankrun";
import { BN } from 'bn.js';
const IDL = require('../target/idl/voting.json');
const votingAddress = new PublicKey("coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF");
describe('votingdapp', () => {

  let context;
  let provider;
  let VotingProgram;

  it('Initialize Votingdapp', async () => {
  context = await startAnchor("", [{name:"voting",programId: votingAddress}], []);

  provider = new BankrunProvider(context);
  VotingProgram = new Program<Votingdapp>(
      IDL,
      provider,
    );
    await VotingProgram.methods.initializePoll(
      new anchor.BN(1),
      "what is your favorite type of peanup butter?",
      new anchor.BN(2),
      new anchor.BN(1841086091)
    ).rpc();
    const [pollAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer,'le',8)],
      votingAddress,
    )
    const poll = await VotingProgram.account.poll.fetch(pollAddress);
    console.log(poll);
    expect(poll.pollId.toNumber()).toEqual(1);
    expect(poll.description).toEqual("what is your favorite types of peanuts butter");
    expect(poll.pollStart.toNumber()).toBeLessThan(poll.pollEnd.toNumber());

    it("initialize candicate",async()=>{
      context = await startAnchor("", [{name:"voting",programId: votingAddress}], []);

      provider = new BankrunProvider(context);
      VotingProgram = new Program<Votingdapp>(
      IDL,
      provider,
    );
    await VotingProgram.methods.initializeCandicate(
      "Smooth",
      new anchor.BN(1),
    ).rpc();
    await VotingProgram.methods.initializeCandicate(
      "Crunchy",
      new anchor.BN(1),
    ).rpc();
    const [crunchyAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer,'le',8),Buffer.from("Crunchy")],
      votingAddress,
    );
    const crunchyCandicate = await VotingProgram.account.candicate.fetch(crunchyAddress);
    console.log(crunchyCandicate);
    expect(crunchyCandicate.candicateVotes.toNumber()).toEqual(0)
    const [smoothAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer,'le',8),Buffer.from("Crunchy")],
      votingAddress,
    );
    const smoothCandicate = await VotingProgram.account.candicate.fetch(smoothAddress);
    console.log(smoothCandicate);
    });


    it("vote",async()=>{
      context = await startAnchor("", [{name:"voting",programId: votingAddress}], []);

      provider = new BankrunProvider(context);
      VotingProgram = new Program<Votingdapp>(
      IDL,
      provider,
    );
    await VotingProgram.methods
    .votes("Smooth",
      new anchor.BN(1)
    ).rpc();
    const [smoothAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer,'le',8),Buffer.from("Smooth")],
      votingAddress,
    );
    const smoothCandicate = await VotingProgram.account.candicate.fetch(smoothAddress);
    console.log(smoothCandicate);
    expect(smoothCandicate.candicateVotes.toNumber()).toEqual(0);
    });
    
  })
})
