export class GetCatsQueryDTO {
  /**
   * Часть имени кота, для поиска котом с именем 'Барсик', 'Шмарсик', 'Сик-Приг' для значения 'сик':
   * @example 'сик'
   */
  term: string;
}
