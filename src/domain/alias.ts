export class Alias {
  constructor(private content?: string) {
    this.validate();
    this.sanitize();
  }
  public validate() {
    if(this.isLengthValid()) throw new Error("The alias should not have more than 20 characters");
  }

  private isLengthValid() {
    return this.content && this.content.length > 20;
  }

  private sanitize() {
    this.content = this.content?.trim().replace(/\s+/g, '-');
  }

  public getContent() {
    return this.content as string;
  }

  public isEmpty() {
    return !this.content;
  }
}