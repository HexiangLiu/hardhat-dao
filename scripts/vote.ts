import * as fs from 'fs';
import { ethers, network } from 'hardhat';
import { GovernorContract } from '../typechain-types';
import { VOTING_PERIOD, developmentChains } from '../const';
import moveBlocks from '../utils/move-blocks';

const vote = async () => {
  const proposalId = JSON.parse(
    await fs.readFileSync('proposals.json', 'utf-8')
  )[network.config.chainId!][0];
  // castVoteWithReason
  // 0 = Against, 1 = For, 3 = Abstain
  const GovernorContract: GovernorContract = await ethers.getContract(
    'GovernorContract'
  );
  const tx = await GovernorContract.castVoteWithReason(
    proposalId,
    1,
    'Yes I want'
  );
  await tx.wait();
  if (developmentChains.includes(network.name)) {
    await moveBlocks(VOTING_PERIOD + 1);
  }
  console.log('Voted! Ready to go!');
  //   enum ProposalState {
  //     Pending,
  //     Active,
  //     Canceled,
  //     Defeated,
  //     Succeeded,
  //     Queued,
  //     Expired,
  //     Executed
  // }
  console.log(`Current state is ${await GovernorContract.state(proposalId)}`);
};

vote()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
