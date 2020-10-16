export interface Post {    
    id: number;
    title: string;
    description: string;
    createdAt: Date;      
    likes: number;
}

export interface Board {    
    id: number;
    title: string;
    description: string;       
}

export interface Comment {    
    id: number;
    likes: number;
    message: string;
    createdAt: Date;
    deletedAt: Date;
    updatedAt: Date;      
    replies: number[];
    replyCount: number;
    isRootComment: boolean;
}

// Future purposes: aka when user is added. 
export interface Like {
  commentId: number;
}