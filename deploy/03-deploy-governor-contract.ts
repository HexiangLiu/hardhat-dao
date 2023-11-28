import { DeployFunction } from 'hardhat-deploy/dist/types';
import { ethers, network } from 'hardhat';
import verify from '../utils/verify';
import {
  developmentChains,
  VOTING_DELAY,
  VOTING_PERIOD,
  QUORUM_PERCENTAGE,
} from '../const';

const deploy: DeployFunction = async ({
  deployments: { deploy, log },
  getNamedAccounts,
}) => {
  network;
  const { deployer } = await getNamedAccounts();
  const GovernanceToken = await ethers.getContract('GovernanceToken');
  const governanceTokenAddress = await GovernanceToken.getAddress();
  const TimeLock = await ethers.getContract('TimeLock');
  const timeLockAddress = await TimeLock.getAddress();
  log('-------------------');
  const args = [
    governanceTokenAddress,
    timeLockAddress,
    VOTING_DELAY,
    VOTING_PERIOD,
    QUORUM_PERCENTAGE,
  ];
  const GovernorContract = await deploy('GovernorContract', {
    from: deployer,
    log: true,
    args,
  });
  if (!developmentChains.includes(network.name)) {
    log('Verifying...');
    await verify(GovernorContract.address, args);
  }
  log('-------------------');
};

export default deploy;
