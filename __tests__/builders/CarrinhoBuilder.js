import { Carrinho } from "../../src/domain/Carrinho.js";
import { Item } from "../../src/domain/Item.js";
import { User } from "../../src/domain/User.js";

export class CarrinhoBuilder {
  constructor() {
    this.user = new User(1, "Usuario Padrao", "usuario@exemplo.com", "PADRAO");
    this.itens = [new Item("Item Padrao", 100)];
  }

  comUser(user) {
    this.user = user;
    return this;
  }

  comItens(itens) {
    this.itens = itens;
    return this;
  }

  vazio() {
    this.itens = [];
    return this;
  }

  build() {
    return new Carrinho(this.user, this.itens);
  }

  static umCarrinhoPadrao() {
    return new CarrinhoBuilder();
  }
}
