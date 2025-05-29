export class WordCounter {
  public static countWords(text: string): number {
    return text.trim().split(/\s+/).filter(Boolean).length;
  }

  public static countMinutesToRead(text: string): number {
    return Math.max(1, Math.ceil(this.countWords(text) / 200));
  }
}
