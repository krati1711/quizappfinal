import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-finish',
  templateUrl: './finish.component.html',
  styleUrls: ['./finish.component.css']
})
export class FinishComponent implements OnInit {

  constructor(private commonService: CommonService) {
    // addding background to page
    document.body.style.backgroundImage = "url('../../../assets/background1.jpg')";
   }

  ngOnInit(): void {
    this.commonService.removeAccess();
  }

}
