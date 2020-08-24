# GSN Gateway for Burner Wallet

Allows sending gasless transactions over the Gas Station Network inside a Burner Wallet.

## Use

Install package:

```
yarn add @burner-wallet/gsn-gateway
```

Add plugin to Burner Wallet

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import { xdai, dai, eth, ERC777Asset } from '@burner-wallet/assets';
import BurnerCore from '@burner-wallet/core';
import { InjectedSigner, LocalSigner } from '@burner-wallet/core/signers';
import { InfuraGateway, InjectedGateway, XDaiGateway } from '@burner-wallet/core/gateways';
import ModernUI from '@burner-wallet/modern-ui';
import GSNGateway from '@burner-wallet/gsn-gateway';

const myToken = new ERC777Asset({
  id: 'my-token',
  name: 'My Token',
  network: '100',
  address: '0x749278c857ec757e49274927857ec749277857ec',
  gasless: true,
});

const core = new BurnerCore({
  signers: [new InjectedSigner(), new LocalSigner()],
  gateways: [
    new GSNGateway(),
    new InfuraGateway(process.env.REACT_APP_INFURA_KEY),
    new XDaiGateway(),
  ],
  assets: [myToken, xdai, dai, eth],
});

const BurnerWallet = () => <ModernUI core={core} />

ReactDOM.render(<BurnerWallet />, document.getElementById('root'));

```
