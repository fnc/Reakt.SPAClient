interface Auditable {
  id: number;
  createdAt: Date;
  deletedAt: Date;
  updatedAt: Date;
}

// TODO: this are exactly the same.. should they remain separated in case the contract changes in the future, or is it ok like this?
export interface Reply {
    message: string;
}

export interface NewComment {
    message: string;    
}

export interface NewPost {
  title: string;
  description: string;  
}

export interface Comment extends Auditable {
    likes: number;
    message: string;
    replyCount: number;    
}

export interface Board extends Auditable {
  title: string;
  description: string;  
}