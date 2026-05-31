import { User } from "../../src/domain/User.js";

export class UserMother {
  static umUsuarioPadrao() {
    return new User(1, "Usuario Padrao", "usuario@exemplo.com", "PADRAO");
  }

  static umUsuarioPremium() {
    return new User(2, "Usuario Premium", "premium@email.com", "PREMIUM");
  }
}
