export default class MathAd {
  public static Random(number: number) {
    const a = Math.random() * 100;
    if (number > a) {
      return true;
    } else {
      return false;
    }
  }
  public static nazo() {}
}
