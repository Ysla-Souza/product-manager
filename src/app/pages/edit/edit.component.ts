import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import axios from 'axios';

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
      try {
        this.errorMessage = 'Aguarde, estamos processando seu cadastro...';
        await axios.post('http://localhost:8080/api/produtos', {
          codigoBarras: this.code,
          preco: this.price,
          nome: this.name,
        });
        this.name = '';
        this.code = '';
        this.price = 0;
        this.errorMessage = 'Produto Cadastrado com sucesso!';
        setTimeout(() => {
          this.errorMessage = '';
        }, 3000);
      } catch(error: unknown) {
        if (error instanceof Error && 'message' in error) {
          const customError = error as Error;
          this.errorMessage = `Ocorreu um erro ao tentar realizar o cadastro do Produto: ${customError.message}`;
        } else {
          this.errorMessage = 'Erro desconhecido';
        }
      }
    }
  }
}
