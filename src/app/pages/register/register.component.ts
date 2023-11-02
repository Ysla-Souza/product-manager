import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';

interface IProduct {
  id: number;
  nome: string;
  codigoBarras: string;
  preco: number;
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent {
  nome: string = '';
  codigoBarras: string = '';
  preco: number = 0;
  errorMessage: string = '';

  constructor(private http: HttpClient) {
    this.nome = '';
    this.codigoBarras = '';
    this.preco = 0;
    this.errorMessage = '';
  }

  async onSubmit(): Promise<void> {
    this.errorMessage = '';
    if (typeof this.preco !== 'number' || this.preco <= 0) this.errorMessage = 'Necessário fornecer um preço para o produto que seja numérico e que seja maior que zero';
    if (this.codigoBarras === '' || !this.codigoBarras || this.codigoBarras.length < 8) this.errorMessage = 'Necessário fornecer um código para o produto de pelo menos 8 caracteres';
    if (this.nome === '' || !this.nome || this.nome.length < 2) this.errorMessage = 'Necessário fornecer um nome para o produto de pelo menos dois caracteres';
  
    if (this.errorMessage === '') {
      let repeat = false;
      try {
        const list = await this.http.get<IProduct[]>('http://localhost:8080/api/produtos').toPromise();
        
        if (list === undefined) {
          // Trate a resposta como indefinida
          this.errorMessage = 'Erro ao obter a lista de produtos';
          return;
        }
  
        for (let i = 0; i < list.length; i += 1) {
          if (list[i].nome.toLowerCase() === this.nome.toLowerCase()) {
            this.errorMessage = "Já existe um Produto com o nome informado";
            repeat = true;
          } else if (list[i].codigoBarras.toLowerCase() === this.codigoBarras.toLowerCase()) {
            this.errorMessage = "Já existe um Produto com o código de Barras informado";
            repeat = true;
          }
        }
  
        if (!repeat) {
          // Resto do seu código
        }
      } catch (error: unknown) {
        if (error instanceof HttpErrorResponse) {
          this.errorMessage = `Ocorreu um erro ao tentar realizar o cadastro do Produto: ${error.message}`;
        } else {
          this.errorMessage = 'Erro desconhecido';
        }
      }
    }
  }
}
