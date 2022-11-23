import { Component } from '@angular/core';
import { ethers } from 'ethers';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'example title';
  lastBlockNumber: number | undefined;
  clicks = 0;

  constructor() {
    ethers
      .getDefaultProvider('goerli')
      .getBlock('latest')
      .then((block) => (this.lastBlockNumber = block.number));
  }

  countClick(increment: string) {
    this.clicks += parseFloat(increment);
  }
}
