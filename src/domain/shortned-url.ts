import "dotenv/config";
import { URLHash } from "./url-hash";
import { Alias } from "./alias";

export class ShortnedURL {
  private content: string;
  private createdAt: Date;
  private expiresAt!: Date;
  private BASE_URL = process.env.BASE_URL;
  private readonly EXPIRATION_TIME_DURATION = 30;

  constructor(private readonly originalUrl: string, private alias: Alias) {
    this.validate();
    this.content = this.getNewUrl();
    this.createdAt = new Date();
    this.setExpirationDate();
  }

  private getNewUrl() {
    if(this.alias.isEmpty()) {
      const hash = new URLHash(this.originalUrl);
      return this.normalizeGeneratedUrl(hash.getContent());
    }
    return this.normalizeGeneratedUrl(this.alias.getContent());
  };

  private normalizeGeneratedUrl(urlHash: string) {
    return `${this.BASE_URL}/${urlHash}`;
  }

  private validate() {
    if(!this.originalUrl) throw new Error("The url should not be empty");
  }

  private setExpirationDate() {
    const expirationDay = this.createdAt.getUTCDate() + this.EXPIRATION_TIME_DURATION;
    this.expiresAt = new Date(this.createdAt);
    this.expiresAt.setUTCDate(expirationDay);
  }

  public getExpirationDate() {
    return this.expiresAt.toISOString();
  }

  public get() {
    return this.content;
  }

}