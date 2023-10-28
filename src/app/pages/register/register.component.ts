import { Component } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  name: string;
  code: string;
  price: number;
  errorMessage: string;

  constructor() {
    this.name = '';
    this.code = '';
    this.price = 0;
    this.errorMessage = '';
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
      this.errorMessage = 'Produto Cadastrado com sucesso!';
      setTimeout(() => {
        this.errorMessage = '';
      }, 3000)
    }
  }
}
