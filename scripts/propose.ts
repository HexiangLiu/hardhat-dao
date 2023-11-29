import { ethers, network } from 'hardhat';
import * as fs from 'fs';
import { Box, GovernorContract } from '../typechain-types';
import { VOTING_DELAY, developmentChains } from '../const';
import moveBlocks from '../utils/move-blocks';

const propose = async () => {
  const GovernorContract: GovernorContract = await ethers.getContract(
    'GovernorContract'
  );
  const Box: Box = await ethers.getContract('Box');
  const boxAddress = await Box.getAddress();
  const encodedData = Box.interface.encodeFunctionData('store', [77]);
  const tx = await GovernorContract.propose(
    [boxAddress],
    [0],
    [encodedData],
    'Proposal #1: Store 77 in the Box'
  );
  const receipt = await tx.wait(1);
  //@ts-ignore
  const proposalId = receipt.logs[0].args[0];
  console.log(proposalId);

  if (developmentChains.includes(network.name)) {
    await moveBlocks(VOTING_DELAY + 1);
  }
  let proposals = JSON.parse(await fs.readFileSync('proposals.json', 'utf-8'));
  if (!proposals[network.config.chainId!]) {
    proposals[network.config.chainId!] = [];
  }
  proposals[network.config.chainId!].push(proposalId.toString());
  fs.writeFileSync('proposals.json', JSON.stringify(proposals));
};

propose()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
