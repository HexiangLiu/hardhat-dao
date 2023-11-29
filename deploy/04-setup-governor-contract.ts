import { DeployFunction } from 'hardhat-deploy/dist/types';
import { ethers } from 'hardhat';
import { TimeLock } from '../typechain-types';

const setup: DeployFunction = async ({
  deployments: { log },
  getNamedAccounts,
}) => {
  const { deployer } = await getNamedAccounts();
  const GovernorContract = await ethers.getContract('GovernorContract');
  const governorContractAddress = await GovernorContract.getAddress();
  const TimeLock: TimeLock = await ethers.getContract('TimeLock', deployer);
  const PROPOSER_ROLE = await TimeLock.PROPOSER_ROLE();
  const EXECUTOR_ROLE = await TimeLock.EXECUTOR_ROLE();
  const DEFAULT_ADMIN_ROLE = await TimeLock.DEFAULT_ADMIN_ROLE();
  log('---------SETUP----------');
  const tx1 = await TimeLock.grantRole(PROPOSER_ROLE, governorContractAddress);
  await tx1.wait();
  const tx2 = await TimeLock.grantRole(EXECUTOR_ROLE, ethers.ZeroAddress);
  await tx2.wait();
  const tx3 = await TimeLock.revokeRole(DEFAULT_ADMIN_ROLE, ethers.ZeroAddress);
  await tx3.wait();
  log('---------DONE-----------');
};

export default setup;
