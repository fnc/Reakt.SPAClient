export interface Post {    
    id: number;
    title: string;
    description: string;
    createdAt: Date;  
}

export interface Board {    
    id: number;
    title: string;
    description: string;
    posts: number[];    
}

export interface Comment {    
    id: number;
    likes: number;
    message: string;
    parentId: number;    
}