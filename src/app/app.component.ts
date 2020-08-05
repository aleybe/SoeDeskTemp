import { Component } from '@angular/core';
import * as axios from 'axios';


function fixDateTime (inputObj)
{
  let inputString = inputObj.name;

  let inputHours = inputString.split(":")[0];
  let inputMinutes = inputString.split(":")[1].split(" ")[0];
  let inputPastNoon = inputString.split(":")[2].split(" ")[1];

  let hours = inputHours;
  let minutes = inputMinutes;

  if(inputPastNoon == "PM")
  {
    hours = inputHours + 12;
  }

  if(inputPastNoon == "AM" && inputHours == 12)
  {
    hours = 0;
  }

  var DateObject = new Date();
  var utcDate = DateObject.getUTCFullYear();

  var year = DateObject.getUTCFullYear();
  var month = DateObject.getUTCMonth();
  var day = DateObject.getUTCDay();

  var returnDate = new Date(year, month, day, hours, minutes, 0)
  returnDate.setMinutes(returnDate.getMinutes() + 480);

  //return returnDate.toTimeString() //{ name: returnDate.toTimeString() , value: inputObj.value };
  return { name: returnDate.toTimeString().split(" ")[0] , value: inputObj.value };
}



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
        let cleanerDataset = data.data.returnData[0].series;
        var results = cleanerDataset.map(fixDateTime)

        this.tempData = [{ name: 'Temperature', series: results }];
        this.chartsPop = true;
        let lastElementToSelect = data.data.returnData[0].series.length - 1;
        this.currentTemperature = data.data.returnData[0].series[lastElementToSelect].value;

      });
  };
}
