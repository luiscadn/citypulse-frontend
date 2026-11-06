/** Campos que se usan del usuario que devuelve el backend (trae más, se ignoran). */
export interface FriendUserDto {
  id: number;
  username: string;
  fullName: string;
}

/** Respuesta de GET /friendships. */
export interface FriendshipSummaryDto {
  friends: FriendUserDto[];
  pendingReceived: { id: number; from: FriendUserDto }[];
  pendingSent: { id: number; to: FriendUserDto }[];
}

/** Respuesta de GET /users/search (paginada; solo se usan estos campos). */
export interface UserSearchPageDto {
  data: FriendUserDto[];
  total: number;
}
