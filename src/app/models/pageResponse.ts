export class PageResponse<T> {

  data: Array<T> = [];//records
  totalRegisters!: number;//totalRecords
  filteredRecords!: number;
  registersThisPage!: number;//pageSize
  first!: number; // first or offset
  offset!: number;
 // filters: any;
}
