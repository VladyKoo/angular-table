import { Component, OnInit } from '@angular/core';
import {RequestService} from '../table/request.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {

  dataHead: Array<object> = [];
  dataBody: Array<object> = [];

  mainObj: object = {
    // Массив для хранения имен заголовка
    arrHead: [],
    // Массив для хранения имен подзаголовка
    arrSubHead: [],
    // Массив для хранения имен всех столбцов, необходим для дабовления данных в таблицу
    arrName: [],
    // Объект массивов для хранения имен столбцов, необходим для посчета количества элементов в подзаголовке
    objArrSubHead: {},
    // Объект для хранения значений чекбоксов для заголовка
    objHead: {},
    // Объект для хранения значений чекбоксов для подзаголовка
    objSubHead: {},
    // Объект для хранения значений чекбоксов всех столбцов, необходим для скрывания/показа ячеек таблицы
    objName: {}
  };
  // Объект для хранения количества элементов в подзаголовке, необходим для выставления colspan и rowspan
  lengthColumn: object = {};

  constructor(private requestService: RequestService ) { }

  ngOnInit(): void {
    // Получем данные из файла JSON
    this.requestService.getData('assets/dataFlight.json')
      .subscribe(data => {
        this.dataHead = data['head'];
        this.dataBody = data['data'];

        // Перебираем полученные данные и распределяем по объектам
        for (let h of this.dataHead){
          this.mainObj['arrHead'].push(h['name']);
          this.mainObj['objHead'][h['name']] = false;
          this.mainObj['objArrSubHead'][h['name']] = [];

          // Если в масиве head имеется пустой массив sub-head заполняем только имена
          if (h['sub-head'] === null){
            this.mainObj['arrName'].push(h['name']);
            this.mainObj['objName'][h['name']] = false;
            this.lengthColumn[h['name']] = 2;
          }
          // Иначе перебираем массив sub-head
          else {
            for (let sh of h['sub-head']){
              this.mainObj['arrSubHead'].push(sh['name']);
              this.mainObj['objArrSubHead'][h['name']].push(sh['name']);
              this.mainObj['objSubHead'][sh['name']] = false;
              this.mainObj['objName'][sh['name']] = false;
              this.mainObj['arrName'].push(sh['name']);
            }
          }
          // Добавляем колличество столбцов
          this.lengthColumn[h['name']] = this.mainObj['objArrSubHead'][h['name']].length;
        }
        console.log(this.mainObj)
      });
  }

// Функция изменения состояния чекбоксов и подсчета количества столбцов
  onChecked(name, subName){

    // Если сработал чекбокс из head и его sub-head не пуст, то выставляем все sub-head в соответствии с чекбоксом из head
    if (!subName) {
      if (this.mainObj['objArrSubHead'][name].length > 0){
        for (let i of this.mainObj['objArrSubHead'][name]) {
          this.mainObj['objName'][i] = this.mainObj['objSubHead'][i] = this.mainObj['objHead'][name];
        }
        // Если чекбокс из head === false, то задаем количество столбцов sub-head === длинне массива sub-head, иначе обнуляем
        if (!this.mainObj['objHead'][name]) {
          this.lengthColumn[name] = this.mainObj['objArrSubHead'][name].length
        } else {
          this.lengthColumn[name] = 0;
        }
      } else {
        this.mainObj['objName'][name] = this.mainObj['objHead'][name];
      }
    }
    // Иначе обрабатываем значения чекбоксов из sub-head
    else {
      // Если пришедшее значение чекбокса из sub-head === false, то выставляем соответствующий чекбокс из head в значение false
      if (!this.mainObj['objSubHead'][subName]) {
        this.mainObj['objHead'][name] = this.mainObj['objSubHead'][subName];
      }
      // Подсчитываем количество чекбоксов из sub-head === true
      let num: number = 0;
      for (let i of this.mainObj['objArrSubHead'][name]) {
        if (!this.mainObj['objSubHead'][i]) num++;
      }
      // Если все чекбоксы из sub-head === true, то выставляем соответствующий чекбокс из head в значение true
      if (num === 0) {
        num = this.mainObj['objArrSubHead'][name].length;
        this.mainObj['objHead'][name] = true;
      }
      // Обновляем количество столбцов sub-head
      this.lengthColumn[name] = num;
    }

    // Обнавляем объект со всеми чекбоксами
    for(let i of this.mainObj['arrHead']){
      this.mainObj['objName'][i] = this.mainObj['objHead'][i];
    }
    // Обнавляем объект со всеми чекбоксами
    for(let i of this.mainObj['arrSubHead']){
      this.mainObj['objName'][i] = this.mainObj['objSubHead'][i];
    }
  }
}
