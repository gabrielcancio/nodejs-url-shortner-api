export class ShortnedUrlRepositoryInMemory {
  private registers = [] as Register[];

  public async save(register: Register) {
    this.registers.push(register);
  }
  public async getByShortnedUrl(url: string) {
    return this.registers.find(register => register.generatedUrl === url);
  }

  public isUrlSaved(url: string) {
    return this.registers.some(register => register.url === url);
  }

  public getRegistersWithSameAliasCount(url: string) {
    return this.registers.filter(register => register.url === url && register.isAliased).length;
  }
}

type Register = {
  url: string; 
  generatedUrl: string; 
  expiresAt: string;
  isAliased: boolean;
}