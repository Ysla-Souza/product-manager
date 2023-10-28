import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import axios from 'axios';

interface IParams {
  id: number;
}

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent {
  id: number;
  nome: string;
  codigoBarras: string;
  preco: number;
  errorMessage: string;

  constructor(private router: Router, private activateRoute: ActivatedRoute) {
    this.id = 0;
    this.nome = '';
    this.codigoBarras = '';
    this.preco = 0;
    this.errorMessage = '';
  }

  async ngOnInit() {
    this.activateRoute.params.subscribe(async params => {
      const typedParams = params as IParams;
      if (typedParams && typedParams.id) {
        const product = await axios.get(`http://localhost:8080/api/produtos/${typedParams.id}`);
        this.id = product.data.id;
        this.nome = product.data.nome;
        this.codigoBarras = product.data.codigoBarras;
        this.preco = product.data.preco;
      }
    });
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
        if (list.data[i].nome.toLowerCase() === this.nome.toLowerCase()) {
          if (list.data[i].id !== this.id) {
            this.errorMessage = "Já existe um Produto com o nome informado";
            repeat = true;
          } 
        } else if (list.data[i].codigoBarras.toLowerCase() === this.codigoBarras.toLowerCase()) {
          if (list.data[i].id !== this.id) {
            this.errorMessage = "Já existe um Produto com o código de Barras informado";
            repeat = true;
          }
        }
      }
      console.log(repeat);
      if (!repeat) {
        try {
          this.errorMessage = 'Aguarde, estamos processando seu cadastro...';
          await axios.put('http://localhost:8080/api/produtos', {
            id: this.id,
            codigoBarras: this.codigoBarras,
            preco: this.preco,
            nome: this.nome,
          });
          this.errorMessage = `Produto ${this.nome} Atualizado com sucesso! Redirecionando para a página principal...`;
          this.id = 0;
          this.nome = '';
          this.codigoBarras = '';
          this.preco = 0;
          setTimeout(() => {
            this.errorMessage = '';
            this.router.navigate(['/']);
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
