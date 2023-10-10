export interface BookDaoInterface {
  findAllBooks(): Promise<any>;
  createBook(name: string, author: string): Promise<any>;
  updateBook(id: string, name: string, author: string): Promise<any>;
  deleteBook(id: string): Promise<any>;
}

export interface AuthDaoInterface {
  loginUser(userInfo: { username: string; password: string }): Promise<any>;
  registerUser(userInfo: { username: string; password: string }): Promise<any>;
}