import { Component, OnInit } from '@angular/core';
import {Hero} from './hero';
import {HeroService} from "../hero.service";
import {MessageService} from "../message.service";


@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})
export class HeroesComponent implements OnInit {

  heroes: Hero[];
  constructor(private heroService: HeroService, private messageService: MessageService) { }

  //calls on service to get data of heroes
  getHeroes(): void {
    this.heroService.getHeroes()
      .subscribe(heroes => this.heroes = heroes);
  }

  /**
   * Capitalises first letter of hero name input and clears empty spaces
   * @param name
   */
  capitalise(name:string):string{
    name = name.trim();
    let nameFirstLetter = name.slice(0,1);
    let nameEnding = name.slice(1,name.length);
    return nameFirstLetter.toUpperCase() + nameEnding;
  }

  add(name :string): void {
    name= this.capitalise(name);
    if (!name) {return; }
    this.heroService.addHero({name} as Hero)
      .subscribe(hero => {
        this.heroes.push(hero)
      });
  }

  delete(hero:Hero):void{
    this.heroes = this.heroes.filter(h => h!==hero);
    this.heroService.deleteHero(hero).subscribe();
  }

  //initialization logic goes here
  ngOnInit(): void {
    this.getHeroes();
  }

}
