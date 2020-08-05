import { Component } from '@angular/core';
import * as axios from 'axios';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  currentTemperature = 'Loading...';
  tempData = [];
  public chartsPop = false;
  public colorScheme = ['#844fff'];

  constructor() {

    const url = 'https://ds0k5q2pdc.execute-api.ap-southeast-2.amazonaws.com/dev';

      axios.default.get(url).then((data) => {
        console.log(data);
        console.log(data.data.returnData[0]);

        this.tempData = [{ name: 'Temperature', series: data.data.returnData[0].series }];
        this.chartsPop = true;
        let lastElementToSelect = data.data.returnData[0].series.length - 1;
        this.currentTemperature = data.data.returnData[0].series[lastElementToSelect].value;

      });
  };
}
