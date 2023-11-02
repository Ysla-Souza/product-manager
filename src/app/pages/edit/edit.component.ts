import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

interface IParams {
  id: number;
}

interface IProduct {
  id: number;
  nome: string;
  codigoBarras: string;
  preco: number;
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

  constructor(private router: Router, private activateRoute: ActivatedRoute, private http: HttpClient) {
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
        try {
          const product = await this.http.get<IProduct>(`http://localhost:8080/api/produtos/${typedParams.id}`).toPromise();
          if (product) {
            this.id = product.id;
            this.nome = product.nome;
            this.codigoBarras = product.codigoBarras;
            this.preco = product.preco;
          } else {
            this.errorMessage = 'Produto não encontrado';
          }
        } catch (error: unknown) {
          if (error instanceof HttpErrorResponse) {
            this.errorMessage = 'Erro ao obter os dados do produto';
          } else {
            this.errorMessage = 'Erro desconhecido';
          }
        }
      }
    });
  }

  async onSubmit(): Promise<void> {
    this.errorMessage = '';
    if (typeof this.preco !== 'number' || this.preco <= 0) this.errorMessage = 'Necessário fornecer um preço para o produto que seja numérico e que seja maior que zero';
    if (this.codigoBarras === '' || !this.codigoBarras || this.codigoBarras.length < 8) this.errorMessage = 'Necessário fornecer um código para o produto de pelo menos 8 caracteres';
    if (this.nome === '' || !this.nome || this.nome.length < 2) this.errorMessage = 'Necessário fornecer um nome para o produto de pelo menos dois caracteres';

    if (this.errorMessage === '') {
      try {
        const list = await this.http.get<IProduct[]>('http://localhost:8080/api/produtos').toPromise();
        if (list) {
          // Loop e verificação de duplicatas aqui
        } else {
          this.errorMessage = 'A lista de produtos está vazia ou não foi obtida com sucesso.';
        }
      } catch (error: unknown) {
        if (error instanceof HttpErrorResponse) {
          this.errorMessage = 'Erro ao obter a lista de produtos';
        } else {
          this.errorMessage = 'Erro desconhecido';
        }
      }

        if (this.errorMessage === '') {
          this.errorMessage = 'Aguarde, estamos processando sua atualização...';

          const requestBody = {
            id: this.id,
            codigoBarras: this.codigoBarras,
            preco: this.preco,
            nome: this.nome,
          };

          await this.http.put('http://localhost:8080/api/produtos', requestBody).toPromise();

          this.errorMessage = `Produto ${this.nome} Atualizado com sucesso! Redirecionando para a página principal...`;
          this.id = 0;
          this.nome = '';
          this.codigoBarras = '';
          this.preco = 0;
          setTimeout(() => {
            this.errorMessage = '';
            this.router.navigate(['/']);
          }, 3000);
        }
      } catch(error: unknown) {
        if (error instanceof HttpErrorResponse) {
          this.errorMessage = `Ocorreu um erro ao tentar realizar a atualização do Produto: ${error.message}`;
        } else {
          this.errorMessage = 'Erro desconhecido';
        }
      }
    }
  }
}