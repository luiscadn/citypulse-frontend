/** Elemento de GET /invitations/pending: solo los campos que se usan (el backend trae más, se ignoran). */
export interface PendingInvitationDto {
  id: number;
  message: string | null;
  event: {
    id: string;
    title: string;
    startDate: string;
    endDate: string;
  };
  fromUser: {
    id: number;
    username: string;
    fullName: string;
  };
}
