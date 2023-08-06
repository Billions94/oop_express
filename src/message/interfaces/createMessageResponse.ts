export interface CreateMessageResponse {
  statusCode: number;
  errorMessage: string;
  data: {
    id: number;
  } | null;
}
