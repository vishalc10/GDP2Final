import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { tokenNotExpired } from 'angular2-jwt';

@Injectable()
export class EmployeeService {

  constructor(private http: Http) { }
  
  registerEmployee(employee) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:3000/employees/register', employee, {headers: headers})
      .map(res => res.json());
  }
  
  getEmployees(filter=null) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.get('http://localhost:3000/employees/getAllEmployees', {headers: headers, params: filter})
      .map(res => res.json());
  }
  
  getEmployeeByID(id) {
    let param = {};
      param['emplyeeid'] = id;
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.get('http://localhost:3000/employees/getEmployee',{headers: headers, params: param})
      .map(res => res.json());
  }
  
  searchEmployees(strparam){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.get('http://localhost:3000/employees/search',  {headers: headers, params: strparam})
      .map(res => res.json());
  }
  
  updateEmployee(employee) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:3000/employees/update', employee,{headers: headers})
      .map(res => res.json());
  }
  
  deleteEmployee(employee) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:3000/employees/delete', employee,{headers: headers})
      .map(res => res.json());
  }
}
