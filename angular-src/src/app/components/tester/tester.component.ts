import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-tester',
  templateUrl: './tester.component.html',
  styleUrls: ['./tester.component.scss']
})
export class TesterComponent implements OnInit {

  rForm: FormGroup;
  post: any; // for our submitted form
  description: string = '';
  name: string = '';

  constructor(private fb: FormBuilder) {
    
    this.rForm = fb.group({
      'name': [null, Validators.required],
      'description': [null, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(7)])]
    });

  }

  ngOnInit() {
    
  }

  addPost(post) {
    console.log(post);
  }

}
