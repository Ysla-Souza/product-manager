import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';


interface IProduct {
  id: number;
  nome: string;
  codigoBarras: string;
  preco: number;
}

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit{
  list: IProduct [];
  itemToDelete: IProduct;
  deleteConfirmationVisible: boolean;
  deleteMessage: string;

  constructor(private http: HttpClient) {
    this.list = [];
    this.itemToDelete = { id: 0, nome: '', codigoBarras: '', preco: 0 };
    this.deleteConfirmationVisible = false;
    this.deleteMessage = '';
  };
ngOnInit(): void {
      this.updateList();
    }
    async updateList() {
      try {
        const response = await this.http.get<IProduct[]>('http://localhost:8080/api/produtos').toPromise();
    if (response) {
      this.list = response;
    } else {
      this.list = [];
    }
    
      }catch (error: unknown) {
        if (error instanceof HttpErrorResponse) {
          if (error.status === 404) {
            this.deleteMessage = 'Produto não encontrado.';
          } else if (error.status === 500) {
            this.deleteMessage = 'Erro interno do servidor. Tente novamente mais tarde.';
          } else {
            this.deleteMessage = 'Erro desconhecido ao excluir o produto.';
          }
        } else {
          console.error('Erro desconhecido:', error);
          this.deleteMessage = 'Erro desconhecido';
        }
      }
    };

  deleteItem(product: IProduct): void {
    this.itemToDelete = { id: product.id, nome: product.nome, codigoBarras: product.codigoBarras, preco: product.preco };
    this.deleteConfirmationVisible = true;
  };

  async confirmDelete(): Promise<void> {
    try {
      this.deleteMessage = 'Aguarde, estamos processando a exclusão...';
      await this.http.delete(`http://localhost:8080/api/produtos/${this.itemToDelete.id}`).toPromise();
      await this.updateList();
      this.itemToDelete = { id: 0, nome: '', codigoBarras: '', preco: 0 };
      this.deleteConfirmationVisible = false;
      this.deleteMessage = '';
    } catch (error: unknown) {
      if (error instanceof HttpErrorResponse) {
        const customError = error as Error;
        this.deleteMessage = `Ocorreu um erro ao tentar realizar o cadastro do Produto: ${customError.message}`;
      } else {
        this.deleteMessage = 'Erro desconhecido';
      }
    }
  };
  cancelDelete(): void {
    this.itemToDelete = { id: 0, nome: '', codigoBarras: '', preco: 0 };
    this.deleteConfirmationVisible = false;
  };
}
