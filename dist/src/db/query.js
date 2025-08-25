import { desc, eq, sql } from "drizzle-orm";
import { db } from "./drizzle.js";
import { commentsTable, postsTable, repliesTable, usersTable, } from "./schema.js";
export const getUserDb = async (username) => {
    const user = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.username, username));
    return user[0] ?? null;
};
export const insertUserDb = async (newUser) => {
    const user = await db.insert(usersTable).values(newUser).returning();
    return user[0] ?? null;
};
export const getPostDb = async (postId) => {
    if (!postId)
        return null;
    const post = await db
        .select({
        authorId: postsTable.authorId,
        body: postsTable.body,
        createdAt: postsTable.createdAt,
        headerImgPath: postsTable.headerImgPath,
        id: postsTable.id,
        published: postsTable.published,
        title: postsTable.title,
        updatedAt: postsTable.updatedAt,
        author: usersTable.username,
    })
        .from(postsTable)
        .innerJoin(usersTable, eq(usersTable.id, postsTable.authorId))
        .where(eq(postsTable.id, postId));
    return post[0] ?? null;
};
export const getPostsDb = async () => {
    const posts = await db
        .select()
        .from(postsTable)
        .orderBy(desc(postsTable.createdAt));
    return posts ?? null;
};
export const createPostDb = async (newPost) => {
    const post = await db.insert(postsTable).values(newPost).returning();
    return post[0] ?? null;
};
export const editPostDb = async (postId, updated) => {
    const updatedPost = await db
        .update(postsTable)
        .set({ updatedAt: sql `NOW()`, ...updated })
        .where(eq(postsTable.id, postId))
        .returning();
    return updatedPost[0] ?? null;
};
export const deletePostDb = async (postId) => {
    const deletedPost = await db
        .delete(postsTable)
        .where(eq(postsTable.id, postId))
        .returning();
    return deletedPost[0] ?? null;
};
export const getCommentsDb = async (postId) => {
    const comments = await db.query.commentsTable.findMany({
        where: eq(commentsTable.postId, postId),
        with: {
            replies: true,
            author: { columns: { username: true } },
        },
        orderBy: (comments, { desc }) => [desc(commentsTable.createdAt)],
    });
    if (!comments)
        return null;
    const totalCount = comments.length + comments.reduce((acc, c) => acc + c.replies.length, 0);
    return { comments, totalCount };
};
export const getCommentDb = async (commentId) => {
    const comment = await db
        .select()
        .from(commentsTable)
        .where(eq(commentsTable.id, commentId));
    return comment[0] ?? null;
};
export const createCommentDb = async (comment, postId, authorId) => {
    const createdComment = await db
        .insert(commentsTable)
        .values({ comment, postId, authorId })
        .returning();
    if (!createdComment)
        return null;
    const newComment = await db.query.commentsTable.findFirst({
        where: eq(commentsTable.id, createdComment[0].id),
        with: {
            replies: true,
            author: { columns: { username: true } },
        },
    });
    return newComment ?? null;
};
export const editCommentDb = async (commentId, newComment) => {
    const editedComment = await db
        .update(commentsTable)
        .set({ updatedAt: sql `NOW()`, ...newComment })
        .where(eq(commentsTable.id, commentId))
        .returning();
    return editedComment[0] ?? null;
};
export const deleteCommentDb = async (commentId) => {
    const deletedComment = await db
        .delete(commentsTable)
        .where(eq(commentsTable.id, commentId))
        .returning();
    return deletedComment[0] ?? null;
};
export const getRepliesDb = async (parentId) => {
    const replies = await db.query.repliesTable.findMany({
        where: eq(repliesTable.parentId, parentId),
        with: {
            author: { columns: { username: true } },
        },
    });
    return replies ?? null;
};
export const createReplyDb = async (comment, postId, authorId, parentId) => {
    const newReply = await db
        .insert(repliesTable)
        .values({
        comment,
        postId,
        authorId,
        parentId,
    })
        .returning();
    if (!newReply)
        return null;
    const createdReply = await db.query.repliesTable.findFirst({
        where: eq(repliesTable.id, newReply[0].id),
        with: {
            author: { columns: { username: true } },
        },
    });
    return createdReply ?? null;
};
export const getUserPostsDb = async (userId) => {
    const userPosts = await db
        .select()
        .from(postsTable)
        .where(eq(postsTable.authorId, userId));
    return userPosts ?? null;
};
export const getEditorsPostsDb = async () => {
    const editorsPosts = await db
        .select({
        id: postsTable.id,
        title: postsTable.title,
        body: postsTable.body,
        headerImgPath: postsTable.headerImgPath,
        published: postsTable.published,
        createdAt: postsTable.createdAt,
        updatedAt: postsTable.updatedAt,
        authorId: postsTable.authorId,
        author: usersTable.username,
    })
        .from(postsTable)
        .innerJoin(usersTable, eq(usersTable.id, postsTable.authorId))
        .where(eq(usersTable.roleId, 1))
        .orderBy(desc(postsTable.createdAt))
        .limit(5);
    return editorsPosts ?? null;
};
