import crypto from "node:crypto";

export class URLHash {
  private hash: string;
  private charset = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  constructor(private readonly url: string) {
    this.hash = this.createHash();
  }

  private createHash() {
    const toHash = `${this.url}-${crypto.randomUUID()}`
    const hashedUrl = crypto.createHash("sha256")
      .update(toHash)
      .digest();
    
    const hashEncodedInBase62 = this.encodeInBase62(hashedUrl);
    return hashEncodedInBase62.slice(0, 7);
  }

  private encodeInBase62(content: Buffer) {
    const BASE = 62;
    let contentToInt = this.bufferToInteger(content);
    let encodedContent = "";
    while(contentToInt > 0) {
      const rest = contentToInt % BASE;
      contentToInt = Math.floor(contentToInt / BASE);
      encodedContent += this.charset[rest]; 
    }
    encodedContent = encodedContent.split('').reverse().join('');
    return encodedContent;
  }

  private bufferToInteger(content: Buffer) {
    const hexadecimalString = content.toString("hex");
    return parseInt(hexadecimalString, 16);
  }

  public getContent() {
    return this.hash;
  }
}