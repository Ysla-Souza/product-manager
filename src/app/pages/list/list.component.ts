import { Component } from '@angular/core';

interface IProduct {
  name: string;
  code: string;
  price: number;
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
    this.list = [
      { name: 'Produto 1', code: '123456789', price: 23.00 },
      { name: 'Produto 2', code: '987654321', price: 22.00 },
      { name: 'Produto 3', code: '246810121', price: 23.00 },
      { name: 'Produto 4', code: '135791113', price: 24.85 },
      { name: 'Produto 5', code: '510152025', price: 35.00 },
      { name: 'Produto 1', code: '123456789', price: 23.00 },
      { name: 'Produto 2', code: '987654321', price: 22.00 },
      { name: 'Produto 3', code: '246810121', price: 23.00 },
    ];
    this.itemToDelete = { name: '', code: '', price: 0 };
    this.deleteConfirmationVisible = false;
  };

  deleteItem(product: IProduct): void {
    this.itemToDelete = { name: product.name, code: product.code, price: product.price };
    this.deleteConfirmationVisible = true;
  };

  confirmDelete(): void {
    console.log("executa a exclusão");
    this.itemToDelete = { name: '', code: '', price: 0 };
    this.deleteConfirmationVisible = false;
  };
  cancelDelete(): void {
    this.itemToDelete = { name: '', code: '', price: 0 };
    this.deleteConfirmationVisible = false;
  };
}
