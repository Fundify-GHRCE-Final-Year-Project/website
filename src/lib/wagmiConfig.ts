import { http, createConfig } from 'wagmi';
import { mainnet, base, bsc } from 'wagmi/chains';
import { injected, metaMask } from 'wagmi/connectors';

export const wagmiConfig = createConfig({
  chains: [mainnet, base, bsc],
  connectors: [injected(), metaMask()],
  transports: {
    [mainnet.id]: http(process.env.NEXT_PUBLIC_ALCHEMY_ETH_API_KEY),
    [base.id]: http(process.env.NEXT_PUBLIC_ALCHEMY_BASE_API_KEY),
    [bsc.id]: http(process.env.NEXT_PUBLIC_ALCHEMY_BSC_API_KEY),
  },
});
