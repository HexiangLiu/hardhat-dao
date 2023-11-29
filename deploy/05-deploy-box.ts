import { DeployFunction } from 'hardhat-deploy/dist/types';
import { ethers, network } from 'hardhat';
import verify from '../utils/verify';
import { developmentChains } from '../const';
import { Box, TimeLock } from '../typechain-types';

const deploy: DeployFunction = async ({
  deployments: { deploy, log },
  getNamedAccounts,
}) => {
  const { deployer } = await getNamedAccounts();
  log('-------------------');
  const Box = await deploy('Box', {
    from: deployer,
    log: true,
  });
  const TimeLock: TimeLock = await ethers.getContract('TimeLock');
  const timeLockAddress = await TimeLock.getAddress();
  const BoxContract: Box = await ethers.getContract('Box');
  const tx = await BoxContract.transferOwnership(timeLockAddress);
  await tx.wait();

  if (!developmentChains.includes(network.name)) {
    log('Verifying...');
    await verify(Box.address);
  }
  log('-------------------');
};

export default deploy;
