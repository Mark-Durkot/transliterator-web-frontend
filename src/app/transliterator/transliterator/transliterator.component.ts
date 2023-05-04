import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { WebSocketSubject, webSocket } from 'rxjs/webSocket'
import { environment } from 'src/environments/environment';

@Component({
  selector: 'transliterator',
  templateUrl: './transliterator.component.html',
  styleUrls: ['./transliterator.component.scss']
})
export class TransliteratorComponent implements OnInit, OnDestroy {

  form: FormGroup;

  socket: WebSocketSubject<{ result: string }>;

  transliterators = [
    'pinyin-ukrainian',
    'ukrainian-pinyin',
    'german-ukrainian',
    'spanish-ukrainian',
    'ukrainian-passport',
    'ukrainian-scientific'
  ];

  constructor(private fb: FormBuilder, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {

    this.spinner.show('socket-connection-spinner');
    this.socket = webSocket<any>({ url: `ws://${environment.API_URL}?transliterator=pinyin-ukrainian`, openObserver: {
      next: () => { this.spinner.hide('socket-connection-spinner') }
    } });

    this.form = this.fb.group({
      source: new FormControl<string>(''),
      target: new FormControl<string>(''),
      languages: new FormControl<string>('pinyin-ukrainian')
    });

    this.form.get('source')?.valueChanges.subscribe(value => { this.socket.next(value); });

    this.form.get('languages')?.valueChanges.subscribe(value => {
      this.socket.complete();

      this.form.patchValue({ source: '', target: '' });

      this.spinner.show('socket-connection-spinner');
      this.socket = webSocket<{ result: string }>({url: `ws://${environment.API_URL}?transliterator=${value}`, openObserver: {
        next: () => { this.spinner.hide('socket-connection-spinner');}
      }});

      this.subscribeToSocket(this.socket);
    })

    this.subscribeToSocket(this.socket);
  }

  ngOnDestroy(): void {
    this.socket.complete();
  }

  subscribeToSocket(socket: WebSocketSubject<any>) : void {
    this.socket.subscribe(
      msg => {
        this.messageRevieced(msg)
      },
      error => { console.log('error: ' + error); this.form.patchValue({ target: error }) },
      () => console.log('closing connection'),
    );
  }

  messageRevieced(message: any): void {
    console.log(message);
    let displayMessage = '';
    for (let i = 0; i < message.length; ++i) {
      displayMessage += message[i].word;
    }
    console.log(displayMessage);
    this.form.patchValue({ target: displayMessage });
  }

}
