import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import axios from 'axios';

interface CustomError {
  message: string;
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  nome: string;
  codigoBarras: string;
  preco: number;
  errorMessage: string;

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
      const list = await axios.get('http://localhost:8080/api/produtos');
      for(let i = 0; i < list.data.length; i += 1) {
        if (list.data[i].codigoBarras.toLowerCase() === this.codigoBarras.toLowerCase()) {
          this.errorMessage = "Já existe um Produto com o código de Barras informado";
          repeat = true;
        } else if (list.data[i].nome.toLowerCase() === this.nome.toLowerCase()) {
          this.errorMessage = "Já existe um Produto com o nome informado";
          repeat = true;
        }
      }
      if (!repeat) {
        try {
          this.errorMessage = 'Aguarde, estamos processando seu cadastro...';
          await axios.post('http://localhost:8080/api/produtos', {
            codigoBarras: this.codigoBarras,
            preco: this.preco,
            nome: this.nome,
          });
          this.nome = '';
          this.codigoBarras = '';
          this.preco = 0;
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
}
