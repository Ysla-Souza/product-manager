import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'; // Importe o Router da biblioteca @angular/router

interface IParams {
  code: string;
}

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent {
  name: string;
  code: string;
  price: number;
  errorMessage: string;

  constructor(private router: Router, private activateRoute: ActivatedRoute) {
    this.name = '';
    this.code = '';
    this.price = 0;
    this.errorMessage = '';
  }

  ngOnInit() {
    this.activateRoute.params.subscribe(params => {
      const typedParams = params as IParams;
      if (typedParams && typedParams.code) {
        console.log("Produto pelo seu código:", typedParams.code);
        this.name = 'Produto';
        this.code = typedParams.code;
        this.price = 666;
      }
    });
  }

  onSubmit(): void {
    this.errorMessage = '';
    if (typeof this.price !== 'number' || this.price <= 0) this.errorMessage = 'Necessário fornecer um preço para o produto que seja numérico e que seja maior que zero';
    if (this.code === '' || !this.code || this.code.length < 8) this.errorMessage = 'Necessário fornecer um código para o produto de pelo menos 8 caracteres';
    if (this.name === '' || !this.name || this.name.length < 2) this.errorMessage = 'Necessário fornecer um nome para o produto de pelo menos dois caracteres';
    if (this.errorMessage === '') {
      console.log('cadastro realizado');
      this.name = '';
      this.code = '';
      this.price = 0;
      this.errorMessage = 'Produto Atualizado com sucesso!';
      setTimeout(() => {
        this.errorMessage = '';
      }, 3000)
    }
  }
}
