interface VaaResponse {
  vaa: string;
  amount: string;
}

const POLLING_INTERVAL = 3 * 60 * 1000; // 3 minutes
const TIMEOUT = 30 * 60 * 1000; // 30 minutes

/**
* Polls Wormhole API to fetch VAA data with retry mechanism
* @throws {Error} When timeout is reached or API fails
*/
export const fetchVaaWithRetry = async (
  chainId: number,
  emitter: string,
  sequence: number
): Promise<VaaResponse> => {
  const startTime = Date.now();

  while (true) {
      if (isTimeoutExceeded(startTime)) {
          throw new Error('Timeout reached while waiting for VAA');
      }

      try {
          const vaaData = await attemptFetchVaa(chainId, emitter, sequence);
          if (vaaData) return vaaData;

          await sleep();
      } catch (error) {
          console.error('Error fetching VAA:', error);
          await sleep();
      }
  }
};

// Helper functions
const isTimeoutExceeded = (startTime: number): boolean => {
  return Date.now() - startTime >= TIMEOUT;
};

const buildVaaUrl = (
  chainId: number,
  emitter: string,
  sequence: number
): string => {
  return `https://api.wormholescan.io/api/v1/vaas/${chainId}/${emitter}/${sequence}?parsedPayload=true`;
};

const attemptFetchVaa = async (
  chainId: number,
  emitter: string,
  sequence: number
): Promise<VaaResponse | null> => {
  const url = buildVaaUrl(chainId, emitter, sequence);

  const response = await fetch(url);

  if (!response.ok) {
      return null;
  }

  const data = (await response.json()) as any;

  if (data?.data?.vaa) {
      return {
          vaa: data.data.vaa,
          amount: data.data.payload.amount,
      };
  }

  return null;
};

const sleep = async (): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, POLLING_INTERVAL));
};