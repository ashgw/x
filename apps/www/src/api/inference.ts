import type { ClientInferRequest, ClientInferResponses } from "@ts-rest/core";
import type { Contract } from "./contract";

export type RouterInputs = ClientInferRequest<Contract>;

export type RouterOutputs = ClientInferResponses<Contract>;
