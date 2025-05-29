export type ModalState<T> =
  | {
      visible: true;
      entity: T;
    }
  | {
      visible: false;
    };
