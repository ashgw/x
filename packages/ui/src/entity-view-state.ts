export type EntityViewState<T> =
  | {
      visible: true;
      entity: T;
    }
  | {
      visible: false;
    };
