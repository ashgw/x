import type { ClientInferRequest, ClientInferResponses } from "@ts-rest/core";
import type { v1Contract } from "./contract";

type Contract = typeof v1Contract;

export type RouterInputs = ClientInferRequest<Contract>;

export type RouterOutputs = ClientInferResponses<Contract>;
