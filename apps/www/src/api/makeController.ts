import type { AppRouter } from "@ts-rest/core";
import type { ControllerShape } from "./types";

export const makeController =
  <C extends AppRouter>(_contract: C) =>
  <S extends ControllerShape<C>>(s: S): S =>
    s;
