import { network } from 'hardhat';

export default async (time: number) => {
  console.log(`Moving time...`);
  await network.provider.request({
    method: 'evm_increaseTime',
    params: [time],
  });
  console.log(`Moved forward ${time} seconds`);
};
