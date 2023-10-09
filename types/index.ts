export interface BookDaoInterface {
  findAllBooks(): Promise<any>;
  createBook(name: string, author: string): Promise<any>;
  updateBook(id: string, name: string, author: string): Promise<any>;
  deleteBook(id: string): Promise<any>;
}
