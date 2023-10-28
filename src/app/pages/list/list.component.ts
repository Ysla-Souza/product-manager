import { Component } from '@angular/core';
import axios from 'axios';

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
export class ListComponent {
  list: IProduct [];
  itemToDelete: IProduct;
  deleteConfirmationVisible: boolean;
  deleteMessage: string;

  constructor() {
    this.list = [];
    this.itemToDelete = { id: 0, nome: '', codigoBarras: '', preco: 0 };
    this.deleteConfirmationVisible = false;
    this.deleteMessage = '';
  };

  async updateList() {
    const list = await axios.get('http://localhost:8080/api/produtos');
    this.list = list.data;
  };

  async ngOnInit() {
    await this.updateList();
  };

  deleteItem(product: IProduct): void {
    this.itemToDelete = { id: product.id, nome: product.nome, codigoBarras: product.codigoBarras, preco: product.preco };
    this.deleteConfirmationVisible = true;
  };

  async confirmDelete(): Promise<void> {
    try {
      this.deleteMessage = 'Aguarde, estamos processando a exclusão...';
      await axios.delete(`http://localhost:8080/api/produtos/${this.itemToDelete.id}`);
      await this.updateList();
      this.itemToDelete = { id: 0, nome: '', codigoBarras: '', preco: 0 };
      this.deleteConfirmationVisible = false;
      this.deleteMessage = '';
    } catch(error: unknown) {
      if (error instanceof Error && 'message' in error) {
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
