import { Component } from '@angular/core';
import axios from 'axios';

interface IProduct {
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

  constructor() {
    this.list = [];
    this.itemToDelete = { nome: '', codigoBarras: '', preco: 0 };
    this.deleteConfirmationVisible = false;
  };

  async ngOnInit() {
    const list = await axios.get('http://localhost:8080/api/produtos');
    this.list = list.data;
  };

  deleteItem(product: IProduct): void {
    this.itemToDelete = { nome: product.nome, codigoBarras: product.codigoBarras, preco: product.preco };
    this.deleteConfirmationVisible = true;
  };

  confirmDelete(): void {
    console.log("executa a exclusão");
    this.itemToDelete = { nome: '', codigoBarras: '', preco: 0 };
    this.deleteConfirmationVisible = false;
  };
  cancelDelete(): void {
    this.itemToDelete = { nome: '', codigoBarras: '', preco: 0 };
    this.deleteConfirmationVisible = false;
  };
}
