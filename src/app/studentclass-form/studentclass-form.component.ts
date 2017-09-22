import 'rxjs/add/operator/switchMap';
import { Component, OnInit }      from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location }               from '@angular/common';
import { NgForm } from '@angular/forms';

import { DataService } from '../data.service'

@Component({
  selector: 'app-studentclass-form',
  templateUrl: './studentclass-form.component.html',
  styleUrls: ['./studentclass-form.component.css']
})
export class StudentclassFormComponent implements OnInit {

  successMessage: string;
  errorMessage: string;

  studentclass: object;
  students: any[];
  classes: any[];
  
    getStudents() {
      this.dataService.getRecords("student")
        .subscribe(
          students => this.students = students,
          error =>  this.errorMessage = <any>error);
    }

    getClasses() {
      this.dataService.getRecords("class")
        .subscribe(
          classes => this.classes = classes,
          error =>  this.errorMessage = <any>error);
    }


  getRecordForEdit(){
    this.route.params
      .switchMap((params: Params) => this.dataService.getRecord("studentclass", +params['id']))
      .subscribe(studentclass => this.studentclass = studentclass);
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

      this.getClasses();
      this.getStudents();

  }

  saveStudentclass(studentclass: NgForm){
    if(typeof studentclass.value.student_class_id === "number"){
      this.dataService.editRecord("studentclass", studentclass.value, studentclass.value.student_class_id)
          .subscribe(
            studentclass => this.successMessage = "Record updated succesfully",
            error =>  this.errorMessage = <any>error);
    }else{
      this.dataService.addRecord("studentclass", studentclass.value)
          .subscribe(
            studentclass => this.successMessage = "Record added succesfully",
            error =>  this.errorMessage = <any>error);
            this.studentclass = {};
    }

  }

}
