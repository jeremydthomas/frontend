import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ethers } from 'ethers';
import tokenJson from '../assets/MyToken.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  provider: ethers.providers.Provider;
  tokenAddress: string | undefined;
  wallet: ethers.Wallet | undefined;
  tokenContract: ethers.Contract | undefined;
  etherBalance: number | undefined;
  tokenBalance: number | undefined;
  votePower: number | undefined;

  constructor(private http: HttpClient) {
    this.provider = ethers.providers.getDefaultProvider('goerli');
  }

  createWallet() {
    this.http
      .get<any>('http://localhost:3000/token-address')
      .subscribe((ans) => {
        this.tokenAddress = ans.result;
        if (this.tokenAddress) {
          this.wallet = ethers.Wallet.createRandom().connect(this.provider);

          this.tokenContract = new ethers.Contract(
            this.tokenAddress,
            tokenJson.abi,
            this.wallet
          );
          this.wallet.getBalance().then((balanceBN: ethers.BigNumberish) => {
            this.etherBalance = parseFloat(ethers.utils.formatEther(balanceBN));
          });

          this.tokenContract['balanceOf'](this.wallet.address).then(
            (balanceBN: ethers.BigNumberish) => {
              this.tokenBalance = parseFloat(
                ethers.utils.formatEther(balanceBN)
              );
            }
          );

          this.tokenContract['getVotes'](this.wallet.address).then(
            (votesBN: ethers.BigNumberish) => {
              this.votePower = parseFloat(ethers.utils.formatEther(votesBN));
            }
          );
        }
      });
  }

  claimTokens() {
    this.http
      .post<any>('http://localhost:3000/claim-tokens', {
        address: this.wallet?.address,
      })
      .subscribe((ans) => {
        const txHash = ans.result;
        console.log(txHash);

        this.provider.getTransaction(txHash).then((tx) => {
          tx.wait().then((receipt) => {
            // todo: (optional) display
            // reload info by calling the updateInfo() method
            // this.updateInfo();
            console.log(receipt);
          });
        });
      });
  }

  connectBallot(address: string) {}

  delegate() {
    console.log('moo2');
  }

  castVote() {
    console.log('moo2');
  }

  getBallotInfo() {
    this.getBallotInfo();
  }
}
