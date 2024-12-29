// utils/parseFormalinCode.ts

export interface ParsedFormalinCode {
    serialNumber: string;
    lotNumber: string;
    expirationDate: Date;
    size: string;
  }
  
  export const parseFormalinCode = (code: string): ParsedFormalinCode | null => {
    if (code.length !== 48) {
      return null;
    }
  
    // シリアルナンバー：コード内の位置を特定して抽出
    const serialNumber = code.substring(34, 48); // 34文字目から14文字
  
    // ロットナンバー
    const lotNumber = code.substring(26, 32); // 26文字目から6文字
  
    // 有効期限
    const expiration = code.substring(18, 24); // 18文字目から6文字
    const expYear = parseInt('20' + expiration.substring(0, 2), 10); // 20XX年
    const expMonth = parseInt(expiration.substring(2, 4), 10); // 月
    const expDay = parseInt(expiration.substring(4, 6), 10); // 日
    const expirationDate = new Date(Date.UTC(expYear, expMonth - 1, expDay)); // 月は0始まり
  
    // 規格
    const productCode = code.substring(0, 16); // 1文字目から16文字
    let size = '';
    if (productCode === '0104517715966683') {
      size = '25ml';
    } else if (productCode === '0104517715967246') {
      size = '40ml';
    } else {
      size = '不明';
    }
  
    return {
      serialNumber,
      lotNumber,
      expirationDate,
      size,
    };
  };
  