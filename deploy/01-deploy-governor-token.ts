import { DeployFunction } from 'hardhat-deploy/dist/types';
import { ethers, network } from 'hardhat';
import verify from '../utils/verify';
import { developmentChains } from '../const';

const deploy: DeployFunction = async ({
  deployments: { deploy, log },
  getNamedAccounts,
}) => {
  network;
  const { deployer } = await getNamedAccounts();
  log('-------------------');
  const GovernanceToken = await deploy('GovernanceToken', {
    from: deployer,
    log: true,
  });
  if (!developmentChains.includes(network.name)) {
    log('Verifying...');
    await verify(GovernanceToken.address);
  }
  log('-------------------');
  await delegate(GovernanceToken.address, deployer);
  log('Delegated');
};

const delegate = async (
  governanceTokenAddress: string,
  delegatedAccount: string
) => {
  const governanceToken = await ethers.getContractAt(
    'GovernanceToken',
    governanceTokenAddress
  );
  const tx = await governanceToken.delegate(delegatedAccount);
  await tx.wait();
  console.log(
    `Checkpoints ${await governanceToken.numCheckpoints(delegatedAccount)}`
  );
};

export default deploy;
