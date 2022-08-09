import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { GoogleChartInterface, GoogleChartsControlInterface, GoogleChartsDashboardInterface, GoogleChartType } from 'ng2-google-charts';
import { AuthService } from 'src/app/services/auth.service';
import { PaymentService } from 'src/app/services/payment.service';
import { ThemeService } from 'src/app/services/theme.service';


//import {MediaMatcher} from '@angular/cdk/layout';
//import {ChangeDetectorRef} from '@angular/core';
//import { MatStepper } from '@angular/material/stepper';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {


  public lineChart: GoogleChartInterface = {
    chartType: GoogleChartType.LineChart,
    dataTable: [
      ['Year', 'Sales', 'Expenses'],
      ['2004',  1000,      400],
      ['2005',  1170,      460],
      ['2006',  660,       1120],
      ['2007',  1030,      540]
    ],
    options: {title: 'Company Performance'}
  };

  constructor(
    public themeService: ThemeService,
    public auth: AuthService,
    public pay: PaymentService,
  ) { }

  ngOnInit(): void {
  }


}
