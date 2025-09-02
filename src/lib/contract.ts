import abi from "@/lib/abi.json";

export const contract = {
  address: "0x700b6A60ce7EaaEA56F065753d8dcB9653dbAD35" as `0x${string}`,
};

export const wagmiContractConfig = {
  address: contract.address as string,
  abi: abi.abi,
} as const;
