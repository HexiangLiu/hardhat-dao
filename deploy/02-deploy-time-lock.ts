import { DeployFunction } from 'hardhat-deploy/dist/types';
import { network } from 'hardhat';
import verify from '../utils/verify';
import { developmentChains, MIN_DELAY } from '../const';

const deploy: DeployFunction = async ({
  deployments: { deploy, log },
  getNamedAccounts,
}) => {
  network;
  const { deployer } = await getNamedAccounts();
  log('-------------------');
  const args = [MIN_DELAY, [], []];
  const TimeLock = await deploy('TimeLock', {
    from: deployer,
    log: true,
    args,
  });
  if (!developmentChains.includes(network.name)) {
    log('Verifying...');
    await verify(TimeLock.address, args);
  }
  log('-------------------');
};

export default deploy;
