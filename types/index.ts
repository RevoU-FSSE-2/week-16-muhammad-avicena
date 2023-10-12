export interface BookDaoInterface {
  findAllBooks(accessToken: string): Promise<any>;
  createBook(accessToken: string, name: string, author: string): Promise<any>;
  updateBook(accessToken: string, id: string, name: string): Promise<any>;
  deleteBook(id: string, accessToken: string): Promise<any>;
}

export interface AuthDaoInterface {
  loginUser(userInfo: { username: string; password: string }): Promise<any>;
  registerUser(userInfo: { username: string; password: string }): Promise<any>;
}
