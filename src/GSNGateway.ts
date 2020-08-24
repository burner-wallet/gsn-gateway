import Gateway from '@burner-wallet/core/gateways/Gateway';
import { RelayClient } from '@opengsn/gsn';

export default class GSNGateway extends Gateway {
  private isOn = true;
  private _w3Provider: any = null;
  private clients: { [network: string]: any } = {};

  constructor() {
    super(['1', '3', '4', '5', '42', '100']);
  }

  isAvailable() {
    return this.isOn;
  }

  getClient(network: string) {
    if (!this.clients[network]) {
      const provider = this.core.getProvider(network);
      this.clients[network] = new RelayClient(provider, { chainId: parseInt(network) });
    }
    return this.clients[network];
  }

  async sendTx(network: string, payload: any) {
    if (payload.params[0].useGSN || payload.params[0].gasless) {
      const client = this.getClient(network);
      return new Promise((resolve, reject) => {
        client.runRelay({
          ...payload,
          method: 'eth_sendTransaction',
        }, (err: any, result: any) => {
          if (err) {
            return reject(err);
          }
          resolve(result.result);
        });
      });
    }

    return this.send(network, {
      ...payload,
      params: [payload.params[0].signedTransaction],
    });
  }

  async send(network: string, payload: any) {
    try {
      this.isOn = false;
      const request = this.core.handleRequest(network, payload);
      this.isOn = true;

      const response = await request;

      if (payload.method === 'eth_getTransactionReceipt' && response) {
        this.getClient(network).fixTransactionReceiptResp(response.result);
      }
      return response;
    } catch (e) {
      this.isOn = true;
      throw e;
    }
  }
}
