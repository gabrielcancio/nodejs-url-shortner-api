import "dotenv/config";
import { URLHash } from "./url-hash";

export class ShortnedURL {
  private content: string;
  private createdAt: Date;
  private expiresAt!: Date;
  private BASE_URL = process.env.BASE_URL;
  private readonly EXPIRATION_TIME_DURATION = 30;

  constructor(private readonly originalUrl: string, private alias?: string) {
    this.validate();
    this.content = this.getNewUrl();
    this.createdAt = new Date();
    this.setExpirationDate();
  }

  private getNewUrl() {
    if(!this.alias) {
      const hash = new URLHash(this.originalUrl);
      return this.normalizeGeneratedUrl(hash.getContent());
    }
    this.alias = this.alias.trim().replace(/\s+/g, '-');
    return this.normalizeGeneratedUrl(this.alias);
  };

  private normalizeGeneratedUrl(urlHash: string) {
    return `${this.BASE_URL}/${urlHash}`;
  }

  private validate() {
    if(!this.originalUrl) throw new Error("The url should not be empty");
    if(this.isAliasAnEmptyString()) throw new Error("The alias passed should not be empty");
    if(this.isAliasLengthInvalid()) throw new Error("Alias should not be bigger than 20 characters");
  }

  private isAliasAnEmptyString() {
    return typeof this.alias === "string" && this.alias.length === 0;
  }

  private isAliasLengthInvalid() {
    return this.alias && this.alias.length > 20;
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