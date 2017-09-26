import 'rxjs/add/operator/switchMap';
import { Component, OnInit, ViewChild }      from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location }               from '@angular/common';
import { NgForm } from '@angular/forms';

import { DataService } from '../data.service';
import { fadeInAnimation } from '../animations/fade-in.animation';


@Component({
  selector: 'app-class-form',
  templateUrl: './class-form.component.html',
  styleUrls: ['./class-form.component.css'],
  animations: [fadeInAnimation]  
})
export class ClassFormComponent implements OnInit {

  classForm: NgForm;
  @ViewChild('classForm') currentForm: NgForm;

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

  ngAfterViewChecked() {
    this.formChanged();
  }

  formChanged() {
    this.classForm = this.currentForm;
    this.classForm.valueChanges
      .subscribe(
        data => this.onValueChanged(data)
      );
  }

  onValueChanged(data?: any) {
    let form = this.classForm.form;

    for (let field in this.formErrors) {
      // clear previous error message (if any)
      this.formErrors[field] = '';
      const control = form.get(field);

      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }
  }
  formErrors = {
    'subject': '',
    'course': ''
  };

  validationMessages = {
    'subject': {
      'required': 'Subject is required.',
      'pattern': 'Subject must be a string.',
      'maxlength' : 'Subject must be less than 30 characters'
    },
    'course': {
      'required': 'Course is required.',
      'pattern': 'Course must be an integer',
      'maxlength' : 'Course cannot be longer than 4 digits.',
      'minlength' : 'Course cannot be less than 3 digits.'
      
    }
    
  };

}