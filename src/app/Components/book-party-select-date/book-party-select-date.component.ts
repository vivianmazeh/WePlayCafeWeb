import { Component , signal, ChangeDetectorRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, DateSelectArg, EventClickArg, EventApi, CalendarApi, EventInput } from '@fullcalendar/core';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { INITIAL_EVENTS, createEventId } from './event-utils';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { EventService } from 'src/app/service/event-service.service';

@Component({
  selector: 'app-book-party-select-date',
  templateUrl: './book-party-select-date.component.html',
  styleUrl: './book-party-select-date.component.css',
  providers: [EventService]
})
export class BookPartySelectDateComponent implements OnInit {

  @ViewChild('calendar')
  calendar!: FullCalendarComponent;

  calendarVisible = signal(true);
  calendarOptions = signal<CalendarOptions>({
    plugins: [
      interactionPlugin,
      dayGridPlugin
    ],
    headerToolbar: {
      left: 'prev,next',
      center: 'title',
      right: ''
    },
    validRange: {
      start:  new Date(),// make the dates before today unclickable
      end: this.validRangeEndDay(),
    },
    initialView: 'dayGridMonth',
    //initialEvents: INITIAL_EVENTS, // alternatively, use the `events` setting to fetch from a feed
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
  //  select: this.handleDateSelect.bind(this),
   // eventClick: this.handleEventClick.bind(this),
  //  eventsSet: this.handleEvents.bind(this),
    dateClick: (arg) => this.handleDateClick(arg),
 
    /* you can update a remote database when these fire:
    eventAdd:
    eventChange:
    eventRemove:
    */
  });

  event: {
    id: string;   
    date: Date;  
    time: number; 
    timeString: string;
    dateString: string;
    name: string;
    email: string;
    phone: string;
    package: string;
  } ={
    id: '',   
    date: new Date(),  
    time: 0,
    timeString: '',
    dateString: '',
    name: '',
    email: '',
    phone: '',
    package: ''
  };
  eventsPromise!: Promise<EventInput>;
  showSelectTime: boolean = false;
  yourReservation: string = '';
 // currentEvents = signal<EventApi[]>([]);
  dateTime = {
    date: new Date(),
    timeSlots: [
      { time: '10:00 am', 
        selected: false,
        time_hour: 10},
      { time: '11:00 am', 
        selected: false,
        time_hour: 11},
        { time: '12:00 am', 
        selected: false,
        time_hour: 12},
        { time: '1:00 pm', 
        selected: false,
        time_hour: 13},
        { time: '2:00 pm', 
        selected: false,
        time_hour: 14},
        { time: '3:00 pm', 
        selected: false,
        time_hour: 15},
        { time: '4:00 pm', 
        selected: false,
        time_hour: 16},
        { time: '5:00 pm', 
        selected: false,
        time_hour: 17},
        { time: '6:00 pm', 
        selected: false,
        time_hour: 18},
    ]
  };

  appointmentHeader: String = '';
  lastClickedDateElement: any;

  constructor(private changeDetector: ChangeDetectorRef, private service: EventService) {

  }
  ngOnInit(): void {  
    this.calendarVisible.update((bool) => !bool);
  
    
  }

  validRangeEndDay(): Date{
  
    const millisecondsInDay = 1000 * 60 * 60 * 24;
    let today = new Date();
    let endDate = new Date();
  
    if (today && today instanceof Date && !isNaN(today.getTime())) {
      endDate = new Date(today.getTime() + 180 * millisecondsInDay);
    } else {
      // Handle the case where this.TODAY is not defined or not a valid date
      console.error('this.TODAY is not defined or not a valid date');
      endDate = new Date(); // default to current date or handle appropriately
    }

    return endDate;
  }
 
handleDateClick(arg: DateClickArg) {
    const selectedCalendarApi = arg.view.calendar;
    const clickedElement = arg.dayEl;
    this.showSelectTime = true;
    let date = new Date(arg.date);
   
    this.appointmentHeader = " selected on " + this.formattedDate(date);
    this.dateTime.date = date; 

   this.event.id = createEventId();
   this.event.date = date;
   this.event.dateString = this.formattedDate(arg.date);
   

  }

  selectTimeSlot(selectedTime: number) {

     const timeSlots = this.dateTime.timeSlots;
 
     for(let i =0; i< timeSlots.length; i++){
        let slot = timeSlots[i];
        if(slot.time_hour === selectedTime){
          slot.selected = true;  
          this.event.time = slot.time_hour;
          this.event.timeString = slot.time;
        }
     }
    this.yourReservation = 'Your reservation: ' + this.event.dateString + ' at ' + this.event.timeString;
  }
  formattedDate(date : Date): string{

    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };

    const dateTimeFormat = new Intl.DateTimeFormat('en-US', options);
    return dateTimeFormat.format(date);

  }

   handleCalendarToggle() {
    this.calendarVisible.update((bool) => !bool);
  }
 
 /*  handleDateSelect(selectInfo: DateSelectArg) {
   
    const selectedCalendarApi = selectInfo.view.calendar;
    let date = new Date(selectInfo.start);

    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    };
    const dateTimeFormat = new Intl.DateTimeFormat('en-US', options);
    this.selectedDate = dateTimeFormat.format(date);



    selectedCalendarApi.unselect(); // clear date selection

   
    selectedCalendarApi.addEvent({
        id: createEventId(),     
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay
      });
    
  } */

  // handleEventClick(clickInfo: EventClickArg) {
  //   if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
  //     clickInfo.event.remove();
  //   }
  // }

  // handleEvents(events: EventApi[]) {
  //   this.currentEvents.set(events);
  //   this.changeDetector.detectChanges(); // workaround for pressionChangedAfterItHasBeenCheckedError
  // }
  
}
