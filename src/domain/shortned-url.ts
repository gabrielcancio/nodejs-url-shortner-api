import "dotenv/config";
import { URLHash } from "./url-hash";
import { Alias } from "./alias";
import { Expiration } from "./expiration";

export class ShortnedURL {
  private content: string;
  private createdAt: Date;
  private expiresAt: Expiration;
  private BASE_URL = process.env.BASE_URL;

  constructor(private readonly originalUrl: string, private alias: Alias) {
    this.validate();
    this.content = this.getNewUrl();
    this.createdAt = new Date();
    this.expiresAt = new Expiration(this.createdAt);
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

  public getExpirationDate() {
    return this.expiresAt.getDate();
  }

  public get() {
    return this.content;
  }

}