import { ethers, network } from 'hardhat';
import { GovernorContract, Box } from '../typechain-types';
import { MIN_DELAY, developmentChains } from '../const';
import moveTime from '../utils/move-time';
import moveBlocks from '../utils/move-blocks';

const queueAndExecute = async () => {
  const GovernorContract: GovernorContract = await ethers.getContract(
    'GovernorContract'
  );
  const Box: Box = await ethers.getContract('Box');
  const boxAddress = await Box.getAddress();
  const encodedData = Box.interface.encodeFunctionData('store', [77]);
  const descriptionHash = ethers.keccak256(
    ethers.toUtf8Bytes('Proposal #1: Store 77 in the Box')
  );
  const tx = await GovernorContract.queue(
    [boxAddress],
    [0],
    [encodedData],
    descriptionHash
  );
  await tx.wait();
  if (developmentChains.includes(network.name)) {
    await moveTime(MIN_DELAY + 1);
    await moveBlocks(1);
  }
  console.log('Executing...');
  const executeTx = await GovernorContract.execute(
    [boxAddress],
    [0],
    [encodedData],
    descriptionHash
  );
  await executeTx.wait();

  const boxNewValue = await Box.retrieve();
  console.log(`New box value is ${boxNewValue.toString()}`);
};

queueAndExecute()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
