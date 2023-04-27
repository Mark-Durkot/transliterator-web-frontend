import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
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

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {

    this.socket = webSocket<any>(`ws://${environment.API_URL}?transliterator=pinyin-ukrainian`);

    this.form = this.fb.group({
      source: new FormControl<string>(''),
      target: new FormControl<string>(''),
      languages: new FormControl<string>('pinyin-ukrainian')
    });

    this.form.get('source')?.valueChanges.subscribe(value => { this.socket.next(value); });

    this.form.get('languages')?.valueChanges.subscribe(value => {
      this.socket.complete();

      this.form.patchValue({ source: '', target: '' });

      this.socket = webSocket<{ result: string }>(`ws://${environment.API_URL}?transliterator=${value}`);

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
      () => console.log('closing connection')
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
