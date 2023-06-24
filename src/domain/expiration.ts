export class Expiration {
  private readonly DEFAULT_EXPIRATION_TIME_DURATION = 30;
  private date: Date;

  constructor(createdAt: Date, customExpirationDate?: Date) {
    this.date = this.setupDate(createdAt, customExpirationDate);
  }

  private setupDate(creationDate: Date, customExpirationDate?: Date) {
    if(!customExpirationDate) {
      const expirationDate = new Date(creationDate.toISOString());
      const dayInFuture = expirationDate.getUTCDate() + this.DEFAULT_EXPIRATION_TIME_DURATION;
      expirationDate.setUTCDate(dayInFuture);
      return expirationDate;
    }
    if(customExpirationDate < creationDate) throw new Error("Custom date should be bigger than creation date");
    return new Date(customExpirationDate);
  }

  public getDate() {
    return this.date.toISOString();
  }
}