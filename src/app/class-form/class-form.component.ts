import 'rxjs/add/operator/switchMap';
import { Component, OnInit }      from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location }               from '@angular/common';
import { NgForm } from '@angular/forms';

import { DataService } from '../data.service'

@Component({
  selector: 'app-class-form',
  templateUrl: './class-form.component.html',
  styleUrls: ['./class-form.component.css']
})
export class ClassFormComponent implements OnInit {

  successMessage: string;
  errorMessage: string;
  instructors: any[];

  classData: object;

  getInstructors() {
    this.dataService.getRecords("instructor")
      .subscribe(
        instructors => this.instructors = instructors,
        error =>  this.errorMessage = <any>error);
  }

  getRecordForEdit(){
    this.route.params
      .switchMap((params: Params) => this.dataService.getRecord("class", +params['id']))
      .subscribe(currentclass => this.classData = currentclass);
  }

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit() {
    this.route.params
      .subscribe((params: Params) => {
        (+params['id']) ? this.getRecordForEdit() : null;
      });

      this.getInstructors();

  }

  saveClass(currentclass: NgForm){
    if(typeof currentclass.value.class_id === "number"){
      this.dataService.editRecord("class", currentclass.value, currentclass.value.class_id)
          .subscribe(
            currentclass => this.successMessage = "Record updated succesfully",
            error =>  this.errorMessage = <any>error);
    }else{
      this.dataService.addRecord("class", currentclass.value)
          .subscribe(
            currentclass => this.successMessage = "Record added succesfully",
            error =>  this.errorMessage = <any>error);
            this.classData = {};
    }

  }

}