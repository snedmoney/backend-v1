import { Log, decodeEventLog } from 'viem';
import abi from '@/configs/abi';

export const getContractLogs = (logs: Log[]) => {
    return logs
        .map((log) => {
            try {
                const { args, eventName } = decodeEventLog({
                    abi: abi,
                    data: log.data,
                    topics: (log as any).topics,
                });
                return {
                    eventName: eventName as string,
                    args: args as any,
                };
            } catch (e) {}
        })
        .filter((log) => log?.eventName);
};