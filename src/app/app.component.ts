import { Component } from '@angular/core';
import {Credentials, CloudWatch} from 'aws-sdk';
import {Timestamp} from 'rxjs/internal-compatibility';

type tempDataObject = {
  name: string;
  value: number;
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  currentTemperature = 'Test';
  tempData = { name: 'temp', series: []};
  public chartsPop = false;
  public colorScheme = ['#844fff'];

  constructor() {

    const myCredentials = new Credentials();
    const cloudwatch = new CloudWatch({region: 'ap-southeast-2', credentials: myCredentials});

    const oneHourAgo = new Date();
    oneHourAgo.setHours(oneHourAgo.getHours() - 1);

    const params = {
      EndTime: new Date(),
      MetricDataQueries: [
        {
          Id: 'm1',
          MetricStat: {
            Metric: {
              Namespace: 'CoolApp',
              MetricName: 'Temperature',
              Dimensions: [
                {
                  Name: 'Temperature',
                  Value: 'C'
                }
              ]
            },
            Period: 300,
            Stat: 'Maximum',
            Unit: 'None'
          }
        }
      ],
      StartTime: oneHourAgo ,
    };

    cloudwatch.getMetricData(params, (err, data) => {
      if (err) { console.log(err, err.stack); } // an error occurred
      else {

        this.currentTemperature = data.MetricDataResults[0].Values[0].toFixed(3);

        const seriesArray = [];
        const results = data.MetricDataResults[0];
        // tslint:disable-next-line:forin
        for (const i in results.Timestamps)
        {
          const tempObj = {
            name: results.Timestamps[i].toLocaleTimeString(),
            value: results.Values[i].toString()
          };
          seriesArray.push(tempObj);
        }

        this.tempData = {name: 'Temperature', series: seriesArray.reverse()};
        this.tempData = JSON.parse(JSON.stringify(this.tempData).replace(/^\{(.*)\}$/, '[ { $1 }]'));
        this.chartsPop = true;
      }           // successful response
    });
  }
}
