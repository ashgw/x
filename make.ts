const iterableObject = {
  data: [1, 2, 3],
  [Symbol.iterator]: function () {
    let index = 0;
    return {
      next: () => ({
        value: this.data[index++],
        done: index > this.data.length,
      }),
    };
  },
};

for (const item of iterableObject) {
  console.log(item);
}
