import { CheckoutService } from "../src/services/CheckoutService.js";
import { CarrinhoBuilder } from "./builders/CarrinhoBuilder.js";
import { UserMother } from "./builders/UserMother.js";
import { Item } from "../src/domain/Item.js";

describe("CheckoutService", () => {
  test("quando o pagamento falha, deve retornar null e não persistir nem enviar email", async () => {
    const carrinho = new CarrinhoBuilder().vazio().build();

    const gatewayStub = {
      cobrar: jest.fn().mockResolvedValue({ success: false }),
    };
    const repositoryDummy = { salvar: jest.fn() };
    const emailDummy = { enviarEmail: jest.fn() };

    const checkout = new CheckoutService(
      gatewayStub,
      repositoryDummy,
      emailDummy,
    );

    const pedido = await checkout.processarPedido(carrinho, "cartao-qualquer");

    expect(pedido).toBeNull();
    expect(repositoryDummy.salvar).not.toHaveBeenCalled();
    expect(emailDummy.enviarEmail).not.toHaveBeenCalled();
  });

  test("quando um cliente Premium finaliza a compra, aplica desconto e envia email", async () => {
    const usuarioPremium = UserMother.umUsuarioPremium();
    const item200 = new Item("Produto X", 200);
    const carrinho = new CarrinhoBuilder()
      .comUser(usuarioPremium)
      .comItens([item200])
      .build();

    const gatewayStub = {
      cobrar: jest.fn().mockResolvedValue({ success: true }),
    };

    const repositoryStub = {
      salvar: jest.fn().mockImplementation(async (pedido) => {
        pedido.id = 123;
        return pedido;
      }),
    };

    const emailMock = { enviarEmail: jest.fn().mockResolvedValue() };

    const checkout = new CheckoutService(
      gatewayStub,
      repositoryStub,
      emailMock,
    );

    const pedido = await checkout.processarPedido(carrinho, "cartao-premium");

    // Total 200 com 10% de desconto => 180
    expect(gatewayStub.cobrar).toHaveBeenCalledWith(180, "cartao-premium");
    expect(repositoryStub.salvar).toHaveBeenCalledTimes(1);
    expect(emailMock.enviarEmail).toHaveBeenCalledTimes(1);
    expect(emailMock.enviarEmail).toHaveBeenCalledWith(
      usuarioPremium.email,
      "Seu Pedido foi Aprovado!",
      `Pedido 123 no valor de R$180`,
    );

    expect(pedido).not.toBeNull();
    expect(pedido.id).toBe(123);
  });
});
