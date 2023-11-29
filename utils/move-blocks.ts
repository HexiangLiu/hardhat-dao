import { network } from 'hardhat';

export default async (amount: number) => {
  for (let i = 0; i < amount; i++) {
    console.log(`Moving blocks forward ${i + 1}...`);
    await network.provider.request({ method: 'evm_mine' });
  }
};
