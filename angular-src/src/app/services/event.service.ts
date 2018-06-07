import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';

@Injectable()

export class EventService {

  constructor(private http: Http) { }

  registerEvent(event) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:3000/events/register', event, {headers: headers})
     .map(res => res.json());
  }

  getEvents() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.get('http://localhost:3000/events/getAllEvents', {headers: headers})
      .map(res => res.json());
  }
  
  getEventByID(id) {
    let param = {};
    param['eventid'] = id;
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.get('http://localhost:3000/events/getEvent',{headers: headers, params: param})
      .map(res => res.json());
  }
  getUpEvents() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.get('http://localhost:3000/events/getAllUpcomingEvents', {headers: headers})
      .map(res => res.json());
  }
  
  searchEvents(strparam){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.get('http://localhost:3000/events/search',  {headers: headers, params: strparam})
      .map(res => res.json());
  }
  
  updateEvent(event) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:3000/events/update', event,{headers: headers})
      .map(res => res.json());
  }
  
  deleteEvent(event) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:3000/events/delete', event,{headers: headers})
      .map(res => res.json());
  }
  

    public getEventstest(): Observable<any> {
        const dateObj = new Date();
        const yearMonth = dateObj.getUTCFullYear() + '-' + (dateObj.getUTCMonth() + 1);
        let data: any = [
            {
                title: 'All Day Event',
                start: yearMonth + 'T08:15:30-05:00'
             },
            {
                title: 'Long Event',
                start: yearMonth + '-07',
                end: yearMonth + '-08'
            },
            {
                id: 999,
                title: 'Repeating Event',
                start: yearMonth + '-07T16:00:00'
            },
            {
                id: 999,
                title: 'Repeating Event',
                start: yearMonth + '-16T16:00:00'
            },
            // {
            //     title: 'Conference',
            //     start: yearMonth + '-07',
            //     end: yearMonth + '-09'
            // },
            {
                title: 'Meeting',
                start: yearMonth + '-07T10:30:00',
                end: yearMonth + '-07T12:30:00'
            },
            {
                title: 'Lunch',
                start: yearMonth + '-12T12:00:00'
            },
            {
                title: 'Meeting',
                start: yearMonth + '-12T14:30:00'
            },
            {
                title: 'Happy Hour',
                start: yearMonth + '-12T17:30:00'
            },
            {
                title: 'Dinner',
                start: yearMonth + '-12T20:00:00'
            },
            {
                title: 'Birthday Party',
                start: yearMonth + '-13T07:00:00'
            },
            {
                title: 'Click for Google',
                url: 'http://google.com/',
                start: yearMonth + '-28',
              dddd: 'ddddd'
            }];
        return Observable.of(data);
    }
};
