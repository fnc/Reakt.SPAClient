// TODO: this are exactly the same.. should they remain separated in case the contract changes in the future, or is it ok like this?
export interface Reply {
    message: string;
}

export interface NewComment {
    message: string;
}

export interface Comment {
    likes: number;
    message: string;
    replyCount: number;
    id: number;
    createdAt: Date;
    deletedAt: Date;
    updatedAt: Date;
}