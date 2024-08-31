export type Room = {
  id: string;
  name?: string | null;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
};

export type CreateRoom = Omit<
  Room,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
>;

export type ChatMessage = {
  id: string;
  roomId: string;
  userId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
};

export type CreateMessage = Omit<
  ChatMessage,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
>;

export type UserRoom = {
  id: string;
  userId: string;
  roomId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
};
