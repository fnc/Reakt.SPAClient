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
    replies: Comment[];
    replyCount: number;
}
